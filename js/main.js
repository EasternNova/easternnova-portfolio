import { initScroll } from './utils/scrollProgress.js';
import { loadAll } from './utils/assetLoader.js';

import { initScene1 } from '../scenes/scene1/scene1.js';
import { initScene2 } from '../scenes/scene2/scene2.js';
import { initScene3 } from '../scenes/scene3/scene3.js';
import { initScene4 } from '../scenes/scene4/scene4.js';
import { initBackground } from './background.js';

export const SCENE_RANGES = {
  scene1: { start: 0.00, end: 0.12 },
  scene2: { start: 0.10, end: 0.58 },
  scene3: { start: 0.50, end: 0.82 },
  scene4: { start: 0.80, end: 1.00 },
};

const TOTAL_SCROLL_HEIGHT = window.innerHeight * 5;

function showLoader() {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = `
    <div class="loader-inner">
      <p class="loader-bg-name">EasternNova</p>
      <p class="loader-name">EasternNova</p>
      <div class="loader-bar-track">
        <div class="loader-bar" id="loader-bar"></div>
      </div>
      <p class="loader-pct" id="loader-pct">0%</p>
    </div>
  `;

  loader.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    background:#050510;
    display:flex; align-items:center; justify-content:center;
    flex-direction:column;
    font-family:system-ui, sans-serif;
    backdrop-filter:blur(2px);
  `;
  loader.querySelector('.loader-inner').style.cssText = `
    position:relative;
    width:min(520px, 82vw);
    min-height:220px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  `;
  loader.querySelector('.loader-bg-name').style.cssText = `
    position:absolute;
    inset:auto;
    font-size:clamp(3.8rem, 11vw, 8rem);
    line-height:1;
    font-weight:900;
    letter-spacing:0.08em;
    color:rgba(255,255,255,0.035);
    white-space:nowrap;
    pointer-events:none;
  `;
  loader.querySelector('.loader-name').style.cssText = `
    position:relative;
    color:#00f5ff; font-size:1.5rem; letter-spacing:0.25em;
    text-shadow:0 0 20px rgba(0,245,255,0.8);
    margin-bottom:1.2rem;
  `;
  loader.querySelector('.loader-bar-track').style.cssText = `
    position:relative;
    width:200px; height:2px; background:rgba(255,255,255,0.1);
    border-radius:2px; overflow:hidden;
  `;
  loader.querySelector('.loader-bar').style.cssText = `
    height:100%; width:0%; background:#00f5ff;
    transition:width 0.3s ease;
    box-shadow:0 0 10px #00f5ff;
  `;
  loader.querySelector('.loader-pct').style.cssText = `
    position:relative;
    color:rgba(0,245,255,0.5); font-size:0.75rem;
    letter-spacing:0.2em; margin-top:0.8rem;
  `;

  document.body.appendChild(loader);
  return loader;
}

function updateLoader(loader, loaded, total) {
  const pct = Math.round((loaded / total) * 100);
  loader.querySelector('#loader-bar').style.width = `${pct}%`;
  loader.querySelector('#loader-pct').textContent = `${pct}%`;
}

function hideLoader(loader) {
  loader.style.transition = 'opacity 0.8s ease';
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 800);
}

async function bootstrap() {
  const loader = showLoader();

  window.scrollTo(0, 0);
  initBackground();
  await loadAll((loaded, total) => updateLoader(loader, loaded, total));
  initScene1(SCENE_RANGES.scene1);
  initScene2(SCENE_RANGES.scene2);
  initScene3(SCENE_RANGES.scene3);
  initScene4(SCENE_RANGES.scene4);
  initScroll(TOTAL_SCROLL_HEIGHT);

  document.body.classList.remove('is-loading');
  hideLoader(loader);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
