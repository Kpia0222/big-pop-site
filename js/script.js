/**
 * script.js - Organized Version
 */

let lastPoppedBubble = null;
let time = 0;

/* ==========================================
   1. ノイズエフェクト制御
   ========================================== */
function animateNoise(id, maxOpacity) {
    const el = document.getElementById(id);
    if (!el) return;

    // ロード完了(is-ready付与)で停止
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
    // ノイズ開始
    animateNoise('noise-grain', 0.15);
    animateNoise('noise-static', 0.1);

    // 2秒後にエントランスへ切り替え
    setTimeout(() => {
        document.body.classList.add('is-ready');
        // 表示確定後に線の描画を開始
        requestAnimationFrame(updateLines);
    }, 2000);
});

/* ==========================================
   3. バブルのクリック・遷移処理
   ========================================== */
function popBubble(element) {
    if (!element || element.classList.contains('expanding')) return;

    // カテゴリ判定
    const span = element.querySelector('span');
    const rawText = span ? span.innerText : element.innerText;
    const label = rawText.replace(/\s+/g, '').toUpperCase();
    
    // アニメーション準備：文字を隠して拡大クラス付与
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
        // エントランスのUIを非表示にする
        document.getElementById('main-logo').style.opacity = '0';
        document.getElementById('bubble-lines').style.opacity = '0';
        document.querySelectorAll('.bubble').forEach(b => {
            if (b !== element) b.style.opacity = '0';
        });

        // コンテンツの流し込み
        const area = document.getElementById('content-area');
        const inner = document.getElementById('inner-content');
        
        if (data) {
            inner.innerHTML = `
                <h1 style="color: white; font-size: 3.5rem; letter-spacing: 0.5rem; margin-bottom: 20px;">${data.title}</h1>
                <p style="color: rgba(255,255,255,0.8); font-size: 1.2rem; line-height: 1.6; max-width: 500px; margin: 0 auto;">${data.desc}</p>
            `;
        } else {
            inner.innerHTML = `<h1>${label}</h1><p>Content is being prepared...</p>`;
        }
        
        area.classList.remove('hidden');
        setTimeout(() => area.classList.add('visible'), 50);
    }, 800);
}

/**
 * 元のエントランスに戻る
 */
function backToEntrance() {
    if (!lastPoppedBubble) return;

    const area = document.getElementById('content-area');
    area.classList.remove('visible');

    setTimeout(() => {
        area.classList.add('hidden');

        // バブルを縮小させる
        lastPoppedBubble.classList.remove('expanding');
        void lastPoppedBubble.offsetWidth; 
        lastPoppedBubble.classList.add('shrinking');

        // エントランスUIの復帰
        setTimeout(() => {
            document.getElementById('main-logo').style.opacity = '1';
            document.getElementById('bubble-lines').style.opacity = '1';
            document.querySelectorAll('.bubble').forEach(b => {
                b.style.opacity = '1';
                b.style.display = 'flex';
            });
        }, 100);

        // 縮小アニメーション完了後の掃除
        setTimeout(() => {
            const span = lastPoppedBubble.querySelector('span');
            if (span) span.style.display = 'inline-block';
            lastPoppedBubble.classList.remove('shrinking');
            lastPoppedBubble = null;
        }, 500);

    }, 300);
}

/* ==========================================
   4. ぐにゃぐにゃ線の描画ループ
   ========================================== */
function updateLines() {
    const logo = document.getElementById('main-logo');
    // ロゴが非表示（メニュー閲覧中など）は計算をスキップ
    if (!logo || window.getComputedStyle(logo).opacity === '0') {
        requestAnimationFrame(updateLines);
        return;
    }

    const logoRect = logo.getBoundingClientRect();
    const logoX = logoRect.left + logoRect.width / 2 + window.scrollX;
    const logoY = logoRect.top + logoRect.height / 2 + window.scrollY;
    const logoR = logoRect.width / 2.5;

    time += 0.02;

    const colors = [
        'rgba(220, 100, 100, 0.7)', // b1: MUSIC
        'rgba(220, 200, 100, 0.7)', // b2: MIX
        'rgba(100, 150, 220, 0.7)', // b3: SING
        'rgba(160, 100, 220, 0.7)', // b4: PLAY
        'rgba(120, 200, 100, 0.7)'  // b5: LIVE
    ];

    for (let i = 1; i <= 5; i++) {
        const bubble = document.querySelector(`.b${i}`);
        const path = document.getElementById(`line-b${i}`);

        if (!bubble || !path) continue;

        // バブルが通常状態（拡大中や消滅中でない）のときだけ描画
        if (!bubble.classList.contains('popped') && !bubble.classList.contains('expanding')) {
            const bRect = bubble.getBoundingClientRect();
            const bX = bRect.left + bRect.width / 2 + window.scrollX;
            const bY = bRect.top + bRect.height / 2 + window.scrollY;
            const bR = bRect.width / 2;

            const angle = Math.atan2(bY - logoY, bX - logoX);
            const startX = logoX + Math.cos(angle) * logoR;
            const startY = logoY + Math.sin(angle) * logoR;
            const endX = bX - Math.cos(angle) * bR;
            const endY = bY - Math.sin(angle) * bR;

            const waveX = Math.sin(time + i) * 40;
            const waveY = Math.cos(time * 0.8 + i) * 40;
            const cpX = (startX + endX) / 2 + waveX;
            const cpY = (startY + endY) / 2 + waveY;

            const d = `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`;
            path.setAttribute('d', d);
            path.setAttribute('stroke', colors[i - 1]);
            path.classList.remove('line-hidden');
        } else {
            path.classList.add('line-hidden');
        }
    }

    requestAnimationFrame(updateLines);
}