/* ================================================================
   scenes/scene2/scene2.js
   
   Basketball sequence — 8 beats triggered by scroll.
   
   SCROLL MAP (as local 0–1 within scene range 10%–58%):
   ┌─────────────────────────────────────────────────────────┐
   │ 0.00–0.17  Ring shrinks, avatar slides in from left     │
   │ 0.17–0.40  Run sequence (PNG frames auto-play)           │
   │ 0.40–0.50  Ball arc in from top-right (CSS)             │
   │ 0.50–0.65  Catch + Dribble sequences (PNG)              │
   │ 0.65–0.80  Hook shot (PNG) + ball into hoop (CSS)       │
   │ 0.80–0.88  Hoop fades, ball falls                       │
   │ 0.88–1.00  Avatar waves, walks out                      │
   └─────────────────────────────────────────────────────────┘
   
   TEACHER'S NOTE:
   Scroll TRIGGERS the videos — it doesn't scrub them frame-by-frame.
   Each beat auto-plays at normal speed when scroll hits its trigger.
   ================================================================ */

import { onScroll, localProgress } from '../../JS/utils/scrollProgress.js';
import { getSequence }             from '../../JS/utils/assetLoader.js';
import { remap, easeOut }          from '../../JS/utils/lerp.js';
import { FramePlayer }             from './canvas.js';
import { initBallArc, triggerArc, resetArc, triggerFall } from './ballArc.js';

/* ── DOM refs ─────────────────────────────────────────────────── */
const actionCanvas  = document.getElementById('avatar-action-canvas');
const hoopContainer = document.getElementById('hoop-container');
const fallenBall    = document.getElementById('fallen-ball');

/* ── State machine ────────────────────────────────────────────── */
const BEATS = {
  IDLE:      'idle',
  RUN:       'run',
  ARC:       'arc',
  CATCH:     'catch',
  DRIBBLE:   'dribble',
  HOOKSHOT:  'hookshot',
  FALL:      'fall',
  LEAVING:   'leaving',
};

let currentBeat = BEATS.IDLE;
let player      = null;

/* ── Beat trigger thresholds (local 0–1) ─────────────────────── */
const TRIGGERS = {
  [BEATS.RUN]:      0.17,
  [BEATS.ARC]:      0.40,
  [BEATS.CATCH]:    0.50,
  [BEATS.DRIBBLE]:  0.58,
  [BEATS.HOOKSHOT]: 0.65,
  [BEATS.FALL]:     0.80,
  [BEATS.LEAVING]:  0.88,
};

/* ── Avatar horizontal positions (% from left) ───────────────── */
const X_START  = -8;   // starts off-screen left
const X_CENTER = 25;   // center of screen area
const X_RIGHT  = 65;   // right side (before exit)

/* ================================================================
   INIT
   ================================================================ */
export function initScene2(range) {
  if (!actionCanvas) return;

  // Size canvas
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Init frame player on the action canvas
  player = new FramePlayer(actionCanvas);

  // Init ball arc element
  initBallArc();

  // Initial states
  actionCanvas.style.opacity = '0';
  if (hoopContainer) hoopContainer.style.opacity  = '0';
  if (fallenBall) {
    fallenBall.style.opacity = '0';
    fallenBall.hidden = true;
  }

  // Subscribe to scroll
  onScroll(({ progress }) => {
    const local = localProgress(progress, range.start, range.end);
    updateScene2(local, progress);
  });
}

/* ── Canvas sizing ────────────────────────────────────────────── */
function resizeCanvas() {
  if (!actionCanvas) return;
  actionCanvas.width  = Math.round(window.innerHeight * 0.6); // 60% of vh as width
  actionCanvas.height = Math.round(window.innerHeight * 0.85);
}

/* ================================================================
   MAIN UPDATE — runs on every scroll event
   ================================================================ */
