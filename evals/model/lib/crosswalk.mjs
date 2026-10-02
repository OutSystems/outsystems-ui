// @ts-check
/** The pattern ↔ block crosswalk: registry links first (confirmed by hand), snapshot API hints second (derived). */
import { normalizeKind } from '../../lib/kinds.mjs';

/** @typedef {{ flow: string, name: string, key: string, paramMap: Record<string, string>, platformOnly: string[], eventMap: Record<string, string>, source: 'registry'|'hint' }} Link */

/**
 * @param {string} pattern
 * @param {{ components: Record<string, any> }} registry
 * @param {import('./snapshot.mjs').BlockRow[]} blocks
 * @returns {Link[]}
 */
export function linksFor(pattern, registry, blocks) {
	const confirmed = registry.components[pattern]?.block ?? [];
	if (confirmed.length) {
		return confirmed.map((/** @type {any} */ l) => ({
			flow: l.flow,
			name: l.name,
			key: `${l.flow}/${l.name}`,
			paramMap: l.paramMap ?? {},
			platformOnly: l.platformOnly ?? [],
			eventMap: l.eventMap ?? {},
			source: 'registry',
		}));
	}
	return blocks
		.filter((b) => b.public && b.patternHints.apiCalls.includes(`${pattern}API`))
		.map((b) => ({
			flow: b.flow,
			name: b.name,
			key: b.key,
			paramMap: {},
			platformOnly: [],
			eventMap: {},
			source: 'hint',
		}));
}

/**
 * @param {import('./snapshot.mjs').BlockRow} block
 * @param {string[]} patterns
 * @param {{ components: Record<string, any> }} registry
 * @returns {{ pattern: string|null, source: 'registry'|'hint'|null }}
 */
export function patternOfBlock(block, patterns, registry) {
	for (const [pattern, entry] of Object.entries(registry.components)) {
		if (normalizeKind(entry.kind) !== 'pattern') continue;
		const links = entry.block ?? [];
		if (links.some((/** @type {any} */ l) => l.flow === block.flow && l.name === block.name)) {
			return { pattern, source: 'registry' };
		}
	}
	const hinted = block.patternHints.apiCalls
		.map((api) => api.slice(0, -'API'.length))
		.filter((p) => patterns.includes(p));
	if (hinted.length === 1) return { pattern: hinted[0], source: 'hint' };
	return { pattern: null, source: null };
}
