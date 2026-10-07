// @ts-check
/** Readers of the generated llms card files (docs-ai/llms-components.txt, llms-blocks.txt). */

/**
 * `## <Name>` sections of a card file, keyed by heading, each with its heading line.
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
