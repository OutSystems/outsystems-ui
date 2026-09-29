// @ts-check
import { clamp01, mean, round1 } from '../lib/score.mjs';
import { analyseDeclarations } from '../lib/scss.mjs';

/**
 * @param {{ total: number, literal: number, routed: number, important: number }} raw
 * @returns {number|null}
 */
export function scoreComponent({ total, literal, routed, important }) {
	if (total === 0) return null;
	return 100 * (0.55 * (1 - literal / total) + 0.3 * (routed / total) + 0.15 * clamp01(1 - important / (0.02 * total)));
}

/**
 * Component SCSS files: every pattern partial plus the CSS-only components.
 * @param {import('../lib/context.mjs').EvalContext} ctx
 */
export function componentScssFiles(ctx) {
	/** @type {{ name: string, file: string }[]} */
	const files = [];
	for (const p of ctx.inventory.patterns) for (const f of p.scssFiles) files.push({ name: p.name, file: f });
	for (const c of ctx.inventory.cssComponents) files.push({ name: c.name, file: c.scssFile });
	return files;
}

export default {
	id: 'E08',
	name: 'Design Token Semantics',
	criterion: 'Semantic Design Tokens · Theming',
	formula:
		'per component SCSS (compiled): 100 · (0.55·(1 − hardcoded/themeable) + 0.30·(reads via --osui-* API/themeable) + 0.15·clamp(1 − !important/(2% of themeable)))',
	movable: true,
	/** @param {import('../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		/** @type {{ component: string, selector: string, prop: string, value: string }[]} */
		const literals = [];
		let totals = { total: 0, literal: 0, routed: 0, tokened: 0, important: 0, knobs: 0 };
		for (const { name, file } of componentScssFiles(ctx)) {
			const { css, error } = ctx.compiledCss(file);
			if (!css) {
				unmeasured.push({ name: `${name} (${ctx.rel(file)})`, reason: `compile error: ${(error ?? '').split('\n')[0]}` });
				continue;
			}
			const d = analyseDeclarations(css);
			if (d.total === 0) {
				unmeasured.push({ name: `${name} (${ctx.rel(file)})`, reason: 'no themeable declarations' });
				continue;
			}
			for (const k of Object.keys(totals)) totals[k] += d[k];
			for (const s of d.samples) literals.push({ component: name, ...s });
			perComponent.push({
				name,
				file: ctx.rel(file),
				total: d.total,
				literal: d.literal,
				routed: d.routed,
				tokened: d.tokened,
				important: d.important,
				knobs: d.knobs,
				score: round1(/** @type {number} */ (scoreComponent(d))),
			});
		}
		return {
			score: mean(perComponent.map((c) => c.score)) ?? 0,
			summary: `${totals.literal}/${totals.total} themeable declarations hardcoded (${round1((100 * totals.literal) / Math.max(1, totals.total))}%), ${round1((100 * totals.routed) / Math.max(1, totals.total))}% via --osui-*, ${totals.important} !important, ${totals.knobs} knobs`,
			raw: {
				files: perComponent.length,
				...totals,
				literalRatio: round1(totals.literal / Math.max(1, totals.total)),
				routedRatio: round1(totals.routed / Math.max(1, totals.total)),
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			details: { hardcodedSamples: literals.slice(0, 200) },
		};
	},
};
