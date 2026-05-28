/**
 * newsaan-clipsite: メインJavaScriptロジック (JAMstack & ページネーション & ゲームフィルタ対応版)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const clipsGrid = document.getElementById('clips-grid');
    const resultsCount = document.getElementById('results-count');
    const totalCountBadge = document.getElementById('total-count-badge');
    const dataUpdatedAt = document.getElementById('data-updated-at');
    
    // フィルター系DOM要素
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const logicAndInput = document.getElementById('logic-and');
    const logicOrInput = document.getElementById('logic-or');
    const gameSelect = document.getElementById('game-select');
    const dateStartInput = document.getElementById('date-start');
    const dateEndInput = document.getElementById('date-end');
    const sortSelect = document.getElementById('sort-select');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    
    // ページネーション系DOM要素
    const paginationContainer = document.querySelector('.pagination-container');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageNumbersContainer = document.getElementById('page-numbers');

    // モーダル系DOM要素
    const videoModal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalGame = document.getElementById('modal-game');
    const modalViews = document.getElementById('modal-views');
    const modalDate = document.getElementById('modal-date');
    const modalVideoWrapper = document.querySelector('.modal-video-wrapper');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewListBtn = document.getElementById('view-list-btn');

    // --- アプリケーションの状態管理 (State) ---
    let allClips = [];       // JSONからロードした全クリップデータを保持
    let filteredClips = [];  // 検索・フィルター・ソートを適用した結果のクリップデータを保持
    
    let currentPage = 1;     // 現在の表示ページ (1からスタート)
    const itemsPerPage = 100; // 1ページあたりの表示件数 (仕様：100件単位)
    let currentView = 'grid'; // 'grid' または 'list' (表示形式)

    const filterState = {
        searchQuery: '',
        logic: 'AND',        // 'AND' または 'OR' (複数キーワード検索時の挙動)
        gameCategory: 'all', // ゲームカテゴリの絞り込み値 ('all' または ゲーム名)
        dateStart: '',       // YYYY-MM-DD
        dateEnd: '',         // YYYY-MM-DD
        sortBy: 'views-desc' // デフォルトは閲覧数の多い順
    };

    /**
     * 1. 閲覧数の表示用フォーマット変換関数
     * (例: 45200 -> "4.5万", 8500 -> "8,500")
     */
    function formatViews(views) {
        if (views >= 10000) {
            return `${(views / 10000).toFixed(1)}万`;
        }
        return views.toLocaleString();
    }

    /**
     * 2. 日付の表示用フォーマット変換関数
     * (ISO形式 -> "YYYY/MM/DD")
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}/${mm}/${dd}`;
    }

    /**
     * 3. データ更新日時の日本語フォーマット変換関数
     * (例: "2026-05-29 01:09:22" -> "2026年05月29日 01時09分 時点")
     */
    function formatUpdatedAt(dateStr) {
        if (!dateStr) return '--';
        
        // "YYYY-MM-DD HH:mm:ss" を分割して整形
        const parts = dateStr.split(/[- :]/);
        if (parts.length >= 5) {
            return `${parts[0]}年${parts[1]}月${parts[2]}日 ${parts[3]}時${parts[4]}分 時点`;
        }
        return dateStr;
    }

    /**
     * 4. クリップカード単体のHTML要素生成
     */
    function createClipCard(clip) {
        const card = document.createElement('div');
        card.className = 'clip-card';
        card.dataset.id = clip.id;

        card.innerHTML = `
            <div class="clip-thumb">
                <img src="${clip.thumbnail_url}" alt="${clip.title}" loading="lazy">
                <div class="clip-meta-overlay">
                    <span class="clip-views">
                        <i data-lucide="eye"></i>
                        <span>${formatViews(clip.view_count)} views</span>
                    </span>
                    <span class="clip-duration">${clip.duration}</span>
                </div>
                <div class="play-overlay">
                    <div class="play-icon-bg">
                        <i data-lucide="play"></i>
                    </div>
                </div>
            </div>
            <div class="clip-info">
                <h3 class="clip-title" title="${clip.title}">${clip.title}</h3>
                <div class="clip-creator-info" title="クリップ作成者">
                    <i data-lucide="user"></i>
                    <span class="clip-creator">${clip.creator_name || "Unknown"}</span>
                </div>
                <div class="clip-sub-info">
                    <span class="clip-game">${clip.game_name}</span>
                    <span class="clip-date">${formatDate(clip.created_at)}</span>
                </div>
            </div>
        `;

        // カード内の新しく追加されたLucideアイコンをレンダリング
        lucide.createIcons({ node: card });

        // カードクリック時に動画モーダルを開くイベントを設定
        card.addEventListener('click', () => {
            openVideoModal(clip);
        });

        return card;
    }

    /**
     * 5. クリップ一覧のレンダリング処理
     */
    function renderClips(clips) {
        // グリッドを空にする
        clipsGrid.innerHTML = '';

        if (!clips || clips.length === 0) {
            // クリップが1件もない場合の表示
            clipsGrid.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--color-text-secondary); margin-bottom: 12px;"></i>
                    <p>該当するクリップが見つかりませんでした。</p>
                </div>
            `;
            lucide.createIcons({ node: clipsGrid });
            return;
        }

        // クリップカードを生成してグリッドに追加
        clips.forEach(clip => {
            const card = createClipCard(clip);
            clipsGrid.appendChild(card);
        });
    }

    /**
     * 6. ページングの処理 & 描画更新 (Pagination Engine)
     */
    function paginateAndRender() {
        const totalItems = filteredClips.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        // 範囲外のページ指定を防ぐ
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        // 表示する範囲のインデックスを算出
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        // 該当ページ分のクリップをスライス取得して描画
        const pageClips = filteredClips.slice(startIndex, endIndex);
        renderClips(pageClips);

        // --- ページネーションコントロールのUI更新 ---
        
        // ページ件数情報バッジを更新 (シンプルにページ表示のみに変更)
        resultsCount.textContent = `ページ ${currentPage}/${totalPages}`;

        // 前へ / 次へ ボタンの無効化・有効化制御
        prevPageBtn.disabled = (currentPage === 1);
        nextPageBtn.disabled = (currentPage === totalPages);

        // ページ番号ボタンリストの動的生成 (現在ページの前後1ページと、最初/最後を表示し、間を "..." で省略)
        pageNumbersContainer.innerHTML = '';
        
        const range = 1; // 現在ページの左右に表示する個数
        let pagesToShow = [];
        
        // 常に最初のページは表示
        pagesToShow.push(1);
        
        // 現在ページの前後を表示対象に追加
        for (let i = currentPage - range; i <= currentPage + range; i++) {
            if (i > 1 && i < totalPages) {
                pagesToShow.push(i);
            }
        }
        
        // 常に最後のページを表示対象に追加
        if (totalPages > 1) {
            pagesToShow.push(totalPages);
        }
        
        // 重複を除外して昇順にソート
        pagesToShow = [...new Set(pagesToShow)].sort((a, b) => a - b);
        
        let prevPage = 0;
        pagesToShow.forEach(page => {
            // 前の表示ページとの間にギャップがある場合、"..." (省略記号) を挿入
            if (prevPage > 0 && page - prevPage > 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                pageNumbersContainer.appendChild(ellipsis);
            }
            
            const pageButton = document.createElement('button');
            pageButton.className = `btn-page-number ${page === currentPage ? 'active' : ''}`;
            pageButton.textContent = page;
            
            // ページ番号クリック時のイベント
            pageButton.addEventListener('click', () => {
                currentPage = page;
                paginateAndRender();
                // ページ上部にスムーズスクロール
                clipsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            
            pageNumbersContainer.appendChild(pageButton);
            prevPage = page;
        });

        // コンテンツが多くて複数ページになる場合のみ、コントロールパネルを表示
        if (totalPages > 1) {
            paginationContainer.style.display = 'flex';
        } else {
            paginationContainer.style.display = 'none';
        }

        // ページネーション部分のLucideアイコンを再ロード
        lucide.createIcons({ node: paginationContainer });
    }

    /**
     * 7. 検索・フィルター・ソートロジックの適用 (Core Engine)
     */
    function applyFiltersAndSort() {
        let tempClips = [...allClips];

        // --- A. キーワード検索 (AND / OR 対応) ---
        if (filterState.searchQuery.trim() !== '') {
            const keywords = filterState.searchQuery
                .toLowerCase()
                .split(/[\s　]+/)
                .filter(k => k !== '');

            if (keywords.length > 0) {
                tempClips = tempClips.filter(clip => {
                    const title = clip.title.toLowerCase();
                    const game = clip.game_name.toLowerCase();

                    if (filterState.logic === 'AND') {
                        return keywords.every(kw => title.includes(kw) || game.includes(kw));
                    } else {
                        return keywords.some(kw => title.includes(kw) || game.includes(kw));
                    }
                });
            }
        }

        // --- B. ゲームカテゴリによる絞り込み (単一選択) ---
        if (filterState.gameCategory !== 'all') {
            tempClips = tempClips.filter(clip => clip.game_name === filterState.gameCategory);
        }

        // --- C. 日付指定フィルター (期間検索) ---
        if (filterState.dateStart !== '') {
            const startDate = new Date(filterState.dateStart + 'T00:00:00');
            tempClips = tempClips.filter(clip => {
                const clipDate = new Date(clip.created_at);
                return clipDate >= startDate;
            });
        }
        if (filterState.dateEnd !== '') {
            const endDate = new Date(filterState.dateEnd + 'T23:59:59');
            tempClips = tempClips.filter(clip => {
                const clipDate = new Date(clip.created_at);
                return clipDate <= endDate;
            });
        }

        // --- D. ソート処理 ---
        tempClips.sort((a, b) => {
            switch (filterState.sortBy) {
                case 'views-desc':
                    return b.view_count - a.view_count;
                case 'views-asc':
                    return a.view_count - b.view_count;
                case 'date-desc':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'date-asc':
                    return new Date(a.created_at) - new Date(b.created_at);
                default:
                    return 0;
            }
        });

        // 適用結果を状態変数に反映
        filteredClips = tempClips;
        
        // 絞り込みが変わったため、ページ位置を最初のページ「1」に戻して描画
        currentPage = 1;
        paginateAndRender();
    }

    /**
     * 8. 全データからユニークなゲーム名を抽出し、ゲームカテゴリセレクトを動的生成
     */
    function populateGameFilter() {
        // 重複を除外したゲーム名リストを生成してソート
        const uniqueGames = [...new Set(allClips.map(clip => clip.game_name))]
            .filter(game => game && game !== 'Unknown')
            .sort();

        // 最初のデフォルトオプションを残して、他をクリア
        gameSelect.innerHTML = '<option value="all">すべてのゲーム (デフォルト)</option>';

        uniqueGames.forEach(game => {
            const option = document.createElement('option');
            option.value = game;
            option.textContent = game;
            gameSelect.appendChild(option);
        });
    }

    /**
     * 9. 静的JSONファイルからデータをロードする処理 (JAMstack移行)
     */
    async function loadClipsJson() {
        const jsonPath = './data/clips.json';

        try {
            const response = await fetch(jsonPath);
            
            if (!response.ok) {
                throw new Error(`JSONロード失敗: HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.clips) {
                throw new Error('JSONのデータ構造が正しくありません。');
            }

            // メタデータから総件数と更新日時を画面に反映 ("nn本のクリップ" 表記)
            totalCountBadge.textContent = `${data.total_count.toLocaleString()}本のクリップ`;
            dataUpdatedAt.textContent = `データ更新日時: ${formatUpdatedAt(data.updated_at)}`;

            // 全クリップ配列を取得
            allClips = data.clips;

            // ゲーム選択肢をデータから自動構築
            populateGameFilter();

            // 最初の検索・フィルタリングの適用と描画
            applyFiltersAndSort();

        } catch (error) {
            console.error('newsaan-clipsite: 静的JSONのフェッチ中にエラーが発生しました:', error);
            
            clipsGrid.innerHTML = `
                <div class="error-state">
                    <i data-lucide="x-circle" style="width: 48px; height: 48px; color: #ff4a4a; margin-bottom: 12px;"></i>
                    <p>クリップデータの読み込みに失敗しました。<br>GitHub Actionsによるデータ更新が未完了の可能性があります。</p>
                </div>
            `;
            resultsCount.textContent = 'エラー';
            totalCountBadge.textContent = '総数: -- 件';
            dataUpdatedAt.textContent = 'データ更新日時: 読み込み失敗';
            lucide.createIcons({ node: clipsGrid });
        }
    }

    /**
     * 10. 動画埋め込みモーダルプレイヤーを開く処理
     */
    function openVideoModal(clip) {
        modalTitle.textContent = clip.title;
        modalGame.innerHTML = `<i data-lucide="gamepad-2"></i> <span>${clip.game_name}</span>`;
        modalViews.innerHTML = `<i data-lucide="eye"></i> <span>${formatViews(clip.view_count)} views</span>`;
        modalDate.innerHTML = `<i data-lucide="calendar"></i> <span>${formatDate(clip.created_at)}</span>`;
        
        const modalCreator = document.getElementById('modal-creator');
        if (modalCreator) {
            modalCreator.innerHTML = `<i data-lucide="user"></i> <span>作成者: ${clip.creator_name || "Unknown"}</span>`;
        }

        // 現在実行中のホストドメインを取得
        const currentHost = window.location.hostname || 'localhost';

        // Twitch クリップ埋め込み iframe の生成 (自動再生有効化)
        modalVideoWrapper.innerHTML = `
            <iframe
                src="https://clips.twitch.tv/embed?clip=${clip.clip_slug}&parent=${currentHost}&autoplay=true"
                height="100%"
                width="100%"
                allowfullscreen="true"
                loading="lazy">
            </iframe>
        `;

        // モーダルをアクティブにする
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // 背面のスクロールを防止

        // モーダル内のアイコンをレンダリング
        lucide.createIcons({ node: videoModal });
    }

    /**
     * 11. 動画埋め込みモーダルプレイヤーを閉じる処理
     */
    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // スクロール防止を解除

        // iframeをクリアして動画の音声再生を完全に停止させる
        modalVideoWrapper.innerHTML = '';
    }

    // --- 12. イベントリスナーの登録 ---

    // 検索入力時のリアルタイムフィルタリング
    searchInput.addEventListener('input', (e) => {
        filterState.searchQuery = e.target.value;
        
        if (filterState.searchQuery.length > 0) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
        
        applyFiltersAndSort();
    });

    // 検索窓クリアボタンクリック時
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterState.searchQuery = '';
        clearSearchBtn.style.display = 'none';
        applyFiltersAndSort();
        searchInput.focus();
    });

    // 検索論理(AND/OR)切り替えラジオボタン
    const handleLogicChange = (e) => {
        if (e.target.checked) {
            filterState.logic = e.target.value;
            applyFiltersAndSort();
        }
    };
    logicAndInput.addEventListener('change', handleLogicChange);
    logicOrInput.addEventListener('change', handleLogicChange);

    // ゲームカテゴリセレクト変更時
    gameSelect.addEventListener('change', (e) => {
        filterState.gameCategory = e.target.value;
        applyFiltersAndSort();
    });

    // 日付指定（開始日・終了日）の変更時
    dateStartInput.addEventListener('change', (e) => {
        filterState.dateStart = e.target.value;
        applyFiltersAndSort();
    });
    dateEndInput.addEventListener('change', (e) => {
        filterState.dateEnd = e.target.value;
        applyFiltersAndSort();
    });

    // ソート順の変更時
    sortSelect.addEventListener('change', (e) => {
        filterState.sortBy = e.target.value;
        applyFiltersAndSort();
    });

    // ページネーション: 前へボタン
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            paginateAndRender();
            clipsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // ページネーション: 次へボタン
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredClips.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            paginateAndRender();
            clipsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // フィルター条件のリセットボタンクリック時
    resetFiltersBtn.addEventListener('click', () => {
        // UIコントロールの値を初期化
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        logicAndInput.checked = true; // ANDデフォルト
        gameSelect.value = 'all';     // ゲームフィルター初期化
        dateStartInput.value = '';
        dateEndInput.value = '';
        sortSelect.value = 'views-desc'; // 閲覧数デフォルト
        
        // 内部状態(State)のリセット
        filterState.searchQuery = '';
        filterState.logic = 'AND';
        filterState.gameCategory = 'all';
        filterState.dateStart = '';
        filterState.dateEnd = '';
        filterState.sortBy = 'views-desc';

        // フィルタリングの再適用
        applyFiltersAndSort();
    });

    // モーダルのイベントリスナーの登録
    modalCloseBtn.addEventListener('click', closeVideoModal);
    modalOverlay.addEventListener('click', closeVideoModal);

    // キーボードの Esc キーでモーダルを閉じられるように設定
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });



    // --- 14. 表示形式切り替え機能 (グリッド/リスト) の実装 ---
    function setViewMode(mode) {
        currentView = mode;
        localStorage.setItem('viewMode', mode);
        
        if (mode === 'list') {
            clipsGrid.classList.add('list-view');
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
        } else {
            clipsGrid.classList.remove('list-view');
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
        }
    }

    viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    viewListBtn.addEventListener('click', () => setViewMode('list'));

    // --- アプリケーションの初期起動処理 ---
    
    const savedView = localStorage.getItem('viewMode') || 'grid';
    setViewMode(savedView);

    // 最初のLucideアイコンの全体読み込み
    lucide.createIcons();

    // 静的JSONをロードしてアプリを起動
    loadClipsJson();
});
