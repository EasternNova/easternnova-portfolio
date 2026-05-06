/* ================================================================
   utils/lerp.js — Math helpers for smooth animation
   ================================================================ */

/**
 * Linear interpolation between two values.
 * lerp(0, 100, 0.5) → 50
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Smooth lerp using exponential decay — use this for "lag" effects.
 * Call every frame: value = smoothLerp(value, target, 0.1);
 * Lower factor = slower / more lag. 0.1 is gentle, 0.3 is snappy.
 */
export const smoothLerp = (current, target, factor) =>
  current + (target - current) * factor;

/**
 * Ease in-out cubic — makes motion feel natural at start and end.
 * Input and output both 0–1.
 */
export const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Ease out quart — fast start, slow finish. Good for elements
 * sliding into place.
 */
export const easeOut = (t) => 1 - Math.pow(1 - t, 4);

/**
 * Ease in cubic — slow start, fast finish. Good for exits.
 */
export const easeIn = (t) => t * t * t;

/**
 * Clamp a value between min and max.
 */
export const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

/**
 * Map a value from one range to another, with optional clamping.
 *
 * Example: remap(0.25, 0.1, 0.5, 0, 100) → 37.5
 *
 * @param {number} value
 * @param {number} inMin   - input range start
 * @param {number} inMax   - input range end
 * @param {number} outMin  - output range start
 * @param {number} outMax  - output range end
 * @param {boolean} clampOutput - clamp result to [outMin, outMax]
 */
export function remap(value, inMin, inMax, outMin, outMax, clampOutput = true) {
  const t = (value - inMin) / (inMax - inMin);
  const result = outMin + t * (outMax - outMin);
  return clampOutput ? clamp(result, outMin, outMax) : result;
}
