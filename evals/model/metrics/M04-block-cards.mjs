// @ts-check
/**
 * M04 · Block Card Cost and Recipes. What an OML agent reads to place one block: its card in
 * docs-ai/llms-blocks.txt, within a 250-token budget, with a recipe in OpenUI and in TSX.
 */
import { parseCards } from '../../lib/cards.mjs';
import { list } from '../../lib/present.mjs';
import { band, mean, round1 } from '../../lib/score.mjs';
import { blockTable } from '../lib/manifest.mjs';
import { flattenBlocks, isComposable, NO_SNAPSHOT, notComposableReason } from '../lib/snapshot.mjs';

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

/** The card's overrun and absent recipes, or "nothing". @param {any} row */
export function missingOf(row) {
	if (row.tokens === null) return 'card in llms-blocks.txt';
	const parts = [];
	if (row.tokens > CARD_BUDGET_BLOCK) {
		parts.push(`${row.tokens} tokens (${row.tokens - CARD_BUDGET_BLOCK} over ${CARD_BUDGET_BLOCK})`);
	}
	if (!row.openui) parts.push('no OpenUI recipe');
	if (!row.tsx) parts.push('no TSX recipe');
	return parts.length ? parts.join(', ') : 'nothing';
}

/** The fix: trim the card, regenerate, or both. @param {any} row */
export function doOf(row) {
	if (row.tokens === null) return 'npm run docs:ai';
	const todo = [];
	if (row.tokens > CARD_BUDGET_BLOCK) todo.push('trim the card (shorter descriptions, fewer listed values)');
	if (!row.openui || !row.tsx) todo.push('regenerate: npm run docs:ai');
	return todo.join('; ');
}

/** The heatmap cell text of one block. @param {any} row */
function cellText(row) {
	const missing = missingOf(row);
	const todo = doOf(row);
	return [missing === 'nothing' ? 'complete' : `Missing: ${missing}.`, todo ? `Do: ${todo}.` : '']
		.filter(Boolean)
		.join(' ');
}

const LEAD = `100 = a card within ${CARD_BUDGET_BLOCK} tokens with both recipes.`;

export default {
	id: 'M04',
	name: 'Block Card Cost and Recipes',
	criterion: 'Token budget of the block-level agent docs',
	formula: `per public block: 70·band(card tokens, ${CARD_BUDGET_BLOCK}, ${CARD_WORST}) + 30·(OpenUI and TSX recipe lines present)/2; a block without a card scores 0; mean over blocks`,
	movable: true,
	present: {
		scope: 'Per composable OML block: the o200k tokens of its card in llms-blocks.txt against the 250-token budget, and whether both dialect recipes are present.',
		heatmap: true,
		appliesTo: ['block'],
		/** @param {any} row */
		cell(row) {
			return { s: row.score, h: cellText(row) };
		},
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
				missing: missingOf(r),
				do: doOf(r),
			}));
			return { blocksM04: blockTable('M04 · card cost per block', LEAD, rows) };
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
			if (!isComposable(b)) {
				notApplicable.push({ name: b.label, reason: notComposableReason(b) });
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
		const meanTokens = tokenMean === null ? null : Math.round(tokenMean);
		perComponent.sort((a, b) => a.score - b.score || byCodePoint(a.label, b.label));
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary:
				snapshots.length === 0
					? NO_SNAPSHOT
					: `${withCard.length}/${perComponent.length} blocks with a card; mean ${meanTokens ?? '–'} tokens`,
			raw: {
				blocks: perComponent.length,
				withCard: withCard.length,
				meanTokens,
				withBothRecipes: perComponent.filter((r) => r.openui && r.tsx).length,
				budget: CARD_BUDGET_BLOCK,
			},
			perComponent,
			unmeasured: [],
			notApplicable,
		};
	},
};
