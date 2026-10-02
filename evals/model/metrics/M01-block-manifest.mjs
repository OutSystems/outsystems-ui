// @ts-check
/**
 * M01 · Block Manifest Completeness. For every public block of the snapshot, how complete its entry in
 * docs-ai/osui.blocks.json is: typed and described parameters with defaults when optional, described
 * placeholders, events with payload descriptions, both recipes, and a pattern link (or an honest null when no
 * hint names one).
 */
import { list } from '../../lib/present.mjs';
import { mean, round1 } from '../../lib/score.mjs';
import { blockTable, loadBlocksManifest } from '../lib/manifest.mjs';
import { composableBlocks, flattenBlocks, isComposable, NO_SNAPSHOT, notComposableReason } from '../lib/snapshot.mjs';

const FACETS = ['params', 'placeholders', 'events', 'recipes', 'pattern'];

/** @param {number} hit @param {number} total */
const ratio = (hit, total) => (total === 0 ? null : hit / total);
/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/** @param {any} p */
const paramComplete = (p) =>
	Boolean(p.type) && Boolean(p.description) && (p.mandatory || (p.default !== null && p.default !== undefined));
/** @param {any} e */
const eventComplete = (e) =>
	Boolean(e.description) && (e.parameters ?? []).every((/** @type {any} */ p) => Boolean(p.description));

/**
 * @param {import('../lib/snapshot.mjs').BlockRow} block
 * @param {any} entry the manifest entry, or undefined when the manifest has none
 */
export function scoreBlockFacets(block, entry) {
	if (!entry) return { score: 0, facets: Object.fromEntries(FACETS.map((f) => [f, 0])), counts: {} };
	const recipes = [entry.recipes?.openui, entry.recipes?.tsx].filter(Boolean).length;
	/** @type {Record<string, number|null>} */
	const paramsDone = (entry.params ?? []).filter(paramComplete).length;
	const placeholdersDone = (entry.placeholders ?? []).filter((/** @type {any} */ p) => Boolean(p.description)).length;
	const eventsDone = (entry.events ?? []).filter(eventComplete).length;
	/** @type {Record<string, number|null>} */
	const facets = {
		params: ratio(paramsDone, block.inputParameters.length),
		placeholders: ratio(placeholdersDone, block.placeholders.length),
		events: ratio(eventsDone, block.events.length),
		recipes: recipes / 2,
		pattern: entry.pattern !== null || (entry.hints ?? []).length === 0 ? 1 : 0,
	};
	/** @type {Record<string, [number, number]>} */
	const counts = {
		params: [paramsDone, block.inputParameters.length],
		placeholders: [placeholdersDone, block.placeholders.length],
		events: [eventsDone, block.events.length],
	};
	const values = Object.values(facets)
		.filter((v) => v !== null)
		.map((v) => /** @type {number} */ (v));
	const rounded = Object.fromEntries(
		Object.entries(facets).map(([k, v]) => [k, v === null ? null : round1(v * 100)])
	);
	return { score: round1((mean(values) ?? 0) * 100), facets: rounded, counts };
}

/** @param {{ blockScores: number[], entries: number, blocks: number }} raw */
export function scoreEval({ blockScores, entries, blocks }) {
	if (blocks === 0) return 0;
	return round1((mean(blockScores) ?? 0) * (entries / blocks));
}

const FACET_DO = {
	params: 'OML: describe and default the parameters',
	placeholders: 'OML: describe the placeholders',
	events: 'OML: describe the events and their payloads',
	recipes: 'npm run docs:ai (recipes come from the generator)',
};

/** The facets of a block's row that are under 100, in facet order. @param {any} row */
function weakFacets(row) {
	return Object.entries(row.facets ?? {}).filter(([, v]) => v !== null && Number(v) < 100);
}

/** What a block's manifest entry lacks: the facets under 100 with their counts, or "nothing". @param {any} row */
export function missingOf(row) {
	if (!row.present) return 'entry in docs-ai/osui.blocks.json';
	const parts = weakFacets(row).map(([facet, value]) => {
		if (facet === 'pattern') return 'pattern link';
		const c = row.counts?.[facet];
		return c ? `${facet} ${c[0]}/${c[1]}` : `${facet} ${value}`;
	});
	return parts.length ? parts.join(', ') : 'nothing';
}

