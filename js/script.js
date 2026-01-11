/**
 * script.js - Central Movement & Label Toggle
 */

let isTransitioning = false;
let lastPoppedBubble = null;
let time = 0;

/* ==========================================
   1. 初期設定: ロード完了後にアニメーション開始
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('is-ready');
        requestAnimationFrame(updateLines);
    }, 2000);
});

/* ==========================================
   2. バブル押下時の処理 (中央へ移動 & コンテンツ表示)
   ========================================== */
function popBubble(element) {
    // 遷移中やメニュー展開中は反応させない
    if (isTransitioning || document.body.classList.contains('is-menu-open')) return;

    isTransitioning = true;
    document.body.classList.add('is-switching');
    lastPoppedBubble = element;

    // A. バブル内の文字(span)を隠す
    const originalSpan = element.querySelector('span');
    if (originalSpan) originalSpan.style.opacity = '0';

    // B. 中央座標への移動量を計算
    const rect = element.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = centerX - (rect.left + rect.width / 2);
    const moveY = centerY - (rect.top + rect.height / 2);

    element.style.setProperty('--move-x', `${moveX}px`);
    element.style.setProperty('--move-y', `${moveY}px`);

    // C. コンテンツの準備
    const labelText = originalSpan ? originalSpan.innerText.trim().toUpperCase() : "";
    const pageData = {
        'MUSIC': {
            title: 'MUSIC',
            desc: 'Main Feature: HAPPY NEWYEAR!',
            mainVideo: 'IgpBulthSic',
            subItems: [
                { id: 'video1', type: 'video', label: 'WORK 01' },
                { id: 'video2', type: 'video', label: 'WORK 02' },
                { id: 'video3', type: 'link', label: 'ALBUM' },
                { id: 'video4', type: 'video', label: 'WORK 03' }
            ]
        },
        'MIX': {
            title: 'MIX',
            desc: 'Non-stop sonic journeys. Special curated compilations.',
            mainVideo: 'MU1wqeOXRjk' // 追加: 夜撫でるメノウ / Ayase 歌ってみた
        },
        'SING': {
            title: 'SING',
            desc: 'Vocal expressions. Collection of singing works.',
            mainVideo: '' // 必要に応じて追加してください
        },
        'PLAY': {
            title: 'PLAY',
            desc: 'Visuals and interactive works. Experience the performance.',
            mainVideo: 'VuaXsTCrBJ8' // 追加: PLAY動画
        },
        'LIVE': {
            title: 'LIVE',
            desc: 'Connect in real-time. Check upcoming schedules.',
            mainVideo: 'WXwGt7Ixwv0' // 追加: Futura Splat @Club COCOA
        }
    };
    const data = pageData[labelText] || { title: labelText, desc: "Coming Soon..." };

    // D. 拡大アニメーション開始
    const bgColor = getComputedStyle(element).getPropertyValue('--bg-color');
    element.style.backgroundColor = bgColor;
    element.classList.add('expanding');

    // E. 画面遷移の演出
    setTimeout(() => {
        // ロゴや線、他のバブルを隠す
        const logo = document.getElementById('main-logo');
        const lineLayer = document.getElementById('bubble-lines');
        if (logo) logo.style.opacity = '0';
        if (lineLayer) lineLayer.style.opacity = '0';

        document.querySelectorAll('.bubble').forEach(b => {
            if (b !== element) {
                b.style.opacity = '0';
                b.style.visibility = 'hidden';
            }
        });

        // テキストを表示
        const area = document.getElementById('content-area');
        const inner = document.getElementById('inner-content');

        let videoHTML = '';
        if (data.videoIds && data.videoIds.length > 0) {
            videoHTML = `
             <div class="video-container">
                <iframe 
                    src="https://www.youtube.com/embed/${data.videoIds[0]}?autoplay=1&mute=0&modestbranding=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
             </div>
         `;
        }

        inner.innerHTML = `
         <div class="content-wrapper music-page">
            <h1 class="content-title">${data.title}</h1>
            <div class="main-feature">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${data.mainVideo}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            <p class="content-desc">${data.desc}</p>
            
            <div id="sub-content-orbit"></div>
         </div>
        `;
        // popBubble関数内のサブバブル生成ループ
        if (data.subItems) {
            const orbit = document.getElementById('sub-content-orbit');

            // 配置エリアの設定（画面の端ぎりぎりに寄せる）
            const marginX = window.innerWidth * 0.4;
            const marginY = window.innerHeight * 0.35;

            const basePositions = [
                { x: marginX, y: -marginY }, // 右上
                { x: marginX, y: marginY },  // 右下
                { x: -marginX, y: marginY },  // 左下
                { x: -marginX, y: -marginY }  // 左上
            ];

            data.subItems.slice(0, 4).forEach((item, index) => {
                const sub = document.createElement('div');
                sub.className = 'mini-bubble';
                sub.innerHTML = `<span>${item.label}</span>`;

                // 座標に大きなランダム幅を持たせて等間隔感をなくす
                const randX = (Math.random() - 0.5) * window.innerWidth * 0.2;
                const randY = (Math.random() - 0.5) * window.innerHeight * 0.2;

                sub.style.setProperty('--target-x', `${basePositions[index].x + randX}px`);
                sub.style.setProperty('--target-y', `${basePositions[index].y + randY}px`);
                sub.style.setProperty('--random-rotate', `${(Math.random() - 0.5) * 30}deg`);

                // メインバブルの計算済みCSSから色を完全にコピー
                const mainColor = getComputedStyle(element).getPropertyValue('--bg-color');
                sub.style.backgroundColor = mainColor; // 背景色
                sub.style.setProperty('--bg-color', mainColor); // パルスアニメーション用変数

                orbit.appendChild(sub);
                // 出現タイミングをバラバラにして有機的な動きにする
                setTimeout(() => sub.classList.add('show'), 1000 + (Math.random() * 800));
            });
        }

        area.classList.remove('hidden');

        setTimeout(() => {
            area.classList.add('visible');
            document.body.classList.add('is-menu-open');
            document.body.classList.remove('is-switching');
            isTransitioning = false;
        }, 200);
    }, 600);
}

