// @ts-check
/**
 * U02 · Scale completeness.
 *
 * Tailwind is predictable because every scalable property offers the whole scale. Here spacing has all
 * eight steps, gaps lack `none`, font sizes stop at `base`, shadows skip `base` and `xxl`. Measured per
 * scalable property; border radius keeps its shape vocabulary (ADR-0010) and is not applicable.
 */
import { list } from '../../lib/present.mjs';
import { mean, round1 } from '../../lib/score.mjs';
import { SCALED, STEPS, utilityFamilies } from '../../lib/utilities.mjs';

const APPLIES_TO = ['utility'];
export const NO_SCALE_HINT =
	'Only spacing, gaps, font sizes, shadows and border sizes follow the none … xxl scale; border-radius keeps its shape vocabulary (ADR-0010), colours their shades.';

/**
 * Steps present and missing for one property head.
 * @param {string[]} names class names of the family
 * @param {string} head
 */
export function scaleCoverage(names, head) {
	const present = STEPS.filter((s) => names.includes(`${head}-${s}`));
	return { present: [...present], missing: STEPS.filter((s) => !present.includes(s)) };
}

export default {
	id: 'U02',
	name: 'Scale Completeness',
	criterion: 'Predictable value scale',
	formula:
		'per scalable property: 100 · steps present / 8 (none xs s base m l xl xxl); family = mean over its properties; mean over families',
	movable: true,
	present: {
		scope: 'Per family with a scalable property: how many of the eight steps each property offers (cell = mean over its properties), with the missing steps.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the family can be read.',
		/** @param {any} row */
		cell(row) {
			const gaps = Object.entries(row.properties ?? {})
				.filter(([, p]) => /** @type {any} */ (p).missing.length)
				.map(([head, p]) => `${head} lacks ${/** @type {any} */ (p).missing.join(' ')}`);
			return {
				s: row.score,
				h: gaps.length ? `${gaps.join('; ')}.` : 'Every scalable property offers all eight steps.',
			};
		},
		/** @param {any} m */
		advice(m) {
			const gaps = /** @type {string[]} */ (m.raw?.gaps ?? []);
			return [
				m.summary,
				gaps.length
					? `Fill the gaps where a token exists (${list(gaps, 6)}): new selectors only, generated from the same token maps (U-P4, owners decide).`
					: 'Every scale is complete.',
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
		/** @type {string[]} */
		const gaps = [];
		for (const f of utilityFamilies(ctx)) {
			if (f.error) {
				unmeasured.push({ name: f.name, reason: `compile error: ${f.error.split('\n')[0]}` });
				continue;
			}
			const heads = SCALED[f.name];
			if (!heads) {
				notApplicable.push({ name: f.name, reason: 'no size scale', hint: NO_SCALE_HINT });
				continue;
			}
			const names = f.classes.map((c) => c.name);
			/** @type {Record<string, { present: string[], missing: string[] }>} */
			const properties = {};
			for (const head of heads) {
				properties[head] = scaleCoverage(names, head);
				for (const s of properties[head].missing) gaps.push(`${head}-${s}`);
			}
			const score = round1(
				/** @type {number} */ (
					mean(Object.values(properties).map((p) => (100 * p.present.length) / STEPS.length))
				)
			);
			perComponent.push({ name: f.name, kind: 'utility', properties, score });
		}
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary: `${Object.values(SCALED).flat().length} scalable properties in ${perComponent.length} families; ${gaps.length} missing steps`,
			raw: { properties: Object.values(SCALED).flat().length, gaps },
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable,
		};
	},
};
