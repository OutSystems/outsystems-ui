// @ts-check
/**
 * U06 · Responsive coverage.
 *
 * Tailwind's `md:` prefix applies to every utility; here responsiveness comes from the body classes the
 * runtime sets (`phone`, `tablet`, `desktop`) and only two helpers use them. Measured over the families
 * where a viewport variant is meaningful (layout and text, not colour or hooks). Roadmap: generating
 * `phone-`/`tablet-` variants is a product decision (U-P5), not a refactor.
 */
import { pct } from '../../lib/present.mjs';
import { isResponsive, RESPONSIVE_FAMILIES, utilityFamilies } from '../../lib/utilities.mjs';

const APPLIES_TO = ['utility'];

export default {
	id: 'U06',
	name: 'Responsive Coverage',
	criterion: 'Viewport variants',
	formula: '100 · layout and text families with a phone/tablet/desktop variant / such families',
	movable: false,
	cls: 'roadmap',
	present: {
		scope: 'Per layout or text family: whether any class has a viewport variant (a .phone/.tablet/.desktop context or prefix). Colour, shadow, image and hook families are not applicable.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the family can be read.',
		/** @param {any} row */
		cell(row) {
			return {
				s: row.score,
				h: row.responsive
					? `Viewport variants: ${row.variants.join(', ')}.`
					: 'No viewport variant; responsiveness needs a .phone/.tablet rule written by the consumer.',
			};
		},
		/** @param {any} m */
		advice(m) {
			return [
				m.summary,
				'Variants generated from the same token maps (`.phone .phone-margin-top-none`) are new selectors only, about 15 KB for spacing, display and flex; owners decide the prefix set and the families (U-P5).',
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
		for (const f of utilityFamilies(ctx)) {
			if (f.error) {
				unmeasured.push({ name: f.name, reason: `compile error: ${f.error.split('\n')[0]}` });
				continue;
			}
			if (!RESPONSIVE_FAMILIES.has(f.name)) {
				notApplicable.push({
					name: f.name,
					reason: 'no viewport variant expected',
					hint: 'Colours, shadows, images and hooks look the same on every viewport.',
				});
				continue;
			}
			const variants = f.classes.filter((c) => isResponsive(c)).map((c) => c.name);
			perComponent.push({
				name: f.name,
				kind: 'utility',
				responsive: variants.length > 0,
				variants,
				score: variants.length ? 100 : 0,
			});
		}
		const covered = perComponent.filter((r) => r.responsive).length;
		return {
			score: pct(covered, perComponent.length),
			summary: `${covered}/${perComponent.length} layout and text families offer a viewport variant`,
			raw: { expected: perComponent.length, covered },
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable,
		};
	},
};
