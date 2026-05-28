# -*- coding: utf-8 -*-
"""
scripts/update_clips.py

Twitch Helix REST APIから配信者 'newsaan' の全クリップデータを再帰的に取得し、
更新日付と総件数のメタデータを付与した静的JSONファイル (data/clips.json) を自動生成するスクリプト。

このスクリプトはGitHub Actions等で定期実行され、JAMstackのデータソースとして機能します。
"""

import os
import sys
import json
import requests
from datetime import datetime, timezone, timedelta

def main():
    # 1. 環境変数の取得
    client_id = os.environ.get("TWITCH_CLIENT_ID")
    client_secret = os.environ.get("TWITCH_CLIENT_SECRET")

    if not client_id or not client_secret:
        print("エラー: TWITCH_CLIENT_ID と TWITCH_CLIENT_SECRET の環境変数を設定してください。")
        sys.exit(1)

    print("1. OAuth アプリアクセストークンを取得中...")
    token_url = "https://id.twitch.tv/oauth2/token"
    token_params = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials"
    }
    try:
        res = requests.post(token_url, params=token_params)
        res.raise_for_status()
        token_data = res.json()
        access_token = token_data["access_token"]
    except Exception as e:
        print(f"OAuthトークン取得エラー: {e}")
        sys.exit(1)

    headers = {
        "Client-Id": client_id,
        "Authorization": f"Bearer {access_token}"
    }

    print("2. 配信者 'newsaan' のユーザーIDを取得中...")
    user_url = "https://api.twitch.tv/helix/users"
    user_params = {"login": "newsaan"}
    try:
        res = requests.get(user_url, headers=headers, params=user_params)
        res.raise_for_status()
        user_data = res.json().get("data", [])
        if not user_data:
            print("エラー: 配信者 'newsaan' が見見つかりませんでした。")
            sys.exit(1)
        broadcaster_id = user_data[0]["id"]
        print(f"ユーザーID取得成功: {broadcaster_id}")
    except Exception as e:
        print(f"ユーザーID取得エラー: {e}")
        sys.exit(1)

    print("3. 全クリップデータを取得中...")
    clips_url = "https://api.twitch.tv/helix/clips"
    clips_params = {
        "broadcaster_id": broadcaster_id,
        "first": 100
    }

    all_clips_raw = []
    cursor = None

    while True:
        if cursor:
            clips_params["after"] = cursor
        else:
            clips_params.pop("after", None)

        try:
            res = requests.get(clips_url, headers=headers, params=clips_params)
            res.raise_for_status()
            res_data = res.json()
        except Exception as e:
            print(f"クリップ取得中にエラーが発生しました (件数: {len(all_clips_raw)}): {e}")
            sys.exit(1)

        clips = res_data.get("data", [])
        if not clips:
            break

        all_clips_raw.extend(clips)
        print(f"  取得中... (+{len(clips)}件 / 累計: {len(all_clips_raw)}件)")

        pagination = res_data.get("pagination", {})
        cursor = pagination.get("cursor")
        if not cursor:
            break

    print(f"すべてのクリップ取得完了！合計: {len(all_clips_raw)} 件")

    # 4. game_id から game_name へのマッピングを解決
    print("4. ゲーム情報の解決中...")
    game_ids = set()
    for clip in all_clips_raw:
        gid = clip.get("game_id")
        if gid and gid != "0" and gid != "":
            game_ids.add(gid)

    game_id_to_name = {}
    game_ids_list = list(game_ids)
    chunk_size = 100

    for i in range(0, len(game_ids_list), chunk_size):
        chunk = game_ids_list[i:i + chunk_size]
        games_url = "https://api.twitch.tv/helix/games"
        try:
            res = requests.get(games_url, headers=headers, params={"id": chunk})
            res.raise_for_status()
            games_data = res.json().get("data", [])
            for g in games_data:
                game_id_to_name[g["id"]] = g["name"]
        except Exception as e:
            print(f"ゲーム情報取得エラー (スキップして続行します): {e}")

    print(f"ゲーム名の解決完了: {len(game_id_to_name)} 個のゲームをマッピングしました。")

    # 5. フロントエンド用のデータ形式にマッピング
    print("5. データを整形中...")
    mapped_clips = []
    for clip in all_clips_raw:
        # duration を "分:秒" に変換 (Helix API では float 秒)
        duration_sec_float = clip.get("duration", 0)
        duration_seconds = int(duration_sec_float)
        minutes = duration_seconds // 60
        seconds = duration_seconds % 60
        duration_str = f"{minutes}:{seconds:02d}"

        # 閲覧数 (Helix は view_count)
        view_count = clip.get("view_count", 0)

        # ゲーム名
        game_id = clip.get("game_id")
        game_name = game_id_to_name.get(game_id, "Unknown")

        # プレイリスト用/iframe用のスラッグ (Helix は id がそのまま slug として使えます)
        clip_slug = clip.get("id")

        mapped_clips.append({
            "id": clip.get("id"),
            "title": clip.get("title"),
            "game_name": game_name,
            "view_count": view_count,
            "created_at": clip.get("created_at"),
            "duration": duration_str,
            "thumbnail_url": clip.get("thumbnail_url"),
            "clip_slug": clip_slug
        })

    # 日本時間 (JST) の現在日時メタデータを生成 (UTC+9)
    jst_timezone = timezone(timedelta(hours=9))
    now_jst = datetime.now(timezone.utc).astimezone(jst_timezone)
    formatted_jst_time = now_jst.strftime("%Y-%m-%d %H:%M:%S")

    output_data = {
        "updated_at": formatted_jst_time,
        "total_count": len(mapped_clips),
        "clips": mapped_clips
    }

    # 保存処理
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "..", "data")
    os.makedirs(data_dir, exist_ok=True)
    file_path = os.path.join(data_dir, "clips.json")

    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        print(f"🎉 成功しました！")
        print(f"総数 {len(mapped_clips)} 件のクリップデータを {file_path} に保存しました。")
    except Exception as e:
        print(f"ファイル書き込みエラー: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
