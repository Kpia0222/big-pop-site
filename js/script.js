/**
 * 1. ノイズエフェクト制御
 * ロード画面中のザラザラした視覚効果をループさせます。
 */
function animateNoise(id, maxOpacity) {
    const el = document.getElementById(id);
    if (!el) return;

    // is-readyが付与されたら（ロード完了）ループを停止
    if (document.body.classList.contains('is-ready')) {
        el.style.opacity = 0;
        return;
    }

    el.style.opacity = Math.random() * maxOpacity;
    el.style.backgroundPosition = `${Math.random() * 100}% ${Math.random() * 100}%`;
    setTimeout(() => animateNoise(id, maxOpacity), 100);
}

/**
 * 2. 初期化処理
 * ページの読み込み完了時に実行されます。
 */
document.addEventListener('DOMContentLoaded', () => {
    // ノイズ開始
    animateNoise('noise-grain', 0.15);
    animateNoise('noise-static', 0.1);

    // 2秒後にエントランスを表示
    setTimeout(() => {
        console.log("Switching to Entrance...");
        document.body.classList.add('is-ready');
        
        // 座標計算が狂わないよう、表示が確定した後に描画ループを開始
        requestAnimationFrame(updateLines);
    }, 2000);
});

/**
 * 3. シャボン玉を弾けさせる処理（全バブル対応版）
 */
// script.js

let lastPoppedBubble = null;

function popBubble(element) {
    if (!element || element.classList.contains('expanding')) return;
    
    // どのバブルが巨大化したかを記憶
    lastPoppedBubble = element; 
    const label = element.innerText.trim();

    // 巨大化アニメーション開始
    element.classList.remove('shrinking'); 
    element.classList.add('expanding');

    setTimeout(() => {
        // コンテンツ表示
        const area = document.getElementById('content-area');
        const inner = document.getElementById('inner-content');
        inner.innerHTML = `<h1>${label}</h1><p>Welcome to ${label} Section</p>`;
        
        // エントランス要素を透明にする
        document.getElementById('main-logo').style.opacity = '0';
        document.getElementById('bubble-lines').style.opacity = '0';
        document.querySelectorAll('.bubble').forEach(b => {
            if (b !== element) b.style.opacity = '0';
        });

        area.classList.remove('hidden');
        setTimeout(() => area.classList.add('visible'), 50);
    }, 800);
}

function backToEntrance() {
    console.log("Back button clicked!");

    if (!lastPoppedBubble) {
        console.error("No bubble to shrink back!");
        return;
    }

    const area = document.getElementById('content-area');
    area.classList.remove('visible');

    // コンテンツが消えるのを待ってからバブルを縮める
    setTimeout(() => {
        area.classList.add('hidden');

        // ★ クラスの付け替え
        lastPoppedBubble.classList.remove('expanding');
        
        // ブラウザに「今の変化」を強制認識させる（重要！）
        void lastPoppedBubble.offsetWidth; 

        // 縮小アニメーション開始
        lastPoppedBubble.classList.add('shrinking');

        // ロゴや他の要素を復活させる
        setTimeout(() => {
            document.getElementById('main-logo').style.opacity = '1';
            document.getElementById('bubble-lines').style.opacity = '1';
            document.querySelectorAll('.bubble').forEach(b => {
                b.style.opacity = '1';
                b.style.display = 'flex';
            });
        }, 300);

        // 1.2秒後（アニメーション終了時）にクラスを掃除
        setTimeout(() => {
            lastPoppedBubble.classList.remove('shrinking');
            console.log("Shrink animation finished");
        }, 1200);

    }, 400);
}

/**
 * 元のエントランスに戻る処理
 */
function backToEntrance() {
    const overlay = document.getElementById('color-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        // コンテンツを隠す
        const contentArea = document.getElementById('content-area');
        contentArea.classList.add('hidden');
        contentArea.classList.remove('visible');

        // 全ての要素を復活させる
        document.getElementById('main-logo').style.display = 'block';
        document.querySelectorAll('.bubble').forEach(b => {
            b.classList.remove('popped');
            b.style.display = 'flex';
        });
        document.getElementById('bubble-lines').style.display = 'block';

        overlay.classList.remove('active');
    }, 800);
}

/**
 * エントランスに戻る処理
 */
function backToEntrance() {
    const overlay = document.getElementById('color-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        // コンテンツを隠す
        const contentArea = document.getElementById('content-area');
        contentArea.classList.add('hidden');
        contentArea.classList.remove('visible');

        // エントランス要素を復活させる
        document.getElementById('main-logo').style.display = 'block';
        document.querySelectorAll('.bubble').forEach(b => {
            b.classList.remove('popped');
            b.style.display = 'flex';
        });
        document.getElementById('bubble-lines').style.display = 'block';

        overlay.classList.remove('active');
    }, 800);
}

/**
 * 4. ぐにゃぐにゃ線の描画ループ
 * ロゴと各バブルを結ぶSVGパスを毎フレーム更新します。
 */
let time = 0;

function updateLines() {
    const logo = document.getElementById('main-logo');
    if (!logo) return;

    // ロゴの中心座標と半径の計算
    const logoRect = logo.getBoundingClientRect();
    const logoX = logoRect.left + logoRect.width / 2 + window.scrollX;
    const logoY = logoRect.top + logoRect.height / 2 + window.scrollY;
    const logoR = logoRect.width / 2.5; 

    time += 0.02;

    // バブルごとの線の色
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

        // バブルがはじけていない場合のみ描画
        if (!bubble.classList.contains('popped')) {
            const bRect = bubble.getBoundingClientRect();
            const bX = bRect.left + bRect.width / 2 + window.scrollX;
            const bY = bRect.top + bRect.height / 2 + window.scrollY;
            const bR = bRect.width / 2;

            // ロゴとバブルを結ぶ角度
            const angle = Math.atan2(bY - logoY, bX - logoX);

            // 開始点（ロゴの端）と終了点（バブルの端）
            const startX = logoX + Math.cos(angle) * logoR;
            const startY = logoY + Math.sin(angle) * logoR;
            const endX = bX - Math.cos(angle) * bR;
            const endY = bY - Math.sin(angle) * bR;

            // ぐにゃぐにゃの制御点（ベジェ曲線）
            const waveX = Math.sin(time + i) * 40;
            const waveY = Math.cos(time * 0.8 + i) * 40;
            const cpX = (startX + endX) / 2 + waveX;
            const cpY = (startY + endY) / 2 + waveY;

            // SVGパスを更新
            const d = `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`;
            path.setAttribute('d', d);
            path.setAttribute('stroke', colors[i-1]);
            path.classList.remove('line-hidden');
        } else {
            // はじけていたら線を消す
            path.classList.add('line-hidden');
        }
    }
    
    // 次のフレームも実行
    requestAnimationFrame(updateLines);
}