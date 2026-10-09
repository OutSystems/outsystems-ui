// @ts-check
/**
 * Reader for the machine-readable component manifest (`docs-ai/osui.components.json`) and the
 * facet scoring shared by E01 (context cost) and E03 (schema completeness).
 */

/**
 * @typedef {object} Manifest
 * @property {string} [version]
 * @property {string} [$schema]
 * @property {Record<string, ManifestComponent>} components
 */

/**
 * @typedef {object} ManifestComponent
 * @property {Record<string, { type?: string, default?: unknown, allowed?: unknown[], description?: string }>} [props]
 * @property {{ name: string }[]} [api]
 * @property {string[]} [events]
 * @property {Record<string, string>} [cssClasses]
 * @property {string} [markup]
 */

/**
 * @typedef {object} Expectations
 * @property {{ name: string, validated: string|null, defaultText: string|null }[]} props
 * @property {string[]} api
 * @property {string[]} events
 * @property {string[]} cssClasses
 */


/**
 * @param {string[]} expected
 * @param {(name: string) => boolean} has
 */
function coverage(expected, has) {
	if (expected.length === 0) return null;
	return expected.filter(has).length / expected.length;
}

/**
 * Six-facet completeness of one manifest entry against what the source declares.
 * Facets with nothing to cover are omitted; a missing entry scores 0.
 * @param {Manifest} manifest
 * @param {string} name
 * @param {Expectations} expected
 */
export function componentFacets(manifest, name, expected) {
	const entry = manifest.components[name];
	/** @type {Record<string, number>} */
	const facets = {};
	if (!entry) return { facets, score: 0, present: false };

	const props = entry.props ?? {};
	const apiNames = new Set((entry.api ?? []).map((a) => (typeof a === 'string' ? a : a.name)));
	const events = new Set(entry.events ?? []);
	const cssValues = new Set(Object.values(entry.cssClasses ?? {}));

	const withDefault = expected.props.filter((p) => p.defaultText !== null);
	const candidates = {
		props: coverage(
			expected.props.map((p) => p.name),
			(n) => props[n] !== undefined && typeof props[n].type === 'string' && props[n].type.length > 0
		),
		defaults: coverage(
			withDefault.map((p) => p.name),
			(n) => props[n] !== undefined && props[n].default !== undefined
		),
		api: coverage(expected.api, (n) => apiNames.has(n)),
		events: coverage(expected.events, (n) => events.has(n)),
		cssClasses: coverage(expected.cssClasses, (n) => cssValues.has(n)),
		markup: typeof entry.markup === 'string' && entry.markup.trim().length > 0 ? 1 : 0,
	};
	for (const [facet, value] of Object.entries(candidates)) if (value !== null) facets[facet] = value;
	const values = Object.values(facets);
	const score = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
	return { facets, score, present: true };
}