/* ==========================================
   3. メニューを閉じる処理 (BACKボタン & 背景クリック)
   ========================================== */
function backToEntrance() {
    // 遷移中、バブル未選択、またはメニューが閉じていれば何もしない
    if (isTransitioning || !lastPoppedBubble || !document.body.classList.contains('is-menu-open')) return;

    isTransitioning = true;
    document.body.classList.add('is-switching');
    document.body.classList.remove('is-menu-open');

    const area = document.getElementById('content-area');
    area.classList.remove('visible');

    setTimeout(() => {
        area.classList.add('hidden');

        // バブルを縮小
        lastPoppedBubble.classList.remove('expanding');
        void lastPoppedBubble.offsetWidth; // リフロー強制
        lastPoppedBubble.classList.add('shrinking');

        // ロゴや他バブルを再表示
        setTimeout(() => {
            const logo = document.getElementById('main-logo');
            const lineLayer = document.getElementById('bubble-lines');
            if (logo) logo.style.opacity = '1';
            if (lineLayer) lineLayer.style.opacity = '1';

            document.querySelectorAll('.bubble').forEach(b => {
                b.style.visibility = 'visible';
                b.style.opacity = '1';
            });
        }, 300);

        // 完了処理
        setTimeout(() => {
            const originalSpan = lastPoppedBubble.querySelector('span');
            if (originalSpan) originalSpan.style.opacity = '1';

            lastPoppedBubble.classList.remove('shrinking');
            lastPoppedBubble.style.backgroundColor = '';
            lastPoppedBubble = null;
            document.body.classList.remove('is-switching');
            isTransitioning = false;
        }, 1200);
    }, 400);
}

// HTMLの onclick="handleBgClick()" から呼ばれる関数
function handleBgClick() {
    if (document.body.classList.contains('is-menu-open')) {
        backToEntrance();
    }
}

/* ==========================================
   4. つなぎ線の描画 (更新頻度の最適化版)
   ========================================== */
function updateLines() {
    const logo = document.getElementById('main-logo');
    if (!logo || window.getComputedStyle(logo).opacity === "0" || document.body.classList.contains('is-menu-open')) {
        requestAnimationFrame(updateLines);
        return;
    }

    const logoRect = logo.getBoundingClientRect();
    const logoX = logoRect.left + logoRect.width / 2;
    const logoY = logoRect.top + logoRect.height / 2;
    const logoR = logoRect.width / 3;

    time += 0.000;

    const colors = {
        'b1': 'rgba(255, 204, 0, 0.7)',
        'b2': 'rgba(255, 51, 102, 0.7)',
        'b3': 'rgba(0, 255, 204, 0.7)',
        'b4': 'rgba(51, 102, 255, 0.7)',
        'b5': 'rgba(153, 51, 255, 0.7)'
    };

    for (let i = 1; i <= 5; i++) {
        const bubble = document.querySelector(`.b${i}`);
        const path = document.getElementById(`line-b${i}`);
        if (!bubble || !path) continue;

        if (!bubble.classList.contains('expanding') && !bubble.classList.contains('shrinking')) {
            const bRect = bubble.getBoundingClientRect();
            const bX = bRect.left + bRect.width / 2;
            const bY = bRect.top + bRect.height / 2;
            const bR = bRect.width / 2;

            const angle = Math.atan2(bY - logoY, bX - logoX);
            const startX = logoX + Math.cos(angle) * logoR;
            const startY = logoY + Math.sin(angle) * logoR;
            const endX = bX - Math.cos(angle) * bR;
            const endY = bY - Math.sin(angle) * bR;

            const cpX = (startX + endX) / 2 + Math.sin(time + i) * 1;
            const cpY = (startY + endY) / 2 + Math.cos(time * 0.7 + i) * 1;

            path.setAttribute('d', `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`);
            path.setAttribute('stroke', colors[`b${i}`]);

            // --- 更新頻度の調整ポイント ---
            // 1. 小数点第2位までに丸めることで、微細すぎる変化での再描画を抑制
            const dynamicWidth = (2.5 + Math.sin(time * 2 + i) * 1.0).toFixed(2);

            // 2. 前回の値と同じならスタイルを更新しない（DOM操作の削減）
            if (path.dataset.lastWidth !== dynamicWidth) {
                path.style.strokeWidth = `${dynamicWidth}px`;
                path.dataset.lastWidth = dynamicWidth;
            }

            path.style.setProperty('--glow-color', colors[`b${i}`]);
            path.style.opacity = "0.6";
        } else {
            path.style.opacity = "0";
        }
    }
    requestAnimationFrame(updateLines);
}

