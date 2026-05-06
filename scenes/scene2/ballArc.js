/* ================================================================
   scenes/scene2/ballArc.js
   
   Controls the CSS basketball arc animation.
   The ball element uses CSS offset-path + CSS animation.
   
   This module just triggers the animation at the right scroll %.
   ================================================================ */

/* ── State ────────────────────────────────────────────────────── */
let ballEl       = null;
let arcTriggered = false;

/* ── Init ─────────────────────────────────────────────────────── */
export function initBallArc() {
  ballEl = document.getElementById('ball-sprite');
  if (!ballEl) {
    console.warn('[ballArc] #ball-sprite not found');
    return;
  }

  ballEl.style.opacity = '0';
  ballEl.hidden = true;
}

/**
 * Trigger the ball arc animation.
 * Call once when scroll hits the arc trigger point.
 */
export function triggerArc() {
  if (!ballEl || arcTriggered) return;
  arcTriggered = true;

  ballEl.style.opacity = '0';
  ballEl.hidden = true;
}

/**
 * Reset arc (for when user scrolls back up).
 */
export function resetArc() {
  if (!ballEl) return;
  arcTriggered = false;
  ballEl.classList.remove('arc-active', 'arc-falling');
  ballEl.style.opacity = '0';
  ballEl.hidden = true;
}

/**
 * Trigger the ball falling animation (after hoop disappears).
 */
export function triggerFall() {
  if (!ballEl) return;
  ballEl.classList.remove('arc-active');
  ballEl.classList.remove('arc-falling');
  ballEl.style.opacity = '0';
  ballEl.hidden = true;
}
