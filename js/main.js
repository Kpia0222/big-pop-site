function runNoise(id, max) {
    const el = document.getElementById(id);
    if (!el || document.body.classList.contains('is-ready')) return;

    el.style.opacity = Math.random() * max;
    el.style.backgroundPosition = `${Math.random() * 100}% ${Math.random() * 100}%`;

    setTimeout(() => runNoise(id, max), 100);
}

window.addEventListener('load', () => {
    runNoise('noise-grain', 0.12); // 背景が見えるよう少し弱めに
    runNoise('noise-static', 0.08);

    setTimeout(() => {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-ready');

        // 完全にロード画面を破棄
        setTimeout(() => {
            const loader = document.getElementById('loading-layer');
            if (loader) loader.style.display = 'none';
        }, 1000);
    }, 4000);
});