// @ts-check
import { measureStory } from '../../lib/markup.mjs';
import { mean, penalty, round1 } from '../../lib/score.mjs';
import { list, rowsOf } from '../../lib/present.mjs';

const FREE_DEPTH = 3;
const FREE_ELEMENTS = 6;

/**
 * @param {{ depth: number, elements: number }} raw
 */
export function scoreComponent({ depth, elements }) {
	return penalty([20 * Math.max(0, depth - FREE_DEPTH), 4 * Math.max(0, elements - FREE_ELEMENTS)]);
}

/** The kinds this eval measures (lib/kinds.mjs). */
const APPLIES_TO = ['pattern', 'component'];

export default {
	id: 'E07',
	name: 'Markup Contract Depth',
	criterion: 'Anatomy & Composition',
	formula: `100 − 20·max(0, depth − ${FREE_DEPTH}) − 4·max(0, distinct elements − ${FREE_ELEMENTS}); measured on the deepest HTML template of the component's story; distinct = unique tag+classes signatures (repeated items count once)`,
	movable: false,
	present: {
		scope: 'Per component: depth and distinct parts of the deepest HTML template in its Storybook story. Components without a story cannot be measured; host-styled components have no markup contract of their own.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Add a Storybook story with an HTML template so the markup contract can be measured.',
		/** @param {any} row */
		cell(row) {
			const over = [];
			if (row.depth > FREE_DEPTH)
				over.push(`${row.depth - FREE_DEPTH} levels over the free depth of ${FREE_DEPTH}`);
			if (row.elements > FREE_ELEMENTS)
				over.push(`${row.elements - FREE_ELEMENTS} parts over the free ${FREE_ELEMENTS}`);
			const overHint = over.length
				? ` ${over.join('; ')}. Flattening needs a DOM-contract change (B-5).`
				: ' Within the allowance.';
			return {
				s: row.score,
				h: `Story markup: depth ${row.depth}, ${row.elements} distinct parts, ${row.classes} classes.${overHint}`,
			};
		},
		/** @param {any} m */
		advice(m) {
			const deep = rowsOf(m)
				.filter((r) => r.score < 60)
				.sort((a, b) => a.score - b.score)
				.map((r) => `${r.name} (depth ${r.depth}, ${r.elements} parts)`);
			return [
				`${m.unmeasured?.length ?? 0} components have no story: add one HTML template each to measure them.`,
				deep.length
					? `Deepest contracts: ${list(deep, 6)}. Flattening them is a DOM-contract change (B-5).`
					: 'No component below 60.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {{ name: string, kind: string, story: string|null }[]} */
		const components = [
			...ctx.inventory.patterns.map((p) => ({ name: p.name, kind: 'pattern', story: p.storyFile, host: null })),
			...ctx.inventory.cssComponents
				.filter((c) => APPLIES_TO.includes(c.kind))
				.map((c) => ({ name: c.name, kind: c.kind, story: c.storyFile, host: c.host })),
		];
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		/** @type {{ name: string, reason: string }[]} */
		const notApplicable = [];
		/** @type {Map<string, ReturnType<typeof measureStory>>} */
		const measured = new Map();
		for (const c of components) {
			if (c.host) {
				// styles markup owned by something else: an agent never emits it, so there is no contract to measure
				notApplicable.push({
					name: c.name,
					reason: `host-styled: markup emitted by ${c.host.host}`,
					hint: 'Style it through its --osui-* knobs; the markup is not yours to emit.',
				});
				continue;
			}
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
			summary: `${perComponent.length} components measured; mean depth ${round1(mean(perComponent.map((c) => c.depth)) ?? 0)}, max ${Math.max(0, ...perComponent.map((c) => c.depth))}; ${unmeasured.length} without story; ${notApplicable.length} host-styled (not applicable)`,
			raw: {
				measured: perComponent.length,
				hostStyled: notApplicable.length,
				meanDepth: round1(mean(perComponent.map((c) => c.depth)) ?? 0),
				maxDepth: Math.max(0, ...perComponent.map((c) => c.depth)),
				meanElements: round1(mean(perComponent.map((c) => c.elements)) ?? 0),
				benchmark: 'shadcn Accordion usage: depth 3, 4 elements → 100',
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable,
		};
	},
};
