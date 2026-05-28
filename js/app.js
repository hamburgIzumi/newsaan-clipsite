/**
 * newsaan-clipsite: メインJavaScriptロジック
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const clipsGrid = document.getElementById('clips-grid');
    const resultsCount = document.getElementById('results-count');
    
    // モーダル要素の取得
    const videoModal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalGame = document.getElementById('modal-game');
    const modalViews = document.getElementById('modal-views');
    const modalDate = document.getElementById('modal-date');
    const modalVideoWrapper = document.querySelector('.modal-video-wrapper');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalOverlay = document.querySelector('.modal-overlay');

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
     * 5. 動画埋め込みモーダルプレイヤーを開く処理
     */
    function openVideoModal(clip) {
        modalTitle.textContent = clip.title;
        modalGame.innerHTML = `<i data-lucide="gamepad-2"></i> <span>${clip.game_name}</span>`;
        modalViews.innerHTML = `<i data-lucide="eye"></i> <span>${formatViews(clip.view_count)} views</span>`;
        modalDate.innerHTML = `<i data-lucide="calendar"></i> <span>${formatDate(clip.created_at)}</span>`;

        // 現在実行中のホストドメインを取得 (localhost または GitHub Pages のドメイン)
        // Twitch埋め込みAPIのセキュリティ要件（parentパラメータ）を自動で満たすため
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
     * 6. 動画埋め込みモーダルプレイヤーを閉じる処理
     */
    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // スクロール防止を解除

        // iframeをクリアして動画の音声再生を完全に停止させる
        modalVideoWrapper.innerHTML = '';
    }

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

    // グローバルに定義されたモックデータを読み込んで画面に表示
    if (window.CLIPS_DATA) {
        // ロード画面を非表示にして描画
        renderClips(window.CLIPS_DATA);
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
