/**
 * newsaan-clipsite: メインJavaScriptロジック
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const clipsGrid = document.getElementById('clips-grid');
    const resultsCount = document.getElementById('results-count');
    
    // フィルター系DOM要素
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const logicAndInput = document.getElementById('logic-and');
    const logicOrInput = document.getElementById('logic-or');
    const dateStartInput = document.getElementById('date-start');
    const dateEndInput = document.getElementById('date-end');
    const sortSelect = document.getElementById('sort-select');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    
    // モーダル系DOM要素
    const videoModal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalGame = document.getElementById('modal-game');
    const modalViews = document.getElementById('modal-views');
    const modalDate = document.getElementById('modal-date');
    const modalVideoWrapper = document.querySelector('.modal-video-wrapper');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalOverlay = document.querySelector('.modal-overlay');

    // --- 検索・フィルター状態管理 (State) ---
    const filterState = {
        searchQuery: '',
        logic: 'AND',     // 'AND' または 'OR' (複数キーワード検索時の挙動)
        dateStart: '',    // YYYY-MM-DD
        dateEnd: '',      // YYYY-MM-DD
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
     * 3. クリップカード単体のHTML要素生成
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
     * 4. クリップ一覧のレンダリング処理
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
            resultsCount.textContent = '0 件のクリップ';
            lucide.createIcons({ node: clipsGrid });
            return;
        }

        // クリップカードを生成してグリッドに追加
        clips.forEach(clip => {
            const card = createClipCard(clip);
            clipsGrid.appendChild(card);
        });

        // クリップ件数のバッジ表示を更新
        resultsCount.textContent = `${clips.length} 件のクリップ`;
    }

    /**
     * 5. 検索・フィルター・ソートロジックの適用 (Core Engine)
     */
    function applyFiltersAndSort() {
        if (!window.CLIPS_DATA) return;

        let filteredClips = [...window.CLIPS_DATA];

        // --- A. キーワード検索 (AND / OR 対応) ---
        if (filterState.searchQuery.trim() !== '') {
            // 全角・半角スペースでクエリを分割し、小文字化してキーワード配列を作成
            const keywords = filterState.searchQuery
                .toLowerCase()
                .split(/[\s　]+/)
                .filter(k => k !== '');

            if (keywords.length > 0) {
                filteredClips = filteredClips.filter(clip => {
                    const title = clip.title.toLowerCase();
                    const game = clip.game_name.toLowerCase();

                    if (filterState.logic === 'AND') {
                        // AND検索: すべてのキーワードがタイトルまたはゲーム名に含まれる
                        return keywords.every(kw => title.includes(kw) || game.includes(kw));
                    } else {
                        // OR検索: いずれかのキーワードがタイトルまたはゲーム名に含まれる
                        return keywords.some(kw => title.includes(kw) || game.includes(kw));
                    }
                });
            }
        }

        // --- B. 日付指定フィルター (期間検索) ---
        // クリップの created_at をローカル日付基準 (YYYY-MM-DD) に整形して比較
        if (filterState.dateStart !== '') {
            const startDate = new Date(filterState.dateStart + 'T00:00:00');
            filteredClips = filteredClips.filter(clip => {
                const clipDate = new Date(clip.created_at);
                return clipDate >= startDate;
            });
        }
        if (filterState.dateEnd !== '') {
            const endDate = new Date(filterState.dateEnd + 'T23:59:59');
            filteredClips = filteredClips.filter(clip => {
                const clipDate = new Date(clip.created_at);
                return clipDate <= endDate;
            });
        }

        // --- C. ソート処理 ---
        filteredClips.sort((a, b) => {
            switch (filterState.sortBy) {
                case 'views-desc': // 閲覧数の多い順 (デフォルト)
                    return b.view_count - a.view_count;
                case 'views-asc':  // 閲覧数の少ない順
                    return a.view_count - b.view_count;
                case 'date-desc':  // 作成日の新しい順
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'date-asc':   // 作成日の古い順
                    return new Date(a.created_at) - new Date(b.created_at);
                default:
                    return 0;
            }
        });

        // 絞り込みとソートが終わった配列を画面に再描画
        renderClips(filteredClips);
    }

    /**
     * 6. 動画埋め込みモーダルプレイヤーを開く処理
     */
    function openVideoModal(clip) {
        modalTitle.textContent = clip.title;
        modalGame.innerHTML = `<i data-lucide="gamepad-2"></i> <span>${clip.game_name}</span>`;
        modalViews.innerHTML = `<i data-lucide="eye"></i> <span>${formatViews(clip.view_count)} views</span>`;
        modalDate.innerHTML = `<i data-lucide="calendar"></i> <span>${formatDate(clip.created_at)}</span>`;

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
     * 7. 動画埋め込みモーダルプレイヤーを閉じる処理
     */
    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // スクロール防止を解除

        // iframeをクリアして動画の音声再生を完全に停止させる
        modalVideoWrapper.innerHTML = '';
    }

    // --- 8. イベントリスナーの登録 (Interaction) ---

    // 検索入力時のリアルタイムフィルタリング
    searchInput.addEventListener('input', (e) => {
        filterState.searchQuery = e.target.value;
        
        // 文字列が入っている場合のみクリアボタンを表示
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

    // フィルター条件のリセットボタンクリック時
    resetFiltersBtn.addEventListener('click', () => {
        // UIコントロールの値を初期化
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        logicAndInput.checked = true; // ANDデフォルト
        dateStartInput.value = '';
        dateEndInput.value = '';
        sortSelect.value = 'views-desc'; // 閲覧数の多い順デフォルト
        
        // 内部状態(State)のリセット
        filterState.searchQuery = '';
        filterState.logic = 'AND';
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

    // --- アプリケーションの初期起動処理 ---
    
    // 最初のLucideアイコンの全体読み込み
    lucide.createIcons();

    // グローバルに定義されたモックデータを読み込んで最初の描画を実行
    if (window.CLIPS_DATA) {
        applyFiltersAndSort();
    } else {
        console.error("newsaan-clipsite: モックデータ(CLIPS_DATA)が見つかりません。");
        clipsGrid.innerHTML = `
            <div class="error-state">
                <i data-lucide="x-circle" style="width: 48px; height: 48px; color: #ff4a4a; margin-bottom: 12px;"></i>
                <p>データの読み込みに失敗しました。</p>
            </div>
        `;
        lucide.createIcons({ node: clipsGrid });
    }
});
