// @ts-check
/**
 * U03 · Token routing.
 *
 * A utility whose value reads a design token follows the theme (dark mode, a customer's token
 * overrides); a literal does not. Measured over themeable declarations (colour, spacing, radius,
 * shadow, type size) of every class, plain and variant rules alike.
 */
import { list, pct } from '../../lib/present.mjs';
import { isLiteralValue, isThemeableProp } from '../../lib/scss.mjs';
import { round1 } from '../../lib/score.mjs';
import { utilityFamilies } from '../../lib/utilities.mjs';

const APPLIES_TO = ['utility'];

/** @param {import('../../lib/utilities.mjs').UtilityClass} c */
function themeableDeclarations(c) {
	return [...c.declarations, ...c.variants.flatMap((v) => v.declarations)].filter((d) =>
		isThemeableProp(d.prop.toLowerCase())
	);
}

export default {
	id: 'U03',
	name: 'Token Routing',
	criterion: 'Theme-following values',
	formula:
		'100 · (1 − themeable utility declarations with a raw colour or non-zero size / themeable utility declarations); var(--…), 0, auto and keywords count as routed',
	movable: true,
	present: {
		scope: 'Per utility family: the share of its colour, spacing, radius, shadow and type-size declarations that read a token (cell), with the literals left.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the family can be read.',
		/** @param {any} row */
		cell(row) {
			const literals = row.literals?.length ? ` Literals: ${list(row.literals, 4)}.` : '';
			return { s: row.score, h: `${row.routed}/${row.total} themeable declarations read a token.${literals}` };
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			return [
				m.summary,
				raw.literal
					? 'Route the literals through the token that already holds the value (`$token-*` in the partial); the compiled output keeps the literal as the fallback, so nothing moves.'
					: 'Every themeable utility declaration reads a token.',
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
		let routed = 0;
		for (const f of utilityFamilies(ctx)) {
			if (f.error) {
				unmeasured.push({ name: f.name, reason: `compile error: ${f.error.split('\n')[0]}` });
				continue;
			}
			const decls = f.classes.flatMap((c) => themeableDeclarations(c).map((d) => ({ cls: c.name, ...d })));
			if (decls.length === 0) {
				notApplicable.push({
					name: f.name,
					reason: 'no themeable declarations',
					hint: 'Nothing to route: the family sets display, position, overflow or text behaviour, not a themed value.',
				});
				continue;
			}
			// `0`, `auto`, `none` and `transparent` need no token; a raw colour or a non-zero size does
			const literals = decls.filter((d) => !d.value.includes('var(') && isLiteralValue(d.value));
			total += decls.length;
			routed += decls.length - literals.length;
			perComponent.push({
				name: f.name,
				kind: 'utility',
				total: decls.length,
				routed: decls.length - literals.length,
				literals: literals.map((d) => `${d.cls} ${d.prop}: ${d.value}`),
				score: pct(decls.length - literals.length, decls.length),
			});
		}
		return {
			score: round1(total ? (100 * routed) / total : 0),
			summary: `${routed}/${total} themeable utility declarations read a token (${total - routed} literals)`,
			raw: { total, routed, literal: total - routed },
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable,
		};
	},
};
