// @ts-check
/** Aggregation, history and presentation of eval runs. */
import { mean, round1 } from './score.mjs';

/**
 * @typedef {object} MetricResult
 * @property {string} id
 * @property {string} name
 * @property {number} score
 * @property {boolean} movable
 * @property {string} [cls]
 * @property {unknown} raw
 * @property {string} [summary]
 * @property {{ name: string, reason: string }[]} [unmeasured]
 * @property {{ name: string, reason: string, hint?: string }[]} [notApplicable]
 */

/**
 * @typedef {{ scores: Record<string, number>, index: number, unmeasured?: Record<string, number> }} SuiteEntry
 * @typedef {object} HistoryEntry
 * @property {string} label
 * @property {string} date
 * @property {string} sha
 * @property {string} [branch] branch the run was recorded on, when known
 * @property {string} [inputs] fingerprint of the measured inputs (lib/inputs.mjs)
 * @property {Record<string, SuiteEntry>} suites one entry per suite the run carried, keyed by suite id
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
 * Lift a history entry of the previous shape (`{ scores, index, enterprise? }`) into the suites shape;
 * an entry already carrying `suites` is returned as is.
 * @param {any} e
 * @returns {HistoryEntry}
 */
export function normalizeHistoryEntry(e) {
	if (e.suites) return e;
	const { scores, index, enterprise, ...rest } = e;
	/** @type {Record<string, SuiteEntry>} */
	const suites = { ai: { scores, index } };
	if (enterprise) suites.enterprise = enterprise;
	return { ...rest, suites };
}

/**
 * Lift a run file of the previous shape into the suites shape (each suite with its scores, index and
 * results); a run already carrying `suites` is returned as is.
 * @param {any} run
 */
export function normalizeRun(run) {
	if (run.suites) return run;
	const { scores, index, results, enterprise, ...rest } = run;
	/** @type {Record<string, any>} */
	const suites = { ai: { scores, index, results } };
	if (enterprise) suites.enterprise = enterprise;
	return { ...rest, suites };
}

/**
 * Number of components each eval could not measure (components it does not apply to are not counted).
 * @param {{ id: string, unmeasured?: unknown[] }[]} results
 * @returns {Record<string, number>}
 */
export function unmeasuredCounts(results) {
	/** @type {Record<string, number>} */
	const out = {};
	for (const r of results) out[r.id] = r.unmeasured?.length ?? 0;
	return out;
}

/**
 * The history entry of a run: identity plus, per suite, scores, index and unmeasured counts.
 * @param {{ label: string, date: string, sha: string, branch?: string, inputs?: string, suites: Record<string, { scores: Record<string, number>, index: number, results: any[] }> }} run
 * @returns {HistoryEntry}
 */
export function historyEntryOf(run) {
	/** @type {Record<string, SuiteEntry>} */
	const suites = {};
	for (const [id, s] of Object.entries(run.suites)) {
		suites[id] = { scores: s.scores, index: s.index, unmeasured: unmeasuredCounts(s.results) };
	}
	/** @type {HistoryEntry} */
	const entry = { label: run.label, date: run.date, sha: run.sha, suites };
	if (run.branch) entry.branch = run.branch;
	if (run.inputs) entry.inputs = run.inputs;
	return entry;
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
	const ids = [...new Set([...Object.keys(a.scores), ...Object.keys(b.scores)])].sort((x, y) => x.localeCompare(y));
	const rows = ids.map((id) => {
		const from = a.scores[id] ?? 0;
		const to = b.scores[id] ?? 0;
		return { id, from, to, delta: round1(to - from) };
	});
	return { from: a.label, to: b.label, rows, indexDelta: round1(b.index - a.index) };
}

/** Movability class of a metric result: explicit `cls`, else derived from `movable`. */
export function classOf(/** @type {{ movable: boolean, cls?: string }} */ r) {
	if (r.cls) return r.cls;
	return r.movable ? 'movable' : 'structural';
}

/**
 * Markdown table for one suite of a run.
 * @param {{ label: string, sha?: string, results: MetricResult[], scores: Record<string, number>, index: number }} run
 * @param {{ title?: string }} [options] index title
 */
export function formatTable(run, { title = 'Index' } = {}) {
	const lines = ['| ID | Eval | Score | Class | Notes |', '| --- | --- | ---: | :---: | --- |'];
	for (const r of run.results) {
		lines.push(`| ${r.id} | ${r.name} | ${run.scores[r.id].toFixed(1)} | ${classOf(r)} | ${r.summary ?? ''} |`);
	}
	const provenance = run.sha ? `${run.label} @ ${run.sha}` : run.label;
	lines.push(`| — | **${title}** | **${run.index.toFixed(1)}** | | ${provenance} |`);
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
