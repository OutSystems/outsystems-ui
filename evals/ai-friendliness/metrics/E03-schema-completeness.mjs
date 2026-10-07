// @ts-check
import { expectationsFor } from '../../lib/expectations.mjs';
import { componentFacets, loadManifest } from '../../lib/manifest.mjs';
import { mean, round1 } from '../../lib/score.mjs';

/**
 * @param {{ componentScores: number[], entries: number, patterns: number }} raw
 */
export function scoreEval({ componentScores, entries, patterns }) {
	const m = mean(componentScores) ?? 0;
	return m * 100 * (patterns === 0 ? 0 : entries / patterns);
}

export default {
	id: 'E03',
	name: 'Machine-Readable Schema Completeness',
	criterion: 'Schema & Metadata · Agent Documentation',
	formula:
		'mean over manifest entries of the mean of six facets (props typed, defaults, api, events, cssClasses, markup) · 100 · (entries / patterns); 0 without docs-ai/osui.components.json',
	movable: true,
	present: {
		scope: 'Per pattern: how complete its entry in docs-ai/osui.components.json is across six facets. CSS-only components are documented in llms-patterns.txt instead.',
		heatmap: true,
		appliesTo: ['pattern'],
		/** @param {any} row */
		cell(row) {
			if (!row.present) return { s: row.score, h: 'Missing from the manifest: run npm run docs:ai.' };
			const weak = Object.entries(row.facets ?? {})
				.filter(([, v]) => Number(v) < 100)
				.map(([k, v]) => `${k} ${v}`);
			return {
				s: row.score,
				h: weak.length
					? `Facets below 100: ${weak.join(', ')}. Add the missing defaults, descriptions or markup skeleton to the source the generator reads.`
					: 'All six manifest facets complete.',
			};
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			const facetMeans = Object.entries(raw.facetMeans ?? {})
				.map(([k, v]) => `${k} ${v}`)
				.join(', ');
			return [
				`${raw.patterns}/${raw.entries ?? raw.patterns} patterns in the manifest; facet means ${facetMeans}.`,
				'Keep it at 100 by running npm run docs:ai in every PR that touches a pattern; the CI freshness check fails a stale commit.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const manifest = loadManifest(ctx);
		const patterns = ctx.inventory.patterns;
		const perComponent = patterns.map((p) => {
			if (!manifest) return { name: p.name, present: false, facets: {}, score: 0 };
			const r = componentFacets(manifest, p.name, expectationsFor(ctx, p));
			return {
				name: p.name,
				present: r.present,
				facets: Object.fromEntries(Object.entries(r.facets).map(([k, v]) => [k, round1(v * 100)])),
				score: round1(r.score * 100),
			};
		});
		const present = perComponent.filter((c) => c.present);
		const raw = {
			manifestPresent: manifest !== null,
			entries: present.length,
			patterns: patterns.length,
			componentScores: present.map((c) => c.score / 100),
		};
		/** @type {Record<string, number|null>} */
		const facetMeans = {};
		for (const facet of ['props', 'defaults', 'api', 'events', 'cssClasses', 'markup']) {
			const values = present.map((c) => c.facets[facet]).filter((v) => typeof v === 'number');
			facetMeans[facet] = values.length ? round1(/** @type {number} */ (mean(values))) : null;
		}
		const facetList = Object.entries(facetMeans)
			.map(([k, v]) => `${k} ${v ?? '–'}`)
			.join(', ');
		return {
			score: scoreEval(raw),
			summary: manifest
				? `${present.length}/${patterns.length} patterns in manifest; facet means ${facetList}`
				: 'no docs-ai/osui.components.json',
			raw: { manifestPresent: raw.manifestPresent, entries: raw.entries, patterns: raw.patterns, facetMeans },
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured: [],
		};
	},
};
