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
        'MUSIC': { title: 'MUSIC', desc: 'Exploring new soundscapes. Listen to my latest tracks.' },
        'MIX':   { title: 'MIX',   desc: 'Non-stop sonic journeys. Special curated compilations.' },
        'SING':  { title: 'SING',  desc: 'Vocal expressions. Collection of singing works.' },
        'PLAY':  { title: 'PLAY',  desc: 'Visuals and interactive works. Experience the performance.' },
        'LIVE':  { title: 'LIVE',  desc: 'Connect in real-time. Check upcoming schedules.' }
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