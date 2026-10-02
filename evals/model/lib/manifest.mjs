// @ts-check
/**
 * Reader for the generated blocks manifest (docs-ai/osui.blocks.json) and the per-block table shape M01,
 * M03 and M04 hand to the dashboard findings (their cells also sit in the heatmap, one row per block).
 */

/**
 * @param {{ docsAi: (name: string) => string|null }} ctx
 * @returns {{ version: string, blocks: Record<string, any> }|null}
 */
export function loadBlocksManifest(ctx) {
	const text = ctx.docsAi('osui.blocks.json');
	if (!text) return null;
	try {
		const parsed = JSON.parse(text);
		if (!parsed || typeof parsed !== 'object' || !parsed.blocks || !parsed.version) return null;
		return parsed;
	} catch {
		return null;
	}
}

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/**
 * A per-block table a metric contributes through `present.extra`: lowest score first, what is missing and
 * what to do per block, and a lead line saying what 100 means.
 * @param {string} title
 * @param {string} lead
 * @param {{ label: string, score: number|null, missing: string, do: string }[]} rows
 */
export function blockTable(title, lead, rows) {
	const sorted = [...rows];
	sorted.sort((a, b) => (a.score ?? -1) - (b.score ?? -1) || byCodePoint(a.label, b.label));
	return {
		title,
		lead,
		columns: ['Block', 'Score', 'Missing', 'Do'],
		rows: sorted.map((r) => [r.label, r.score === null ? '–' : String(r.score), r.missing, r.do]),
	};
}
