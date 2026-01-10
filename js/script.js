/**
 * script.js - Improved Logic
 */

// 状態管理
let isTransitioning = false; 
let lastPoppedBubble = null;
let time = 0;

/* ==========================================
   1. ノイズエフェクト制御
   ========================================== */
function animateNoise(id, maxOpacity) {
    const el = document.getElementById(id);
    if (!el) return;

    if (document.body.classList.contains('is-ready')) {
        el.style.opacity = 0;
        return;
    }

    el.style.opacity = Math.random() * maxOpacity;
    el.style.backgroundPosition = `${Math.random() * 100}% ${Math.random() * 100}%`;
    setTimeout(() => animateNoise(id, maxOpacity), 100);
}

/* ==========================================
   2. 初期化処理
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    animateNoise('noise-grain', 0.15);
    animateNoise('noise-static', 0.1);

    setTimeout(() => {
        document.body.classList.add('is-ready');
        requestAnimationFrame(updateLines);
    }, 2000);
});

/* ==========================================
   3. バブルのクリック・遷移処理
   ========================================== */
function popBubble(element) {
    // すでに遷移中、またはメニューが開いているなら絶対拒否
    if (isTransitioning || document.body.classList.contains('is-menu-open')) return;
    
    isTransitioning = true; 
    document.body.classList.add('is-switching'); // CSS側でbubbleのpointer-eventsをnoneにする

    const span = element.querySelector('span');
    const rawText = span ? span.innerText : element.innerText;
    const label = rawText.replace(/\s+/g, '').toUpperCase();
    
    if (span) span.style.display = 'none';
    lastPoppedBubble = element;
    element.classList.add('expanding');

    const pageData = {
        'MUSIC': { title: 'MUSIC', desc: 'Exploring new soundscapes. Listen to my latest tracks and experimental sounds.' },
        'MIX':   { title: 'MIX',   desc: 'Non-stop sonic journeys. Special DJ sets and curated compilations.' },
        'SING':  { title: 'SING',  desc: 'Vocal expressions. Collection of singing works and original covers.' },
        'PLAY':  { title: 'PLAY',  desc: 'Visuals and interactive works. Experience the performance through video.' },
        'LIVE':  { title: 'LIVE',  desc: 'Connect in real-time. Check the upcoming show schedules and event info.' }
    };

    const data = pageData[label];

    setTimeout(() => {
        // 背景要素を物理的に隠す
        document.getElementById('main-logo').style.opacity = '0';
        document.getElementById('bubble-lines').style.opacity = '0';
        document.querySelectorAll('.bubble').forEach(b => {
            if (b !== element) {
                b.style.opacity = '0';
                b.style.visibility = 'hidden'; // クリック判定を完全に消すための保険
            }
        });

        const area = document.getElementById('content-area');
        const inner = document.getElementById('inner-content');
        
        if (data) {
            inner.innerHTML = `
                <h1 style="color: white; font-size: 3.5rem; letter-spacing: 0.5rem; margin-bottom: 20px;">${data.title}</h1>
                <p style="color: rgba(255,255,255,0.8); font-size: 1.2rem; line-height: 1.6; max-width: 500px; margin: 0 auto;">${data.desc}</p>
            `;
        }
        
        area.classList.remove('hidden');
        setTimeout(() => {
            area.classList.add('visible');
            document.body.classList.add('is-menu-open'); // メニュー開栓フラグ
            document.body.classList.remove('is-switching');
            isTransitioning = false;
        }, 50);
    }, 800);
}

/**
 * 元のエントランスに戻る
 */
function backToEntrance() {
    if (isTransitioning) return;
    isTransitioning = true;
    document.body.classList.add('is-switching');
    document.body.classList.remove('is-menu-open'); // メニュー判定を消す

    const area = document.getElementById('content-area');
    area.classList.remove('visible');

    setTimeout(() => {
        area.classList.add('hidden');

        lastPoppedBubble.classList.remove('expanding');
        void lastPoppedBubble.offsetWidth; 
        lastPoppedBubble.classList.add('shrinking');

        setTimeout(() => {
            document.getElementById('main-logo').style.opacity = '1';
            document.getElementById('bubble-lines').style.opacity = '1';
            document.querySelectorAll('.bubble').forEach(b => {
                b.style.opacity = '1';
                b.style.visibility = 'visible';
                b.style.display = 'flex';
            });
        }, 100);

        setTimeout(() => {
            const span = lastPoppedBubble.querySelector('span');
            if (span) span.style.display = 'inline-block';
            lastPoppedBubble.classList.remove('shrinking');
            lastPoppedBubble = null;
            
            // 完全に元に戻ってからすべてのロックを解除
            document.body.classList.remove('is-switching');
            isTransitioning = false;
        }, 800); // 縮小アニメーションが確実に終わるまで待つ

    }, 300);
}

/* ==========================================
   4. ぐにゃぐにゃ線の描画ループ
   ========================================== */
function updateLines() {
    const logo = document.getElementById('main-logo');
    if (!logo || window.getComputedStyle(logo).opacity === '0') {
        requestAnimationFrame(updateLines);
        return;
    }

    const logoRect = logo.getBoundingClientRect();
    const logoX = logoRect.left + logoRect.width / 2 + window.scrollX;
    const logoY = logoRect.top + logoRect.height / 2 + window.scrollY;
    const logoR = logoRect.width / 2.5;

    time += 0.02;

    for (let i = 1; i <= 5; i++) {
        const bubble = document.querySelector(`.b${i}`);
        const path = document.getElementById(`line-b${i}`);
        if (!bubble || !path) continue;

        if (!bubble.classList.contains('expanding') && !bubble.classList.contains('shrinking') && !document.body.classList.contains('is-menu-open')) {
            const bRect = bubble.getBoundingClientRect();
            const bX = bRect.left + bRect.width / 2 + window.scrollX;
            const bY = bRect.top + bRect.height / 2 + window.scrollY;
            const bR = bRect.width / 2;

            const angle = Math.atan2(bY - logoY, bX - logoX);
            const startX = logoX + Math.cos(angle) * logoR;
            const startY = logoY + Math.sin(angle) * logoR;
            const endX = bX - Math.cos(angle) * bR;
            const endY = bY - Math.sin(angle) * bR;

            const cpX = (startX + endX) / 2 + Math.sin(time + i) * 40;
            const cpY = (startY + endY) / 2 + Math.cos(time * 0.8 + i) * 40;

            path.setAttribute('d', `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`);
            path.classList.remove('line-hidden');
        } else {
            path.classList.add('line-hidden');
        }
    }
    requestAnimationFrame(updateLines);
}

/* popBubble関数内のinnerHTML部分を少し強化 */
inner.innerHTML = `
    <h1 style="color: white; font-size: 3.5rem; letter-spacing: 0.5rem; margin-bottom: 20px; word-wrap: break-word;">${data.title}</h1>
    <p style="color: rgba(255,255,255,0.8); font-size: 1.2rem; line-height: 1.6; max-width: 500px; margin: 0 auto; padding: 0 15px;">${data.desc}</p>
`;