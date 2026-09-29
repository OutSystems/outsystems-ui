// @ts-check
import { measureStory } from '../lib/markup.mjs';
import { mean, penalty, round1 } from '../lib/score.mjs';

export const FREE_DEPTH = 3;
export const FREE_ELEMENTS = 6;

/**
 * @param {{ depth: number, elements: number }} raw
 */
export function scoreComponent({ depth, elements }) {
	return penalty([20 * Math.max(0, depth - FREE_DEPTH), 4 * Math.max(0, elements - FREE_ELEMENTS)]);
}

export default {
	id: 'E07',
	name: 'Markup Contract Depth',
	criterion: 'Anatomy & Composition',
	formula: `100 − 20·max(0, depth − ${FREE_DEPTH}) − 4·max(0, distinct elements − ${FREE_ELEMENTS}); measured on the deepest HTML template of the component's story; distinct = unique tag+classes signatures (repeated items count once)`,
	movable: false,
	/** @param {import('../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {{ name: string, kind: string, story: string|null }[]} */
		const components = [
			...ctx.inventory.patterns.map((p) => ({ name: p.name, kind: 'pattern', story: p.storyFile })),
			...ctx.inventory.cssComponents.map((c) => ({ name: c.name, kind: 'css', story: c.storyFile })),
		];
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		/** @type {Map<string, ReturnType<typeof measureStory>>} */
		const measured = new Map();
		for (const c of components) {
			if (!c.story) {
				unmeasured.push({ name: c.name, reason: 'no story' });
				continue;
			}
			let m = measured.get(c.story);
			if (!m) {
				m = measureStory(ctx.readText(c.story));
				measured.set(c.story, m);
			}
			if (m.templates === 0) {
				unmeasured.push({ name: c.name, reason: 'story has no HTML templates' });
				continue;
			}
			perComponent.push({
				name: c.name,
				kind: c.kind,
				story: ctx.rel(c.story),
				depth: m.depth,
				elements: m.distinctElements,
				rawElements: m.elements,
				classes: m.classes.length,
				score: round1(scoreComponent({ depth: m.depth, elements: m.distinctElements })),
			});
		}
		return {
			score: mean(perComponent.map((c) => c.score)) ?? 0,
			summary: `${perComponent.length} components measured; mean depth ${round1(mean(perComponent.map((c) => c.depth)) ?? 0)}, max ${Math.max(0, ...perComponent.map((c) => c.depth))}; ${unmeasured.length} without story`,
			raw: {
				measured: perComponent.length,
				meanDepth: round1(mean(perComponent.map((c) => c.depth)) ?? 0),
				maxDepth: Math.max(0, ...perComponent.map((c) => c.depth)),
				meanElements: round1(mean(perComponent.map((c) => c.elements)) ?? 0),
				benchmark: 'shadcn Accordion usage: depth 3, 4 elements → 100',
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
		};
	},
};
