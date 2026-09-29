// @ts-check
import fs from 'node:fs';
import path from 'node:path';

import { expectationsFor } from '../lib/expectations.mjs';
import { componentFacets, loadManifest } from '../lib/manifest.mjs';
import { band, mean, round1 } from '../lib/score.mjs';

export const T_MIN = 600;
export const T_MAX = 6000;
/** A manifest card only counts as an authoritative source when this complete (see E03). */
export const CARD_COMPLETENESS_GATE = 0.8;
/** Measured in this session on shadcn/ui `apps/v4/registry/new-york-v4/ui/*.tsx` (o200k_base). */
export const BENCHMARK = { name: 'shadcn/ui (10 components)', medianTokens: 912, meanTokens: 1325, minTokens: 173, maxTokens: 5564 };

/**
 * @param {{ tokens: number }} raw
 */
export function scoreComponent({ tokens }) {
	return band(tokens, T_MIN, T_MAX);
}

/**
 * `## <Name>` sections of llms-components.txt.
 * @param {string|null} text
 */
export function parseCards(text) {
	/** @type {Map<string, string>} */
	const cards = new Map();
	if (!text) return cards;
	for (const section of text.split(/^## /m).slice(1)) {
		const name = section.split('\n')[0].trim();
		cards.set(name, `## ${section}`);
	}
	return cards;
}

export default {
	id: 'E01',
	name: 'Context Token Cost',
	criterion: 'Token & Context Efficiency',
	formula: `100 · clamp((${T_MAX} − T) / ${T_MAX - T_MIN}) per pattern; T = min(tokens of API+Config+Enum+Interface files, tokens of a ≥80%-complete manifest card)`,
	movable: true,
	/** @param {import('../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const manifest = loadManifest(ctx);
		const cards = parseCards(ctx.docsAi('llms-components.txt'));
		let cardsUsed = 0;
		const perComponent = ctx.inventory.patterns.map((p) => {
			const contract = [p.apiFile, ...p.configFiles, ...p.enumFiles, ...p.interfaceFiles];
			const srcTokens = ctx.tokens.countFilesTokens(contract);
			let cardTokens = null;
			if (manifest && cards.has(p.name)) {
				const facets = componentFacets(manifest, p.name, expectationsFor(ctx, p));
				if (facets.score >= CARD_COMPLETENESS_GATE) cardTokens = ctx.tokens.countTokens(/** @type {string} */ (cards.get(p.name)));
			}
			const useCard = cardTokens !== null && cardTokens < srcTokens;
			if (useCard) cardsUsed++;
			const tokens = useCard ? /** @type {number} */ (cardTokens) : srcTokens;
			return {
				name: p.name,
				srcTokens,
				cardTokens,
				tokens,
				source: useCard ? 'manifest card' : 'source contract',
				files: contract.length,
				score: round1(scoreComponent({ tokens })),
			};
		});
		const dts = path.join(ctx.root, 'dist', 'ODC.OutSystemsUI.d.ts');
		const dtsTokens = fs.existsSync(dts) ? ctx.tokens.countFileTokens(dts) : null;
		const meanTokens = Math.round(mean(perComponent.map((c) => c.tokens)) ?? 0);
		const meanSrc = Math.round(mean(perComponent.map((c) => c.srcTokens)) ?? 0);
		const score = mean(perComponent.map((c) => c.score)) ?? 0;
		return {
			score,
			summary: `mean ${meanTokens.toLocaleString('en-US')} tok/pattern (${cardsUsed} via cards); benchmark median ${BENCHMARK.medianTokens}`,
			raw: {
				tokenizer: ctx.tokenizerName,
				meanTokens,
				meanSourceTokens: meanSrc,
				totalSourceTokens: perComponent.reduce((s, c) => s + c.srcTokens, 0),
				publicTypingsTokens: dtsTokens,
				cardsUsed,
				band: { best: T_MIN, worst: T_MAX },
				benchmark: BENCHMARK,
			},
			perComponent: [...perComponent].sort((a, b) => b.tokens - a.tokens),
			unmeasured: [],
		};
	},
};
