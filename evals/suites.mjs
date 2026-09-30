// @ts-check
/**
 * The suite registry: every eval suite, its index and the tolerances its gate applies.
 *
 * A suite is a directory under `evals/` with `metrics/index.mjs`, its own tests and a README. The
 * runner, the gate, the history report and the dashboard iterate this list, so adding a suite is one
 * entry here plus the directory; adding an eval is one metric module registered in its suite.
 *
 * Metric contract (checked by `tests/suites.test.mjs`): `id` (`<prefix><two digits>`), `name`,
 * `criterion`, `formula`, `movable`, optional `cls` (one of CLASSES), `compute(ctx)`, and `present`:
 *   - `scope`        what a per-component cell means and why some components have none
 *   - `heatmap`      true when `perComponent` rows are components (a dashboard column)
 *   - `appliesTo`    the tiers the eval measures (lib/tiers.mjs: pattern, component, layout, utility); a
 *                    component outside them gets a not-applicable cell that names its tier
 *   - `cell(row)`    optional: `{ s, h }` score and hint for one measured row
 *   - `advice(m)`    optional: eval-level next steps from the latest result
 *   - `extra(m)`     optional: suite-level data the dashboard shows (R01's requirement table)
 *   - `unmeasuredHint` optional: what to do about a component the eval could not measure
 * and optional `rules`: `[{ kind: 'no-decrease', why }]`, enforced by the gate on the eval's score.
 */
import { metrics as aiMetrics } from './ai-friendliness/metrics/index.mjs';
import { metrics as enterpriseMetrics } from './enterprise/metrics/index.mjs';
import { metrics as utilityMetrics } from './utilities/metrics/index.mjs';

/** Movability classes: what kind of change moves an eval. */
export const CLASSES = ['movable', 'structural', 'roadmap'];

/**
 * @typedef {object} Suite
 * @property {string} id            key in run files and history entries
 * @property {string} name          short display name
 * @property {string} indexName     display name of the suite's index
 * @property {string} idPrefix      first letter of the suite's eval ids
 * @property {string} describe      one line: the question the suite answers
 * @property {any[]} metrics        the evals, in id order
 * @property {number} maxDrop       allowed drop of the index against the baseline, in points
 * @property {number} maxEvalDrop   allowed drop of any single eval against the baseline, in points
 * @property {number} tone          colour slot of the suite in the dashboard (0, 1, …)
 */

/** @type {Suite[]} */
export const SUITES = [
	{
		id: 'ai',
		name: 'AI-friendliness',
		indexName: 'AI-Friendliness Index',
		idPrefix: 'E',
		describe: 'how legible the library is to coding agents',
		metrics: aiMetrics,
		maxDrop: 1,
		maxEvalDrop: 3,
		tone: 0,
	},
	{
		id: 'enterprise',
		name: 'Enterprise readiness',
		indexName: 'Enterprise Readiness Index',
		idPrefix: 'R',
		describe: 'how far the token theme and the patterns meet the enterprise UI requirements',
		metrics: enterpriseMetrics,
		maxDrop: 1,
		maxEvalDrop: 3,
		tone: 1,
	},
	{
		id: 'utilities',
		name: 'Utilities',
		indexName: 'Utilities Index',
		idPrefix: 'U',
		describe: 'how predictable and documented the utility classes are for an agent composing styles from them',
		metrics: utilityMetrics,
		maxDrop: 1,
		maxEvalDrop: 3,
		tone: 2,
	},
];

/** @param {string} id */
export function suiteOf(id) {
	const s = SUITES.find((x) => x.id === id);
	if (!s) throw new Error(`unknown suite "${id}" (known: ${SUITES.map((x) => x.id).join(', ')})`);
	return s;
}

/** Every metric of every suite, in registry order. */
export function allMetrics() {
	return SUITES.flatMap((s) => s.metrics);
}

/**
 * The metric with the given id and the suite it belongs to, or null.
 * @param {string} id
 * @returns {{ suite: Suite, metric: any }|null}
 */
export function metricById(id) {
	for (const suite of SUITES) {
		const metric = suite.metrics.find((m) => m.id === id);
		if (metric) return { suite, metric };
	}
	return null;
}
