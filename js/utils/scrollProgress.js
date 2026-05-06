/* ================================================================
   utils/scrollProgress.js
   
   THE GOLDEN RULE: This is the ONLY file that reads window.scrollY.
   All scenes subscribe to the 'scroll:progress' custom event.
   
   Never add window.addEventListener('scroll', ...) in any scene file.
   ================================================================ */

/**
 * Initialises the scroll system.
 * Call once from main.js after DOM is ready.
 *
 * @param {number} totalScrollHeight - Total page height in px (set on body)
 */
export function initScroll(totalScrollHeight) {
  // Set the total scroll height on the body so CSS can read it
  document.body.style.setProperty('--total-height', totalScrollHeight + 'px');
  document.body.style.height = totalScrollHeight + 'px';

  // Throttle via requestAnimationFrame to avoid jank
  let ticking = false;
  let lastProgress = -1;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    ticking = false;
    const scrollY    = window.scrollY;
    const maxScroll  = totalScrollHeight - window.innerHeight;
    const progress   = maxScroll > 0
      ? Math.max(0, Math.min(1, scrollY / maxScroll))
      : 0;

    // Only dispatch if value changed meaningfully (avoid micro-jitter)
    if (Math.abs(progress - lastProgress) < 0.0001) return;
    lastProgress = progress;

    // Single dispatch — all scenes listen for this
    window.dispatchEvent(new CustomEvent('scroll:progress', {
      detail: {
        progress,          // 0–1 raw
        percent: progress * 100,  // 0–100 convenience
        scrollY,
        maxScroll,
      }
    }));
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Fire once on load so scenes initialise to correct position
  requestAnimationFrame(update);
}

/**
 * Helper: map a global progress value to a local 0–1 within a range.
 *
 * Example:
 *   localProgress(0.25, 0.10, 0.50)  →  0.375
 *   (25% global scroll is 37.5% through the 10–50% scene window)
 *
 * @param {number} progress  - global 0–1 scroll progress
 * @param {number} start     - scene start as 0–1 fraction
 * @param {number} end       - scene end as 0–1 fraction
 * @returns {number}  clamped 0–1 local progress
 */
export function localProgress(progress, start, end) {
  if (progress <= start) return 0;
  if (progress >= end)   return 1;
  return (progress - start) / (end - start);
}

/**
 * Subscribe to scroll events in one line.
 * Returns an unsubscribe function you can call to clean up.
 *
 * @param {function} callback  - receives { progress, percent, scrollY, maxScroll }
 * @returns {function}  unsubscribe
 */
export function onScroll(callback) {
  const handler = (e) => callback(e.detail);
  window.addEventListener('scroll:progress', handler);
  return () => window.removeEventListener('scroll:progress', handler);
}
