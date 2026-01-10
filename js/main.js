const noises = [
    { id: 'noise-grain', maxOpacity: 0.2 },
    { id: 'noise-static', maxOpacity: 0.1 },
    { id: 'noise-chromatic', maxOpacity: 0.3 },
    { id: 'noise-vignette', maxOpacity: 0.7 }
];

// ランダムノイズの制御
function triggerRandomNoise(noiseObj) {
    if (document.body.classList.contains('is-started')) {
        document.getElementById(noiseObj.id).style.opacity = 0;
        return;
    }

    const el = document.getElementById(noiseObj.id);
    const duration = Math.random() * 1000 + 200; 
    const wait = Math.random() * 2000 + 100;

    el.style.opacity = Math.random() * noiseObj.maxOpacity;
    
    setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => triggerRandomNoise(noiseObj), wait);
    }, duration);
}

// 開始イベント：pointerdownを使用することでPC/スマホ両方に対応
const startScreen = document.getElementById('start-screen');

startScreen.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (document.body.classList.contains('is-started')) return;

    // 状態切り替え
    document.body.classList.remove('is-waiting');
    document.body.classList.add('is-started');

    // スタート画面の破棄
    startScreen.style.display = 'none';

    console.log("Portal started.");
});

window.addEventListener('DOMContentLoaded', () => {
    noises.forEach(noise => triggerRandomNoise(noise));
});