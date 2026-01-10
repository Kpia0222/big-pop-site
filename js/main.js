let isRunning = false;
const noises = [
    { id: 'noise-grain', maxOpacity: 0.2 },
    { id: 'noise-static', maxOpacity: 0.1 },
    { id: 'noise-chromatic', maxOpacity: 0.3 },
    { id: 'noise-vignette', maxOpacity: 0.7 }
];

// ランダムノイズの制御関数（待機中のみ動く）
function triggerRandomNoise(noiseObj) {
    if (document.body.classList.contains('is-started')) {
        document.getElementById(noiseObj.id).style.opacity = 0;
        return; // 開始後は終了
    }

    const el = document.getElementById(noiseObj.id);
    const duration = Math.random() * 1000 + 200; 
    const wait = Math.random() * 2000 + 100;

    el.style.opacity = Math.random() * noiseObj.maxOpacity;
    if(noiseObj.id !== 'noise-vignette') {
        el.style.transform = `translate(${Math.random()*4-2}%, ${Math.random()*4-2}%)`;
    }

    setTimeout(() => {
        el.style.opacity = 0;
        setTimeout(() => triggerRandomNoise(noiseObj), wait);
    }, duration);
}

// 開始処理
document.getElementById('start-screen').addEventListener('click', () => {
    // 状態の切り替え
    document.body.classList.remove('is-waiting');
    document.body.classList.add('is-started');

    // スタート画面を消し、ロゴを表示
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('entrance-container').classList.remove('hidden');
    
    // 次のフレームで表示アニメーションを開始
    requestAnimationFrame(() => {
        document.getElementById('entrance-container').classList.add('show');
    });
});

window.addEventListener('DOMContentLoaded', () => {
    noises.forEach(noise => triggerRandomNoise(noise));
});