/**
 * newsaan-clipsite: モックデータ定義
 * 
 * TwitchのクリップAPIから取得できるデータを模したテストデータです。
 * 日付、閲覧数、ゲームタイトルをばらつかせることで、
 * ソートや検索、期間指定フィルターのテストが正常に行えるように設計しています。
 */

const CLIPS_DATA = [
    {
        id: "clip_01",
        title: "新シーズン開幕！トリプルキルで部隊壊滅させるnewsaan",
        game_name: "Apex Legends",
        view_count: 45200,
        created_at: "2026-05-15T18:30:00Z",
        duration: "0:30",
        thumbnail_url: "./img/game_apex.png",
        clip_slug: "BraveBoredPastaFrankerZ-8Nqj9L-gH7Fm-K6C"
    },
    {
        id: "clip_02",
        title: "奇跡の脱出劇！奈落に落ちる寸前でエリトラ起動",
        game_name: "Minecraft",
        view_count: 12800,
        created_at: "2026-05-18T14:15:00Z",
        duration: "0:45",
        thumbnail_url: "./img/game_minecraft.png",
        clip_slug: "SillyBouncingGooseVoHiYo-v0f81d-s6S"
    },
    {
        id: "clip_03",
        title: "完璧なリコイル制御と異次元のフリックエイム！",
        game_name: "VALORANT",
        view_count: 32400,
        created_at: "2026-05-20T21:45:00Z",
        duration: "0:28",
        thumbnail_url: "./img/game_valorant.png",
        clip_slug: "ColdObviousAdminShibe-R1-X3-1_S-v8"
    },
    {
        id: "clip_04",
        title: "マイクラのトラップタワー建設中にハプニング発生",
        game_name: "Minecraft",
        view_count: 8500,
        created_at: "2026-05-12T09:20:00Z",
        duration: "1:00",
        thumbnail_url: "./img/game_minecraft.png",
        clip_slug: "ShortBeautifulWrenchRaccAttack-7g-y_A4S"
    },
    {
        id: "clip_05",
        title: "ラスト1on3から驚異のクラッチ勝利！",
        game_name: "VALORANT",
        view_count: 55000,
        created_at: "2026-05-25T23:10:00Z",
        duration: "0:58",
        thumbnail_url: "./img/game_valorant.png",
        clip_slug: "AffectionateAggressiveRedpandaUnicorn-vS"
    },
    {
        id: "clip_06",
        title: "物資あさり中に背後から忍び寄る謎の敵に悲鳴",
        game_name: "Apex Legends",
        view_count: 3200,
        created_at: "2026-05-08T16:05:00Z",
        duration: "0:30",
        thumbnail_url: "./img/game_apex.png",
        clip_slug: "TenseDeterminedDolphinTheRinger-9s-X"
    },
    {
        id: "clip_07",
        title: "深夜の超大作建築！ついに巨大な城門が完成する",
        game_name: "Minecraft",
        view_count: 15400,
        created_at: "2026-05-22T02:50:00Z",
        duration: "0:40",
        thumbnail_url: "./img/game_minecraft.png",
        clip_slug: "SmoothPleasantPigeonPunchTrees-vL_0"
    },
    {
        id: "clip_08",
        title: "ウルト直撃で自爆し大爆笑するnewsaan",
        game_name: "Apex Legends",
        view_count: 19800,
        created_at: "2026-05-24T19:40:00Z",
        duration: "0:25",
        thumbnail_url: "./img/game_apex.png",
        clip_slug: "CarefulDullYakBuddhaBar-vS"
    }
];

// 静的HTMLから読み込んだ際にグローバル参照できるようにwindowにアタッチ
window.CLIPS_DATA = CLIPS_DATA;