/** Where to fix each weak facet: the OML, the generator or components.json. @param {any} row */
export function doOf(row) {
	if (!row.present) return 'npm run docs:ai';
	const parts = weakFacets(row).map(([facet]) => {
		if (facet !== 'pattern') return FACET_DO[/** @type {keyof typeof FACET_DO} */ (facet)];
		const pattern = (row.hints ?? []).map((/** @type {string} */ h) => h.slice(0, -'API'.length)).join(' or ');
		return `components.json: link the block to ${pattern || 'its pattern'}`;
	});
	return parts.join('; ');
}

/** The heatmap cell text of one block: what is missing and what to do. @param {any} row */
function cellText(row) {
	const missing = missingOf(row);
	const todo = doOf(row);
	return [missing === 'nothing' ? 'complete' : `Missing: ${missing}.`, todo ? `Do: ${todo}.` : '']
		.filter(Boolean)
		.join(' ');
}

const LEAD =
	'100 = every parameter typed, described and defaulted when optional; placeholders and events described; both recipes; a pattern link or no API hint.';

export default {
	id: 'M01',
	name: 'Block Manifest Completeness',
	criterion: 'Machine-readable block contract for the Model bridge',
	formula:
		'per public block, mean of facets (params typed+described with defaults when optional, placeholders described, events with payload descriptions, both recipes, pattern link or no hint) · 100 · (manifest blocks / snapshot public blocks); 0 without docs-ai/osui.blocks.json',
	movable: true,
	present: {
		scope: 'Per composable OML block: how complete its generated entry in docs-ai/osui.blocks.json is. Deprecated, non-public and documentation-only blocks are not applicable.',
		heatmap: true,
		appliesTo: ['block'],
		/** @param {any} row */
		cell(row) {
			return { s: row.score, h: cellText(row) };
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			const means = Object.entries(raw.facetMeans ?? {})
				.map(([k, v]) => `${k} ${v ?? '–'}`)
				.join(', ');
			const worst = (m.perComponent ?? []).slice(0, 6).map((/** @type {any} */ r) => `${r.label} ${r.score}`);
			return [
				`${raw.entries ?? 0}/${raw.blocks ?? 0} public blocks in the manifest; facet means ${means || '–'}.`,
				worst.length ? `Lowest: ${list(worst, 6)}.` : 'No block measured.',
				'Descriptions and defaults live in the OML (next Forge release); recipes and links come from npm run docs:ai.',
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
			return { blocksM01: blockTable('M01 · manifest completeness per block', LEAD, rows) };
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const snapshots = ctx.modelSnapshots();
		const rows = flattenBlocks(snapshots);
		const blocks = composableBlocks(rows);
		const manifest = loadBlocksManifest(ctx);
		const perComponent = blocks.map((b) => {
			const entry = manifest?.blocks?.[b.label];
			const r = scoreBlockFacets(b, entry);
			return {
				name: b.label,
				label: b.label,
				key: b.key,
				present: Boolean(entry),
				facets: r.facets,
				counts: r.counts,
				hints: b.patternHints.apiCalls,
				score: r.score,
			};
		});
		const present = perComponent.filter((r) => r.present);
		/** @type {Record<string, number|null>} */
		const facetMeans = {};
		for (const f of FACETS) {
			const values = present.map((r) => r.facets[f]).filter((v) => typeof v === 'number');
			facetMeans[f] = values.length ? round1(/** @type {number} */ (mean(values))) : null;
		}
		let summary = `${present.length}/${blocks.length} public blocks in the manifest`;
		if (snapshots.length === 0) summary = NO_SNAPSHOT;
		else if (!manifest) summary = 'no docs-ai/osui.blocks.json';
		return {
			score: scoreEval({
				blockScores: present.map((r) => r.score),
				entries: present.length,
				blocks: blocks.length,
			}),
			summary,
			raw: {
				manifestPresent: manifest !== null,
				entries: present.length,
				blocks: blocks.length,
				facetMeans,
				snapshots: snapshots.length,
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score || byCodePoint(a.label, b.label)),
			unmeasured: [],
			notApplicable: rows
				.filter((b) => !isComposable(b))
				.map((b) => ({
					name: b.label,
					reason: notComposableReason(b),
					hint: 'Only public, non-deprecated blocks are composable from a consumer module.',
				})),
		};
	},
};
