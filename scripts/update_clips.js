/**
 * scripts/update_clips.js
 * 
 * Twitch GraphQL APIから配信者 'newsaan' の全クリップデータを再帰的に取得し、
 * 更新日付と総件数のメタデータを付与した静的JSONファイル (data/clips.json) を自動生成するスクリプト。
 * 
 * このスクリプトはGitHub Actions等で定期実行され、JAMstackのデータソースとして機能します。
 */

const fs = require('fs');
const path = require('path');

const GQL_URL = 'https://gql.twitch.tv/gql';
const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko'; // TwitchパブリッククライアントID

async function fetchAllClips() {
    let allClips = [];
    let hasNextPage = true;
    let cursor = "";
    
    console.log("Twitch APIから clips の全件取得を開始します...");

    // hasNextPage が true である限り、ページネーションでデータを無限ループ取得
    while (hasNextPage) {
        // カーソル指定に対応したGraphQLクエリ
        const query = `
            query($login: String!, $cursor: String) {
                user(login: $login) {
                    clips(first: 100, after: $cursor) {
                        edges {
                            cursor
                            node {
                                id
                                slug
                                title
                                viewCount
                                createdAt
                                durationSeconds
                                game {
                                    name
                                }
                                thumbnailURL
                            }
                        }
                        pageInfo {
                            hasNextPage
                        }
                    }
                }
            }
        `;

        const variables = {
            login: "newsaan",
            cursor: cursor || null
        };

        try {
            const response = await fetch(GQL_URL, {
                method: 'POST',
                headers: {
                    'Client-ID': CLIENT_ID,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query, variables })
            });

            if (!response.ok) {
                throw new Error(`Twitch GQL HTTP Error: ${response.status}`);
            }

            const res = await response.json();
            
            if (!res.data || !res.data.user || !res.data.user.clips) {
                throw new Error("配信者データまたはクリップ情報がAPIから取得できませんでした。");
            }

            const clipsData = res.data.user.clips;
            const edges = clipsData.edges;

            if (edges.length === 0) {
                break;
            }

            // 取得したクリップを整形して配列に蓄積
            edges.forEach(edge => {
                const n = edge.node;
                const min = Math.floor(n.durationSeconds / 60);
                const sec = String(n.durationSeconds % 60).padStart(2, '0');
                
                allClips.push({
                    id: n.id,
                    title: n.title,
                    game_name: n.game ? n.game.name : "Unknown",
                    view_count: n.viewCount,
                    created_at: n.createdAt,
                    duration: `${min}:${sec}`,
                    thumbnail_url: n.thumbnailURL,
                    clip_slug: n.slug
                });
            });

            console.log(`現在、計 ${allClips.length} 件のクリップをメモリにロードしました...`);

            // 次のページがあるか判定し、次のカーソルを取得
            hasNextPage = clipsData.pageInfo.hasNextPage;
            if (hasNextPage) {
                cursor = edges[edges.length - 1].cursor;
            }
            
        } catch (error) {
            console.error("データ取得中にエラーが発生しました:", error);
            process.exit(1);
        }
    }

    // --- 日本時間 (JST) の現在日時メタデータを生成 ---
    // GitHub Actions のランナーは UTC（協定世界時）で動くため、強制的に日本時間 (+9時間) にマッピングします
    const now = new Date();
    const jstOffset = 9 * 60 * 60 * 1000; // JST は UTC+9
    const jstDate = new Date(now.getTime() + jstOffset);
    
    // YYYY-MM-DD HH:mm:ss 形式に整形
    const yyyy = jstDate.getUTCFullYear();
    const mm = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(jstDate.getUTCDate()).padStart(2, '0');
    const hh = String(jstDate.getUTCHours()).padStart(2, '0');
    const min = String(jstDate.getUTCMinutes()).padStart(2, '0');
    const ss = String(jstDate.getUTCSeconds()).padStart(2, '0');
    
    const formattedJstTime = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

    // 静的出力JSONデータの組み立て
    const outputData = {
        updated_at: formattedJstTime,
        total_count: allClips.length,
        clips: allClips
    };

    // 出力先フォルダ (data/) の作成
    const dirPath = path.join(__dirname, '../data');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // JSONファイルとして保存
    const filePath = path.join(dirPath, 'clips.json');
    fs.writeFileSync(filePath, JSON.stringify(outputData, null, 2), 'utf-8');
    
    console.log(`🎉 完了しました！`);
    console.log(`総数 ${allClips.length} 件のクリップデータを ${filePath} に保存しました。`);
}

fetchAllClips();
