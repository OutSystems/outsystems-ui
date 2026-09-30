// @ts-check
/**
 * U04 · Documentation parity.
 *
 * Every class the stylesheet ships must be reachable from the agent docs: covered by a row of
 * llms-utilities.txt (its template or its own name) and present in osui.utilities.json with its
 * declarations. Both are generated from the same reader, so parity fails only when the docs are stale.
 */
import { list, pct } from '../../lib/present.mjs';
import { round1 } from '../../lib/score.mjs';
import { docCoverage, utilityFamilies } from '../../lib/utilities.mjs';

const APPLIES_TO = ['utility'];
export const STALE_HINT = 'Run npm run docs:ai to regenerate llms-utilities.txt and osui.utilities.json.';

/**
 * Classes the manifest documents with at least one declaration or variant.
 * @param {string|null} text
 * @returns {Set<string>}
 */
export function manifestClasses(text) {
	/** @type {Set<string>} */
	const out = new Set();
	if (!text) return out;
	try {
		const parsed = JSON.parse(text);
		for (const f of parsed.families ?? []) {
			for (const c of f.classes ?? []) {
				if ((c.declarations?.length ?? 0) + (c.variants?.length ?? 0) > 0) out.add(c.name);
			}
		}
	} catch {
		return out;
	}
	return out;
}

export default {
	id: 'U04',
	name: 'Documentation Parity',
	criterion: 'Agent documentation of utilities',
	formula:
		'100 · (classes covered by llms-utilities.txt + classes in osui.utilities.json with declarations) / (2 · classes)',
	movable: true,
	present: {
		scope: 'Per utility family: the share of its classes covered by a row of llms-utilities.txt and present in osui.utilities.json (cell), with the missing ones.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the family can be read.',
		/** @param {any} row */
		cell(row) {
			const missing = row.missing?.length ? ` Missing: ${list(row.missing, 6)}. ${STALE_HINT}` : '';
			return {
				s: row.score,
				h: `${row.documented}/${row.total} in llms-utilities.txt, ${row.inManifest}/${row.total} in osui.utilities.json.${missing}`,
			};
		},
		/** @param {any} m */
		advice(m) {
			return [
				m.summary,
				m.score < 100 ? STALE_HINT : 'The docs cover every utility class; the CI freshness check keeps it so.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		const doc = ctx.docsAi('llms-utilities.txt') ?? '';
		const manifest = manifestClasses(ctx.docsAi('osui.utilities.json'));
		let total = 0;
		let covered = 0;
		for (const f of utilityFamilies(ctx)) {
			if (f.error) {
				unmeasured.push({ name: f.name, reason: `compile error: ${f.error.split('\n')[0]}` });
				continue;
			}
			const inDoc = docCoverage(doc, f.classes);
			const documented = f.classes.filter((c) => inDoc.get(c.name)).length;
			const inManifest = f.classes.filter((c) => manifest.has(c.name)).length;
			const missing = f.classes.filter((c) => !inDoc.get(c.name) || !manifest.has(c.name)).map((c) => c.name);
			total += 2 * f.classes.length;
			covered += documented + inManifest;
			perComponent.push({
				name: f.name,
				kind: 'utility',
				total: f.classes.length,
				documented,
				inManifest,
				missing,
				score: pct(documented + inManifest, 2 * f.classes.length),
			});
		}
		const stale = !doc || manifest.size === 0;
		return {
			score: round1(total ? (100 * covered) / total : 0),
			summary: stale
				? `llms-utilities.txt or osui.utilities.json is missing: ${STALE_HINT.replace(/^Run /, 'run ')}`
				: `${covered}/${total} class-document pairs covered across ${perComponent.length} families`,
			raw: { total, covered, docPresent: Boolean(doc), manifestClasses: manifest.size },
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable: [],
		};
	},
};
