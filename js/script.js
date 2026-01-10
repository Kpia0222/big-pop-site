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

// 既存のDOMContentLoaded内に変更はありません