// @ts-check
/** Scoring primitives shared by the ten evals. */

/** @param {number} x */
export const clamp01 = (x) => Math.min(1, Math.max(0, x));

/** @param {number} x */
export const round1 = (x) => Math.round(x * 10) / 10;

/**
 * Linear band for a lower-is-better value: `best` → 100, `worst` → 0, clamped.
 * @param {number} value
 * @param {number} best
 * @param {number} worst
 */
export function band(value, best, worst) {
	return 100 * clamp01((worst - value) / (worst - best));
}

/**
 * 100 minus the sum of penalties, floored at 0.
 * @param {number[]} penalties
 */
export function penalty(penalties) {
	return Math.max(0, 100 - penalties.reduce((a, b) => a + b, 0));
}

/**
 * Arithmetic mean, or null for an empty list.
 * @param {number[]} values
 * @returns {number|null}
 */
export function mean(values) {
	if (values.length === 0) return null;
	return values.reduce((a, b) => a + b, 0) / values.length;
}
