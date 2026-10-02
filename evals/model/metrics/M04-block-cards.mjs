// @ts-check
/**
 * M04 · Block Card Cost and Recipes. What an OML agent reads to place one block: its card in
 * docs-ai/llms-blocks.txt, within a 250-token budget, with a recipe in OpenUI and in TSX.
 */
import { parseCards } from '../../ai-friendliness/metrics/E01-context-tokens.mjs';
import { list } from '../../lib/present.mjs';
import { band, mean, round1 } from '../../lib/score.mjs';
import { blockTable } from '../lib/manifest.mjs';
import { flattenBlocks, NO_SNAPSHOT } from '../lib/snapshot.mjs';

export const CARD_BUDGET_BLOCK = 250;
export const CARD_WORST = 600;

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/** @param {{ tokens: number|null, openui: boolean, tsx: boolean }} r */
export function scoreCard({ tokens, openui, tsx }) {
	if (tokens === null) return 0;
	const recipes = (openui ? 1 : 0) + (tsx ? 1 : 0);
	return round1(0.7 * band(tokens, CARD_BUDGET_BLOCK, CARD_WORST) + 30 * (recipes / 2));
}

/** @param {string} card */
export function recipesOf(card) {
	const lines = card.split('\n').map((l) => l.trim());
	return { openui: lines.some((l) => l.startsWith('OpenUI:')), tsx: lines.some((l) => l.startsWith('TSX:')) };
}

/** @param {any} row */
function hintOf(row) {
	if (row.tokens === null) return 'No card in llms-blocks.txt: run npm run docs:ai.';
	const todo = [];
	if (row.tokens > CARD_BUDGET_BLOCK) {
		todo.push(
			`trim the card (${row.tokens} tokens, budget ${CARD_BUDGET_BLOCK}): shorter descriptions, fewer listed values`
		);
	}
	if (!row.openui) todo.push('add the OpenUI recipe');
	if (!row.tsx) todo.push('add the TSX recipe');
	return todo.length ? `${todo.join('; ')}.` : `${row.tokens} tokens, both recipes present.`;
}

export default {
	id: 'M04',
	name: 'Block Card Cost and Recipes',
	criterion: 'Token budget of the block-level agent docs',
	formula: `per public block: 70·band(card tokens, ${CARD_BUDGET_BLOCK}, ${CARD_WORST}) + 30·(OpenUI and TSX recipe lines present)/2; a block without a card scores 0; mean over blocks`,
	movable: true,
	present: {
		scope: 'Per OML block, in its own table: the o200k tokens of its card in llms-blocks.txt against the 250-token budget, and whether both dialect recipes are present.',
		heatmap: false,
		appliesTo: ['pattern'],
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			const over = (m.perComponent ?? [])
				.filter((/** @type {any} */ r) => r.tokens !== null && r.tokens > CARD_BUDGET_BLOCK)
				.map((/** @type {any} */ r) => `${r.label} ${r.tokens}`);
			return [
				`${raw.withCard}/${raw.blocks} blocks have a card; mean ${raw.meanTokens ?? '–'} tokens; ${raw.withBothRecipes} with both recipes.`,
				over.length ? `Over budget: ${list(over, 6)}.` : 'Every card is within the 250-token budget.',
			];
		},
		/** @param {any} m */
		extra(m) {
			const rows = (m.perComponent ?? []).map((/** @type {any} */ r) => ({
				label: r.label,
				score: r.score,
				hint: hintOf(r),
			}));
			return { blocksM04: blockTable('M04 · card cost per block', rows) };
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const snapshots = ctx.modelSnapshots();
		const rows = flattenBlocks(snapshots);
		const cards = parseCards(ctx.docsAi('llms-blocks.txt'));
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const notApplicable = [];
		for (const b of rows) {
			if (!b.public) {
				notApplicable.push({ name: b.label, reason: 'not public in the module' });
				continue;
			}
			const card = cards.get(b.label) ?? null;
			const tokens = card === null ? null : ctx.tokens.countTokens(card);
			const recipes = card === null ? { openui: false, tsx: false } : recipesOf(card);
			perComponent.push({
				name: b.label,
				label: b.label,
				key: b.key,
				tokens,
				...recipes,
				score: scoreCard({ tokens, ...recipes }),
			});
		}
		const withCard = perComponent.filter((r) => r.tokens !== null);
		const tokenMean = mean(withCard.map((r) => /** @type {number} */ (r.tokens)));
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary:
				snapshots.length === 0
					? NO_SNAPSHOT
					: `${withCard.length}/${perComponent.length} blocks with a card; mean ${tokenMean === null ? '–' : Math.round(tokenMean)} tokens`,
			raw: {
				blocks: perComponent.length,
				withCard: withCard.length,
				meanTokens: tokenMean === null ? null : Math.round(tokenMean),
				withBothRecipes: perComponent.filter((r) => r.openui && r.tsx).length,
				budget: CARD_BUDGET_BLOCK,
			},
			perComponent: perComponent.sort((a, b) => a.score - b.score || byCodePoint(a.label, b.label)),
			unmeasured: [],
			notApplicable,
		};
	},
};
