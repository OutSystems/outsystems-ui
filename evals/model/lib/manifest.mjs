// @ts-check
/**
 * Reader for the generated blocks manifest (docs-ai/osui.blocks.json) and the per-block table shape M01,
 * M03 and M04 hand to the dashboard.
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
 * The per-block table of a block-level eval (blocks are not components, so they get a table, not heatmap cells).
 * @param {string} title
 * @param {{ label: string, score: number|null, hint: string }[]} rows
 */
export function blockTable(title, rows) {
	const sorted = [...rows].sort((a, b) => (a.score ?? -1) - (b.score ?? -1) || byCodePoint(a.label, b.label));
	return {
		title,
		columns: ['Block', 'Score', 'Hint'],
		rows: sorted.map((r) => [r.label, r.score === null ? '–' : String(r.score), r.hint]),
	};
}
