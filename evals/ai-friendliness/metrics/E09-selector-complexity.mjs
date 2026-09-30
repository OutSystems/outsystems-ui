// @ts-check
import { clamp01, mean, round1 } from '../../lib/score.mjs';
import { analyseSelectors } from '../../lib/scss.mjs';
import { componentScssFiles } from './E08-token-semantics.mjs';
import { list, r1, rowsOf, toDoHint } from '../../lib/present.mjs';

/**
 * @param {{ avgDepth: number, p90b: number }} raw
 */
export function scoreComponent({ avgDepth, p90b }) {
	return 100 * (0.6 * clamp01(1 - Math.max(0, avgDepth - 1) / 3) + 0.4 * clamp01(1 - Math.max(0, p90b - 2) / 4));
}

export default {
	id: 'E09',
	name: 'CSS Selector Complexity',
	criterion: 'Predictable Cascade · Anatomy',
	formula:
		'per component SCSS (compiled): 100 · (0.6·clamp(1 − max(0, mean combinators − 1)/3) + 0.4·clamp(1 − max(0, p90 class-specificity − 2)/4))',
	movable: false,
	present: {
		scope: 'Per component SCSS: mean combinators per selector and the p90 class specificity. Files with no rules have nothing to score.',
		heatmap: true,
		appliesTo: 'both',
		unmeasuredHint: 'Fix the SCSS compile error so the partial can be scored.',
		/** @param {any} row */
		cell(row) {
			const todo = [];
			if (row.avgDepth > 1) todo.push('flatten combinator chains into state classes on the styled element (B-6)');
			if (row.p90b > 2) todo.push(`lower class specificity (p90 ${row.p90b}, max depth ${row.maxDepth})`);
			return {
				s: row.score,
				h: `${row.selectors} selectors, mean ${r1(row.avgDepth)} combinators, p90 class specificity ${row.p90b}.${toDoHint(todo, ' Flat cascade.')}`,
			};
		},
		/** @param {any} m */
		advice(m) {
			const worst = rowsOf(m)
				.sort((a, b) => a.score - b.score)
				.slice(0, 6)
				.map((r) => `${r.name} (p90 ${r.p90b}, max ${r.maxDepth})`);
			return [
				m.summary,
				`Highest specificity: ${list(worst, 6)}. Flattening into state classes changes cascade order for existing overrides (B-6).`,
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
		/** @type {{ component: string, selector: string, depth: number, specificity: number[] }[]} */
		const worst = [];
		let selectorsTotal = 0;
		let rulesTotal = 0;
		for (const { name, file } of componentScssFiles(ctx)) {
			const { css, error } = ctx.compiledCss(file);
			if (!css) {
				unmeasured.push({
					name: `${name} (${ctx.rel(file)})`,
					reason: `compile error: ${(error ?? '').split('\n')[0]}`,
				});
				continue;
			}
			const r = analyseSelectors(css);
			if (r.selectors.length === 0) {
				notApplicable.push({
					name: `${name} (${ctx.rel(file)})`,
					reason: 'no rules',
					hint: 'Nothing to change: the partial compiles to no rules.',
				});
				continue;
			}
			selectorsTotal += r.selectors.length;
			rulesTotal += r.rules;
			for (const s of r.selectors) if (s.depth >= 3) worst.push({ component: name, ...s });
			perComponent.push({
				name,
				file: ctx.rel(file),
				selectors: r.selectors.length,
				avgDepth: r.avgDepth,
				maxDepth: r.maxDepth,
				p90b: r.p90b,
				score: round1(scoreComponent(r)),
			});
		}
		worst.sort((a, b) => b.depth - a.depth || b.specificity[1] - a.specificity[1]);
		return {
			score: mean(perComponent.map((c) => c.score)) ?? 0,
			summary: `${selectorsTotal} selectors in ${perComponent.length} files; mean depth ${round1(mean(perComponent.map((c) => c.avgDepth)) ?? 0)}, ${worst.length} selectors with ≥3 combinators`,
			raw: {
				files: perComponent.length,
				rules: rulesTotal,
				selectors: selectorsTotal,
				meanAvgDepth: round1(mean(perComponent.map((c) => c.avgDepth)) ?? 0),
				maxDepth: Math.max(0, ...perComponent.map((c) => c.maxDepth)),
				deepSelectors: worst.length,
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable,
			details: { deepestSelectors: worst.slice(0, 50) },
		};
	},
};