/* ==========================================
   5. ロゴバブルのマウス追従 (PCのみ有効)
   ========================================== */
document.addEventListener('mousemove', (e) => {
    const logo = document.getElementById('main-logo');
    // メニューが開いているときは追従させない
    if (!logo || document.body.classList.contains('is-menu-open')) {
        if (logo) logo.style.transform = 'translate(0, 0)';
        return;
    }

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // 追従強度 (0.04 = 4%追従)
    const strength = 0.04;
    const moveX = (mouseX - centerX) * strength;
    const moveY = (mouseY - centerY) * strength;

    logo.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

/* ==========================================
   時刻更新のロジック
   ========================================== */
function updateClock() {
    const timeDisplay = document.getElementById('current-time');
    if (!timeDisplay) return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    timeDisplay.innerText = `${h}:${m}:${s}`;
}

// 既存のDOMContentLoaded内に追記
document.addEventListener('DOMContentLoaded', () => {
    // 時刻更新を開始
    setInterval(updateClock, 1000);
    updateClock();

    // ...既存の処理...
    setTimeout(() => {
        document.body.classList.add('is-ready');
        requestAnimationFrame(updateLines);
    }, 2000);
});

/* ==========================================
   ヘッダーメニュー専用の展開ロジック
   ========================================== */
function openHeaderMenu(menuType) {
    if (isTransitioning) return;
    isTransitioning = true;

    // 既存のメインコンテンツが開いていれば閉じる
    if (document.body.classList.contains('is-menu-open')) {
        backToEntrance();
        setTimeout(() => openHeaderMenu(menuType), 1500);
        return;
    }

    const entrance = document.getElementById('layer-entrance');
    const lineLayer = document.getElementById('bubble-lines');
    
    // 背景を暗くし、既存の要素をフェードアウト
    document.body.classList.add('is-menu-open');
    if (lineLayer) lineLayer.style.opacity = '0';
    document.querySelectorAll('.bubble').forEach(b => b.style.opacity = '0');

    // メニューごとのデータ
    const headerData = {
        'ABOUT': [
            { label: 'WHO WE ARE', info: 'Creative Studio Kpia.' },
            { label: 'VISION', info: 'Breaking boundaries of digital art.' }
        ],
        'NEWS': [
            { label: '2026.01', info: 'New Project Launched.' },
            { label: 'UPDATE', info: 'System v2.0 Live.' }
        ],
        'CONTACT': [
            { label: 'EMAIL', info: 'hello@kpia.example.com' },
            { label: 'TWITTER', info: '@kpia_official' }
        ]
    };

    const items = headerData[menuType] || [];
    
    // サブバブル生成（既存の orbit 仕組みを再利用）
    const orbit = document.createElement('div');
    orbit.id = 'header-sub-orbit';
    document.body.appendChild(orbit);

    items.forEach((item, index) => {
        const sub = document.createElement('div');
        sub.className = 'sub-content-item header-info-bubble';
        sub.innerHTML = `<span class="label">${item.label}</span>`;
        
        // 中央ロゴの周りに配置
        const angle = (index / items.length) * Math.PI * 2;
        const radius = 200;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        sub.style.left = `calc(50% + ${x}px)`;
        sub.style.top = `calc(50% + ${y}px)`;
        sub.style.transform = 'translate(-50%, -50%) scale(0)';
        
        // クリックで情報を表示（簡易アラートまたはコンソール）
        sub.onclick = () => alert(item.info);

        orbit.appendChild(sub);
        setTimeout(() => {
            sub.style.transform = 'translate(-50%, -50%) scale(1)';
            sub.style.opacity = '1';
        }, 100 * index);
    });

    isTransitioning = false;
}