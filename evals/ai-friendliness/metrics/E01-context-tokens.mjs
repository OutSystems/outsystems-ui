// @ts-check
import fs from 'node:fs';

import { expectationsFor } from '../../lib/expectations.mjs';
import { componentFacets, loadManifest } from '../../lib/manifest.mjs';
import { insideDir } from '../../lib/paths.mjs';
import { band, mean, round1 } from '../../lib/score.mjs';
import { list } from '../../lib/present.mjs';
import { parseCards } from '../../lib/cards.mjs';

const T_MIN = 600;
const T_MAX = 6000;
/** A manifest card only counts as an authoritative source when this complete (see E03). */
const CARD_COMPLETENESS_GATE = 0.8;
/** Measured in this session on shadcn/ui `apps/v4/registry/new-york-v4/ui/*.tsx` (o200k_base). */
const BENCHMARK = {
	name: 'shadcn/ui (10 components)',
	medianTokens: 912,
	meanTokens: 1325,
	minTokens: 173,
	maxTokens: 5564,
};

/**
 * @param {{ tokens: number }} raw
 */
export function scoreComponent({ tokens }) {
	return band(tokens, T_MIN, T_MAX);
}

/** The next step for one pattern's E01 row. @param {any} row */
function nextStep(row) {
	if (row.source === 'manifest card')
		return row.score < 100 ? ' Trim the card: fewer or shorter prop descriptions.' : '';
	return row.cardTokens === null
		? ' The manifest card is below 80 % complete, so agents fall back to the source: complete its facets.'
		: '';
}

export default {
	id: 'E01',
	name: 'Context Token Cost',
	criterion: 'Token & Context Efficiency',
	formula: `100 · clamp((${T_MAX} − T) / ${T_MAX - T_MIN}) per pattern; T = min(tokens of API+Config+Enum+Interface files, tokens of a ≥80%-complete manifest card)`,
	movable: true,
	present: {
		scope: 'Per pattern: tokens an agent must read to use it (its manifest card when ≥ 80 % complete, else the API + config + enum + interface files). CSS-only components have no TypeScript contract.',
		heatmap: true,
		appliesTo: ['pattern'],
		/** @param {any} row */
		cell(row) {
			const via =
				row.source === 'manifest card'
					? `via its manifest card (${row.tokens} tokens; source contract ${row.srcTokens} across ${row.files} files)`
					: `from the source contract (${row.tokens} tokens across ${row.files} files)`;
			return { s: row.score, h: `Read ${via}.${nextStep(row)}` };
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			const src = Object.values(m.perComponent ?? {}).filter(
				(/** @type {any} */ r) => r.source !== 'manifest card'
			);
			return [
				`Mean ${raw.meanTokens} tokens per pattern via cards, against ${raw.meanSourceTokens} from source; benchmark median ${raw.benchmark?.median ?? BENCHMARK.medianTokens}.`,
				src.length
					? `${src.length} patterns still read from source (card below 80 % complete): ${list(src.map((/** @type {any} */ r) => r.name))}.`
					: 'Every pattern is served by its manifest card; keep cards complete so this holds.',
				`The compiled .d.ts is ${raw.publicTypingsTokens ? Math.round(raw.publicTypingsTokens / 1000) : '~51'}k tokens: agents must load a card, never the whole typing file.`,
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
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
				if (facets.score >= CARD_COMPLETENESS_GATE)
					cardTokens = ctx.tokens.countTokens(/** @type {string} */ (cards.get(p.name)));
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
		const dts = insideDir(ctx.root, 'dist', 'ODC.OutSystemsUI.d.ts');
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
