import { onScroll, localProgress } from '../../JS/utils/scrollProgress.js';
import { getSequence } from '../../JS/utils/assetLoader.js';
import { lerp, easeInOut } from '../../JS/utils/lerp.js';

const ring = document.getElementById('portal-ring');
const heroCopy = document.getElementById('hero-copy');
const scrollHint = document.getElementById('scroll-hint');

const avatarVideo = document.getElementById('avatar-hero-video');
const avatarImage = document.getElementById('avatar-hero-image');
const avatarNavButtons = document.querySelectorAll('[data-avatar-step]');

const widget = document.getElementById('avatar-360-widget');
const widgetCanvas = document.getElementById('avatar-360-widget-canvas');

const avatarModes = ['video', 'image'];

let currentAvatarMode = 0;

let spinFrames = [];
let spinCtx = null;
let spinFrameIndex = 0;

let spinZoom = 1;
let targetZoom = 1;
let animationFrame = null;

let isDraggingSpin = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartFrame = 0;
let dragStartZoom = 1;

let autoSpinId = null;

export function initScene1(range) {
  initAvatarToggle();
  initSpinWidget();

  widgetCanvas?.addEventListener('mouseleave', resetAvatarWidget);

  onScroll(({ progress }) => {
    const local = localProgress(progress, range.start, range.end);
    updateScene1(local);
  });
}

function initAvatarToggle() {
  if (!avatarVideo || !avatarImage || avatarNavButtons.length === 0) return;

  avatarNavButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const step = Number(button.dataset.avatarStep || 1);

      currentAvatarMode =
        (currentAvatarMode + step + avatarModes.length) %
        avatarModes.length;

      setAvatarMode(avatarModes[currentAvatarMode]);
    });
  });
}

function setAvatarMode(mode) {
  const showVideo = mode === 'video';

  avatarVideo.classList.toggle('is-active', showVideo);
  avatarImage.classList.toggle('is-active', !showVideo);

  if (showVideo) {
    avatarVideo.play().catch(() => {});
  } else {
    avatarVideo.pause();
  }
}

function initSpinWidget() {
  if (!widget || !widgetCanvas) return;

  spinFrames = getSequence('idle');
  spinCtx = widgetCanvas.getContext('2d');

  resizeSpinWidget();
  drawSpinFrame(0);

  window.addEventListener('resize', () => {
    resizeSpinWidget();
    drawSpinFrame(spinFrameIndex);
  });

  widgetCanvas.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();

      setSpinZoom(
        spinZoom + (event.deltaY < 0 ? 0.08 : -0.08)
      );
    },
    { passive: false }
  );

  widgetCanvas.addEventListener('pointerdown', (event) => {
    cancelAutoSpin();

    isDraggingSpin = true;

    dragStartX = event.clientX;
    dragStartY = event.clientY;

    dragStartFrame = spinFrameIndex;
    dragStartZoom = spinZoom;

    widgetCanvas.classList.add('is-dragging');
    widget?.classList.add('is-pulled');

    widgetCanvas.setPointerCapture(event.pointerId);
  });

  widgetCanvas.addEventListener('pointermove', (event) => {
    if (!isDraggingSpin || spinFrames.length === 0) return;

    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;

    widget?.style.setProperty('--widget-x', `${deltaX}px`);
    widget?.style.setProperty('--widget-y', `${deltaY}px`);

    drawSpinFrame(
      wrapFrame(dragStartFrame + Math.round(deltaX / 7))
    );

    const zoomDelta = -deltaY * 0.0018;

    setSpinZoom(dragStartZoom + zoomDelta);
  });

  widgetCanvas.addEventListener('pointerup', endSpinDrag);
  widgetCanvas.addEventListener('pointercancel', endSpinDrag);
  widgetCanvas.addEventListener('lostpointercapture', endSpinDrag);

  startAutoSpinOnce();
}

function startAutoSpinOnce() {
  if (!spinFrames.length) return;

  cancelAutoSpin();

  const start = performance.now();
  const duration = 2600;
  const startFrame = spinFrameIndex;

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);

    drawSpinFrame(
      startFrame + Math.round(progress * spinFrames.length)
    );

    if (progress < 1) {
      autoSpinId = requestAnimationFrame(tick);
    } else {
      autoSpinId = null;
    }
  }

  autoSpinId = requestAnimationFrame(tick);
}

function cancelAutoSpin() {
  if (!autoSpinId) return;

  cancelAnimationFrame(autoSpinId);
  autoSpinId = null;
}

