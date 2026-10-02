// @ts-check
/**
 * Helpers for a metric's `present` block: the hint text of a per-component cell and the eval-level
 * next steps the dashboard shows. Kept here so every metric phrases its cells the same way.
 */

/** Whole-number percentage of `a` in `b`; 100 when there is nothing to count. */
export const pct = (/** @type {number} */ a, /** @type {number} */ b) => (b ? Math.round((100 * a) / b) : 100);

/** One decimal. */
export const r1 = (/** @type {number} */ n) => Math.round(n * 10) / 10;

/**
 * Comma-separated list capped at `max` items, with the remainder counted.
 * @param {string[]} xs
 */
export const list = (xs, max = 4) =>
	xs.length > max ? `${xs.slice(0, max).join(', ')} +${xs.length - max} more` : xs.join(', ');

/**
 * " To do: a; b." when there is something to do, else the fallback.
 * @param {string[]} todo
 * @param {string} [fallback]
 */
export const toDoHint = (todo, fallback = '') => (todo.length ? ` To do: ${todo.join('; ')}.` : fallback);

/** Per-component rows of a metric result as an array. @param {any} m */
export const rowsOf = (m) => /** @type {any[]} */ (Object.values(m.perComponent ?? {}));

/**
 * Cell for a row of applicable checks with a `failed` list (the enterprise evals share this shape).
 * @param {{ score: number|null, failed?: string[] }} row
 * @param {string[]} [extras] sentences appended after the verdict
 * @returns {{ s: number|null, h: string }}
 */
export function checksCell(row, extras = []) {
	const failed = row.failed ?? [];
	const head = failed.length ? `Missing: ${failed.join('; ')}.` : 'Every applicable check passes.';
	const tail = extras.length ? ` ${extras.join('. ')}.` : '';
	return { s: row.score, h: `${head}${tail}` };
}
