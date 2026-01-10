// ノイズ制御
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

// ページの準備ができたら実行
document.addEventListener('DOMContentLoaded', () => {
    // ノイズ開始
    animateNoise('noise-grain', 0.15);
    animateNoise('noise-static', 0.1);

    // 2秒後にクラスを追加して切り替える
    setTimeout(() => {
        console.log("Switching to Entrance..."); // ブラウザのF12コンソールで確認用
        document.body.classList.add('is-ready');
    }, 2000);
});

/**
 * シャボン玉を弾けさせる処理
 */
function popBubble(element) {
    // 弾けるアニメーション用クラスを追加
    element.classList.add('popped');

    // 必要であれば、ここで音を鳴らしたり画面遷移を行ったりします
    console.log(element.innerText + " popped!");

    // アニメーション完了後に要素を消す（任意）
    setTimeout(() => {
        element.style.display = 'none';
    }, 300);
}

let time = 0;

function updateLines() {
    const logo = document.getElementById('main-logo');
    if (!logo) return;

    const logoRect = logo.getBoundingClientRect();
    const logoR = logoRect.width / 2.5; // ロゴの半径（少し内側に調整）
    const logoX = logoRect.left + logoRect.width / 2;
    const logoY = logoRect.top + logoRect.height / 2;

    time += 0.02;

    for (let i = 1; i <= 5; i++) {
        const bubble = document.querySelector(`.b${i}`);
        const path = document.getElementById(`line-b${i}`);
        
        if (bubble && path && !bubble.classList.contains('popped')) {
            const bRect = bubble.getBoundingClientRect();
            const bR = bRect.width / 2; // シャボン玉の半径
            const bX = bRect.left + bRect.width / 2;
            const bY = bRect.top + bRect.height / 2;

            // 1. ロゴとバブルの間の角度を計算
            const angle = Math.atan2(bY - logoY, bX - logoX);

            // 2. 開始点：ロゴの外周（端）
            const startX = logoX + Math.cos(angle) * logoR;
            const startY = logoY + Math.sin(angle) * logoR;

            // 3. 終了点：シャボン玉の外周（端）
            const endX = bX - Math.cos(angle) * bR;
            const endY = bY - Math.sin(angle) * bR;

            // 4. ぐにゃぐにゃの制御点
            const waveX = Math.sin(time + i) * 40;
            const waveY = Math.cos(time * 0.8 + i) * 40;
            const cpX = (startX + endX) / 2 + waveX;
            const cpY = (startY + endY) / 2 + waveY;

            // 描画
            const d = `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`;
            path.setAttribute('d', d);
        } else if (path) {
            path.classList.add('line-hidden');
        }
    }
    requestAnimationFrame(updateLines);
}

// ページ読み込み完了後に開始
window.addEventListener('load', () => {
    updateLines();
});