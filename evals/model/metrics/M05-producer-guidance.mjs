// @ts-check
/**
 * M05 · Producer-Scoped Guidance. The agent docs must tell an OML producer (the Model bridge) and a runtime
 * producer apart: a Producers section in llms.txt, runtime-only gotchas and card lines marked as such, and
 * a block-level document the index points at. Measured as literal markers the generator emits.
 */
import { parseCards } from '../../ai-friendliness/metrics/E01-context-tokens.mjs';
import { isMarked, isRuntimeOnlyLine, PRODUCERS_HEADING, RUNTIME_GOTCHA_NEEDLES } from '../../lib/producers.mjs';
import { round1 } from '../../lib/score.mjs';

/** @param {string|null} text */
const linesOf = (text) => (text ?? '').split('\n').map((l) => l.replace('\r', ''));

/**
 * Lines of one `## ` section (from its heading to the next `## `).
 * @param {string[]} lines
 * @param {string} heading start of the heading line
 */
export function sectionLines(lines, heading) {
	const start = lines.findIndex((l) => l.startsWith(heading));
	if (start === -1) return [];
	const out = [];
	for (let i = start + 1; i < lines.length && !lines[i].startsWith('## '); i++) out.push(lines[i]);
	return out;
}

/** 20 · marked/total, 20 when there is nothing to mark. @param {string[]} targets */
const prorated = (targets) =>
	targets.length === 0 ? 20 : round1((20 * targets.filter(isMarked).length) / targets.length);

/**
 * @param {{ index: string|null, components: string|null, patterns: string|null, blocks: string|null }} docs
 */
export function measureDocs({ index, components, patterns, blocks }) {
	if (index === null && components === null && patterns === null && blocks === null) {
		return { producers: 0, gotchas: 0, cards: 0, patterns: 0, blocksDoc: 0 };
	}
	const indexLines = linesOf(index);
	const producerSection = sectionLines(indexLines, PRODUCERS_HEADING).join('\n');
	const producers =
		producerSection.includes('llms-blocks.txt') && producerSection.includes('llms-components.txt') ? 20 : 0;
	const gotchaTargets = sectionLines(indexLines, '## Gotchas').filter((l) =>
		RUNTIME_GOTCHA_NEEDLES.some((n) => l.includes(n))
	);
	const cardTargets = [...parseCards(components).values()].flatMap((card) => linesOf(card).filter(isRuntimeOnlyLine));
	const patternTargets = linesOf(patterns).filter(isRuntimeOnlyLine);
	return {
		producers: index === null ? 0 : producers,
		gotchas: index === null ? 0 : prorated(gotchaTargets),
		cards: components === null ? 0 : prorated(cardTargets),
		patterns: patterns === null ? 0 : prorated(patternTargets),
		blocksDoc: blocks !== null && (index ?? '').includes('llms-blocks.txt') ? 20 : 0,
	};
}

/** @param {{ producers: number, gotchas: number, cards: number, patterns: number, blocksDoc: number }} c */
export function scoreGuidance(c) {
	return round1(c.producers + c.gotchas + c.cards + c.patterns + c.blocksDoc);
}

export default {
	id: 'M05',
	name: 'Producer-Scoped Guidance',
	criterion: 'Agent documentation that separates OML composition from the runtime contract',
	formula:
		"20·(llms.txt has a Producers section naming llms-blocks.txt and llms-components.txt) + 20·(runtime-only gotchas marked [runtime-only], prorated) + 20·(pattern cards' Lifecycle and Markup lines marked, prorated) + 20·(llms-patterns.txt skeleton lines marked, prorated) + 20·(llms-blocks.txt exists and the index points at it)",
	movable: true,
	present: {
		scope: 'Whole documentation set, not per component: whether an OML producer can tell from the docs what it must not emit.',
		heatmap: false,
		appliesTo: ['pattern', 'component', 'layout'],
		/** @param {any} m */
		advice(m) {
			const c = m.raw?.checks ?? {};
			const weak = Object.entries(c)
				.filter(([, v]) => Number(v) < 20)
				.map(([k, v]) => `${k} ${v}`);
			return [
				weak.length ? `Checks below 20: ${weak.join(', ')}.` : 'Every producer-scoping check passes.',
				'All five checks are produced by scripts/lib/ai-docs.mjs; run npm run docs:ai after changing it.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const checks = measureDocs({
			index: ctx.docsAi('llms.txt'),
			components: ctx.docsAi('llms-components.txt'),
			patterns: ctx.docsAi('llms-patterns.txt'),
			blocks: ctx.docsAi('llms-blocks.txt'),
		});
		return {
			score: scoreGuidance(checks),
			summary: Object.entries(checks)
				.map(([k, v]) => `${k} ${v}/20`)
				.join(', '),
			raw: { checks },
			perComponent: [],
			unmeasured: [],
			notApplicable: [],
		};
	},
};
