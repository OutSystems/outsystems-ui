// @ts-check
/** Aggregation, history and presentation of eval runs. */
import { mean, round1 } from './score.mjs';

/**
 * @typedef {object} MetricResult
 * @property {string} id
 * @property {string} name
 * @property {number} score
 * @property {boolean} movable
 * @property {unknown} raw
 * @property {string} [summary]
 */

/**
 * @typedef {object} HistoryEntry
 * @property {string} label
 * @property {string} date
 * @property {string} sha
 * @property {Record<string, number>} scores
 * @property {number} index
 */

/**
 * Rounded per-metric scores and the unweighted index.
 * @param {MetricResult[]} results
 */
export function aggregate(results) {
	/** @type {Record<string, number>} */
	const scores = {};
	for (const r of results) scores[r.id] = round1(r.score);
	return { scores, index: round1(mean(Object.values(scores)) ?? 0) };
}

/**
 * Replace the entry with the same label or append.
 * @param {HistoryEntry[]} history
 * @param {HistoryEntry} entry
 */
export function upsertHistory(history, entry) {
	const next = [...history];
	const i = next.findIndex((e) => e.label === entry.label);
	if (i >= 0) next[i] = entry;
	else next.push(entry);
	return next;
}

/**
 * @param {{ label: string, scores: Record<string, number>, index: number }} a
 * @param {{ label: string, scores: Record<string, number>, index: number }} b
 */
export function compareRuns(a, b) {
	const ids = [...new Set([...Object.keys(a.scores), ...Object.keys(b.scores)])].sort();
	const rows = ids.map((id) => {
		const from = a.scores[id] ?? 0;
		const to = b.scores[id] ?? 0;
		return { id, from, to, delta: round1(to - from) };
	});
	return { from: a.label, to: b.label, rows, indexDelta: round1(b.index - a.index) };
}

/**
 * Markdown table for one run.
 * @param {{ label: string, sha?: string, results: MetricResult[], scores: Record<string, number>, index: number }} run
 */
export function formatTable(run) {
	const lines = ['| ID | Eval | Score | Movable | Notes |', '| --- | --- | ---: | :---: | --- |'];
	for (const r of run.results) {
		lines.push(`| ${r.id} | ${r.name} | ${run.scores[r.id].toFixed(1)} | ${r.movable ? 'yes' : 'structural'} | ${r.summary ?? ''} |`);
	}
	lines.push(`| — | **AI-Friendliness Index** | **${run.index.toFixed(1)}** | | ${run.label}${run.sha ? ` @ ${run.sha}` : ''} |`);
	return lines.join('\n');
}

/**
 * Markdown table for a comparison.
 * @param {ReturnType<typeof compareRuns>} c
 */
export function formatComparison(c) {
	const sign = (/** @type {number} */ d) => (d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1));
	const lines = [`| ID | ${c.from} | ${c.to} | Δ |`, '| --- | ---: | ---: | ---: |'];
	for (const r of c.rows) lines.push(`| ${r.id} | ${r.from.toFixed(1)} | ${r.to.toFixed(1)} | ${sign(r.delta)} |`);
	lines.push(`| **Index** | | | **${sign(c.indexDelta)}** |`);
	return lines.join('\n');
}