function updateScene2(local, globalProgress) {
  // Show the scene
  if (local > 0 && local < 1) {
    actionCanvas.style.opacity = '1';
    actionCanvas.style.display = 'block';
  } else if (local <= 0) {
    actionCanvas.style.opacity = '0';
    return;
  }

  /* ── Avatar horizontal translate ───────────────────────────── */
  let avatarX;
  if (local < TRIGGERS[BEATS.RUN]) {
    // Slide in from left: 0% → center
    const t   = remap(local, 0, TRIGGERS[BEATS.RUN], 0, 1);
    avatarX   = remap(t, 0, 1, X_START, X_CENTER);
  } else if (local < TRIGGERS[BEATS.FALL]) {
    // Stay in center-ish with slight drift right as sequence progresses
    const t   = remap(local, TRIGGERS[BEATS.RUN], TRIGGERS[BEATS.FALL], 0, 1);
    avatarX   = remap(t, 0, 1, X_CENTER, X_RIGHT);
  } else if (local >= TRIGGERS[BEATS.LEAVING]) {
    // Walk back out to left
    const t   = remap(local, TRIGGERS[BEATS.LEAVING], 1.0, 0, 1);
    avatarX   = remap(easeOut(t), 0, 1, X_RIGHT, -15);
  } else {
    avatarX   = X_RIGHT;
  }

  actionCanvas.style.left = `${avatarX}%`;

  /* ── Beat triggers ──────────────────────────────────────────── */
  triggerBeats(local);

  /* ── Hoop fade in ───────────────────────────────────────────── */
  if (hoopContainer) {
    if (local >= TRIGGERS[BEATS.ARC] && local < TRIGGERS[BEATS.FALL]) {
      const t = remap(local, TRIGGERS[BEATS.ARC], TRIGGERS[BEATS.CATCH], 0, 1);
      hoopContainer.style.opacity = String(Math.min(1, t * 3));
    } else if (local >= TRIGGERS[BEATS.FALL]) {
      // Fade out
      const t = remap(local, TRIGGERS[BEATS.FALL], TRIGGERS[BEATS.LEAVING], 0, 1);
      hoopContainer.style.opacity = String(Math.max(0, 1 - t));
    } else {
      hoopContainer.style.opacity = '0';
    }
  }

  /* ── Fallen ball ────────────────────────────────────────────── */
  if (fallenBall) {
    fallenBall.style.opacity = '0';
    fallenBall.hidden = true;
  }
}

/* ================================================================
   BEAT STATE MACHINE
   Only plays a sequence once per trigger crossing (going forward).
   Resets when scrolling back past the trigger.
   ================================================================ */
function triggerBeats(local) {

  /* ── RUN ──────────────────────────────────────────────────── */
  if (local >= TRIGGERS[BEATS.RUN] && currentBeat === BEATS.IDLE) {
    playSequence('run', BEATS.RUN, () => {
      if (currentBeat === BEATS.RUN) currentBeat = BEATS.ARC;
    });
  }

  /* ── BALL ARC ─────────────────────────────────────────────── */
  if (local >= TRIGGERS[BEATS.ARC] && currentBeat === BEATS.RUN) {
    currentBeat = BEATS.ARC;
    triggerArc();
  }

  /* ── CATCH ────────────────────────────────────────────────── */
  if (local >= TRIGGERS[BEATS.CATCH] && currentBeat === BEATS.ARC) {
    playSequence('catch', BEATS.CATCH, () => {
      if (currentBeat === BEATS.CATCH) currentBeat = BEATS.DRIBBLE;
    });
  }

  /* ── DRIBBLE ──────────────────────────────────────────────── */
  if (local >= TRIGGERS[BEATS.DRIBBLE] && currentBeat === BEATS.CATCH) {
    playSequence('dribble', BEATS.DRIBBLE, () => {
      if (currentBeat === BEATS.DRIBBLE) currentBeat = BEATS.HOOKSHOT;
    });
  }

  /* ── HOOKSHOT ─────────────────────────────────────────────── */
  if (local >= TRIGGERS[BEATS.HOOKSHOT] && currentBeat === BEATS.DRIBBLE) {
    // Play hookshot1 then hookshot2 in sequence
    playSequenceChain(
      ['hookshot1', 'hookshot2'],
      BEATS.HOOKSHOT,
      () => {
        if (currentBeat === BEATS.HOOKSHOT) currentBeat = BEATS.FALL;
      }
    );
  }

  /* ── BALL FALL ────────────────────────────────────────────── */
  if (local >= TRIGGERS[BEATS.FALL] && currentBeat === BEATS.HOOKSHOT) {
    currentBeat = BEATS.FALL;
    triggerFall();
  }

  /* ── LEAVING ──────────────────────────────────────────────── */
  if (local >= TRIGGERS[BEATS.LEAVING] && currentBeat === BEATS.FALL) {
    playSequence('leaving', BEATS.LEAVING, null);
  }

  /* ── RESET when scrolling back ────────────────────────────── */
  if (local < TRIGGERS[BEATS.RUN]) {
    if (currentBeat !== BEATS.IDLE) {
      currentBeat = BEATS.IDLE;
      player && player.stop();
      resetArc();
    }
  }
}

/* ── Play a single named sequence ────────────────────────────── */
function playSequence(key, beat, onComplete) {
  currentBeat = beat;
  const frames = getSequence(key);
  if (!frames.length) return;

  player.loadSequence(frames);
  player.playFrom(0, frames.length - 1, 24, onComplete);
}

/* ── Play multiple sequences back-to-back ────────────────────── */
function playSequenceChain(keys, beat, onComplete) {
  currentBeat = beat;
  let index   = 0;

  function next() {
    if (index >= keys.length) {
      if (onComplete) onComplete();
      return;
    }
    const key    = keys[index++];
    const frames = getSequence(key);
    if (!frames.length) { next(); return; }
    player.loadSequence(frames);
    player.playFrom(0, frames.length - 1, 24, next);
  }

  next();
}
