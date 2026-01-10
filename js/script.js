/**
 * script.js - Central Movement & Label Toggle
 */

let isTransitioning = false; 
let lastPoppedBubble = null;
let time = 0;

// 1. 初期設定：ロード完了後にバブルを表示し、線の描画を開始
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('is-ready');
        requestAnimationFrame(updateLines);
    }, 2000);
});

/* ==========================================
   2. バブル押下時の処理 (中央移動 & 拡大)
   ========================================== */
function popBubble(element) {
    if (isTransitioning || document.body.classList.contains('is-menu-open')) return;
    
    isTransitioning = true;
    document.body.classList.add('is-switching');
    lastPoppedBubble = element;

    // --- A. バブル内の元々の文字(span)を非表示にする ---
    const originalSpan = element.querySelector('span');
    if (originalSpan) {
        originalSpan.style.opacity = '0';
    }

    // --- B. 中央座標の計算 ---
    const rect = element.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // バブルの中心点から画面中心までの距離
    const moveX = centerX - (rect.left + rect.width / 2);
    const moveY = centerY - (rect.top + rect.height / 2);

    // CSS変数に移動距離をセット
    element.style.setProperty('--move-x', `${moveX}px`);
    element.style.setProperty('--move-y', `${moveY}px`);

    // --- C. 文字データの準備 ---
    const labelText = originalSpan ? originalSpan.innerText.trim().toUpperCase() : "";
    const pageData = {
        'MUSIC': { title: 'MUSIC', desc: 'Exploring new soundscapes. Listen to my latest tracks.' },
        'MIX':   { title: 'MIX',   desc: 'Non-stop sonic journeys. Special curated compilations.' },
        'SING':  { title: 'SING',  desc: 'Vocal expressions. Collection of singing works.' },
        'PLAY':  { title: 'PLAY',  desc: 'Visuals and interactive works. Experience the performance.' },
        'LIVE':  { title: 'LIVE',  desc: 'Connect in real-time. Check upcoming schedules.' }
    };
    const data = pageData[labelText] || { title: labelText, desc: "Coming Soon..." };

    // --- D. アニメーション開始 ---
    const bgColor = getComputedStyle(element).getPropertyValue('--bg-color');
    element.style.backgroundColor = bgColor; // 背景色を単色固定（コロナ効果のため）
    element.classList.add('expanding');

    // --- E. メニューコンテンツの表示タイミング ---
    setTimeout(() => {
        // 背景のロゴとコネクション線を隠す
        const logo = document.getElementById('main-logo');
        const lineLayer = document.getElementById('bubble-lines');
        if (logo) logo.style.opacity = '0';
        if (lineLayer) lineLayer.style.opacity = '0';

        // 他のバブルを隠す
        document.querySelectorAll('.bubble').forEach(b => {
            if (b !== element) {
                b.style.opacity = '0';
                b.style.visibility = 'hidden';
            }
        });

        // コンテンツの中身を流し込み
        const area = document.getElementById('content-area');
        const inner = document.getElementById('inner-content');
        inner.innerHTML = `<h1>${data.title}</h1><p>${data.desc}</p>`;
        
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
   3. 戻るボタンの処理
   ========================================== */
function backToEntrance() {
    if (isTransitioning || !lastPoppedBubble) return;
    
    isTransitioning = true;
    document.body.classList.add('is-switching');
    document.body.classList.remove('is-menu-open');

    const area = document.getElementById('content-area');
    area.classList.remove('visible');

    setTimeout(() => {
        area.classList.add('hidden');

        // 拡大クラスを外し、縮小クラスを付与して元の位置へ
        lastPoppedBubble.classList.remove('expanding');
        void lastPoppedBubble.offsetWidth; 
        lastPoppedBubble.classList.add('shrinking');

        // ロゴや他のバブルを再表示
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

        // 完全に縮小しきった後の処理
        setTimeout(() => {
            // 元々の文字(span)を再表示
            const originalSpan = lastPoppedBubble.querySelector('span');
            if (originalSpan) {
                originalSpan.style.opacity = '1';
            }

            lastPoppedBubble.classList.remove('shrinking');
            lastPoppedBubble.style.backgroundColor = ''; // 色固定を解除
            lastPoppedBubble = null;
            document.body.classList.remove('is-switching');
            isTransitioning = false;
        }, 1200); // CSSの1.2sアニメーションに合わせる
    }, 400);
}

/* ==========================================
   4. 線の描画ループ (メニュー開栓中は停止)
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

    time += 0.02;

    const colors = {
        'b1': 'rgba(255, 204, 0, 0.6)',
        'b2': 'rgba(255, 51, 102, 0.6)',
        'b3': 'rgba(0, 255, 204, 0.6)',
        'b4': 'rgba(51, 102, 255, 0.6)',
        'b5': 'rgba(153, 51, 255, 0.6)'
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

            const cpX = (startX + endX) / 2 + Math.sin(time + i) * 30;
            const cpY = (startY + endY) / 2 + Math.cos(time * 0.7 + i) * 30;

            path.setAttribute('d', `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`);
            path.setAttribute('stroke', colors[`b${i}`]);
            path.style.opacity = "0.5";
        } else {
            path.style.opacity = "0";
        }
    }
    requestAnimationFrame(updateLines);
}

/* popBubble関数内のバブル以外を消す処理に追記 */
document.querySelectorAll('.sub-bubble').forEach(s => {
    s.style.opacity = '0';
    s.style.pointerEvents = 'none';
});

/* backToEntrance関数内の要素を戻す処理に追記 */
document.querySelectorAll('.sub-bubble').forEach(s => {
    s.style.opacity = '1';
    s.style.pointerEvents = 'auto';
});