function endSpinDrag() {
  isDraggingSpin = false;

  widgetCanvas?.classList.remove('is-dragging');
  widget?.classList.remove('is-pulled');

  widget?.style.setProperty('--widget-x', '0px');
  widget?.style.setProperty('--widget-y', '0px');
}

function resetAvatarWidget() {
  isDraggingSpin = false;

  widgetCanvas?.classList.remove('is-dragging');
  widget?.classList.remove('is-pulled');

  widget?.style.setProperty('--widget-x', '0px');
  widget?.style.setProperty('--widget-y', '0px');

  targetZoom = 1;

  drawSpinFrame(0);
}

function setSpinZoom(value) {
  targetZoom = Math.max(0.55, Math.min(1.65, value));

  if (!animationFrame) {
    animateZoom();
  }
}

function animateZoom() {
  spinZoom += (targetZoom - spinZoom) * 0.12;

  drawSpinFrame(spinFrameIndex);

  if (Math.abs(targetZoom - spinZoom) > 0.001) {
    animationFrame = requestAnimationFrame(animateZoom);
  } else {
    spinZoom = targetZoom;
    animationFrame = null;
  }
}

function resizeSpinWidget() {
  if (!widgetCanvas) return;

  const rect = widgetCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  widgetCanvas.width = Math.round(rect.width * dpr);
  widgetCanvas.height = Math.round(rect.height * dpr);

  widgetCanvas.style.width = `${rect.width}px`;
  widgetCanvas.style.height = `${rect.height}px`;

  if (spinCtx) {
    spinCtx.setTransform(1, 0, 0, 1, 0, 0);
    spinCtx.scale(dpr, dpr);
  }
}

function drawSpinFrame(index) {
  if (!spinCtx || !widgetCanvas || spinFrames.length === 0) return;

  spinFrameIndex = wrapFrame(index);

  const frame = spinFrames[spinFrameIndex];

  const canvasWidth = widgetCanvas.clientWidth;
  const canvasHeight = widgetCanvas.clientHeight;

  const frameRatio =
    frame.naturalWidth / frame.naturalHeight;

  const baseHeight = canvasHeight * 0.68;

  const zoomFactor =
    1 + (spinZoom - 1) * 0.55;

  const targetHeight = baseHeight * zoomFactor;
  const targetWidth = targetHeight * frameRatio;

  const x = (canvasWidth - targetWidth) / 2;
  const y = (canvasHeight - targetHeight) / 2 + 40;

  spinCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  spinCtx.drawImage(
    frame,
    x,
    y,
    targetWidth,
    targetHeight
  );
}

function wrapFrame(index) {
  if (spinFrames.length === 0) return 0;

  return (
    ((index % spinFrames.length) + spinFrames.length) %
    spinFrames.length
  );
}

function updateScene1(local) {
  const ringProgress = localProgress(local, 0.6, 1.0);

  const ringScale = lerp(
    1,
    0,
    easeInOut(ringProgress)
  );

  const ringOpacity = lerp(
    1,
    0,
    easeInOut(ringProgress)
  );

  const heroVisual = ring?.parentElement;

  if (heroVisual) {
    heroVisual.style.setProperty(
      '--ring-scale',
      ringScale
    );

    heroVisual.style.setProperty(
      '--hero-ring-opacity',
      ringOpacity
    );

    heroVisual.style.setProperty(
      '--hero-ring-y',
      `${lerp(0, 34, easeInOut(ringProgress))}px`
    );
  }

  const textProgress = localProgress(local, 0.4, 0.9);

  const textOpacity = lerp(
    1,
    0,
    easeInOut(textProgress)
  );

  if (heroCopy) {
    heroCopy.style.setProperty(
      '--hero-text-opacity',
      textOpacity
    );

    heroCopy.style.setProperty(
      '--hero-copy-y',
      `${lerp(0, -24, easeInOut(textProgress))}px`
    );
  }

  const hintProgress = localProgress(local, 0.0, 0.3);

  if (scrollHint) {
    scrollHint.style.setProperty(
      '--scroll-hint-opacity',
      lerp(1, 0, hintProgress)
    );
  }

  if (widget) {
    const widgetProgress = localProgress(local, 0.45, 1);

    widget.style.setProperty(
      '--widget-opacity',
      lerp(1, 0, widgetProgress)
    );

    widget.style.setProperty(
      '--widget-scale',
      lerp(1, 0.72, widgetProgress)
    );
  }
}