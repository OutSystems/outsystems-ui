// @ts-check
/**
 * U01 · Naming grammar conformance.
 *
 * An agent that has learned `<property>[-<side>][-<value>]` can derive every class it needs; every name
 * outside the grammar (`bold`, `hidden`, `full-width`, `top-left`) is one more fact to memorise. Hook
 * families (accessibility and runtime hooks) are behavioural, not style utilities: not applicable.
 */
import { list, pct } from '../../lib/present.mjs';
import { round1 } from '../../lib/score.mjs';
import { classifyName, HOOK_FAMILIES, utilityFamilies } from '../../lib/utilities.mjs';

const APPLIES_TO = ['utility'];
export const HOOK_REASON = 'behavioural or runtime hooks, not style utilities';
export const HOOK_HINT =
	'Nothing to rename: these classes mark behaviour (skip links, hidden text, viewport helpers), not a style.';

export default {
	id: 'U01',
	name: 'Naming Grammar',
	criterion: 'Predictable class names',
	formula:
		'100 · classes named <property>[-<side>][-<value>] / classes of the style families (hook families excluded)',
	movable: true,
	present: {
		scope: 'Per utility family: the share of its classes that follow the grammar (cell), with the names outside it.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the family can be read.',
		/** @param {any} row */
		cell(row) {
			const legacy = row.legacy?.length ? ` Outside the grammar: ${list(row.legacy, 6)}.` : '';
			return {
				s: row.score,
				h: `${row.conformant}/${row.total} names follow <property>[-<side>][-<value>].${legacy}`,
			};
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			return [
				m.summary,
				raw.legacy?.length
					? `Add a grammar-form alias for each legacy name (${list(raw.legacy, 8)}) and keep the old name; the docs mark the alias as canonical (U-P3, owners decide the names).`
					: 'Every style utility follows the grammar.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		/** @type {{ name: string, reason: string, hint: string }[]} */
		const notApplicable = [];
		let total = 0;
		let conformant = 0;
		/** @type {string[]} */
		const legacyAll = [];
		for (const f of utilityFamilies(ctx)) {
			if (f.error) {
				unmeasured.push({ name: f.name, reason: `compile error: ${f.error.split('\n')[0]}` });
				continue;
			}
			if (HOOK_FAMILIES.has(f.name)) {
				notApplicable.push({ name: f.name, reason: HOOK_REASON, hint: HOOK_HINT });
				continue;
			}
			const legacy = f.classes.filter((c) => !classifyName(c.name).conformant).map((c) => c.name);
			total += f.classes.length;
			conformant += f.classes.length - legacy.length;
			legacyAll.push(...legacy);
			perComponent.push({
				name: f.name,
				kind: 'utility',
				total: f.classes.length,
				conformant: f.classes.length - legacy.length,
				legacy,
				score: pct(f.classes.length - legacy.length, f.classes.length),
			});
		}
		return {
			score: round1(total ? (100 * conformant) / total : 0),
			summary: `${conformant}/${total} utility class names follow the grammar; ${legacyAll.length} legacy names in ${perComponent.filter((r) => r.legacy.length).length} families`,
			raw: { total, conformant, legacy: legacyAll },
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable,
		};
	},
};
