// @ts-check
/**
 * Component tiers: what a component *is* decides which evals measure it and which index it moves.
 *
 *   pattern    TypeScript behaviour + SCSS, a public `*API.ts` (Accordion, DatePicker, …)
 *   component  CSS-only component with an anatomy and a story (card, badge, tag, the widget styles, …)
 *   layout     host-styled partial: styles markup the app template or the runtime emits (layout, menu, header)
 *   utility    helper classes with no anatomy, knobs or story (align-center, the `05-useful` families)
 *
 * The directory gives a partial its default tier; `components.json` may override it (`_animate` and
 * `_columns` are helpers filed under `04-patterns`). A metric's `present.appliesTo` lists the tiers it
 * measures; a component outside that list gets a "not applicable" cell that names the tier.
 */

/** @typedef {'pattern'|'component'|'layout'|'utility'} Tier */

/** The tiers, in the order the dashboard lists them. */
export const TIERS = /** @type {const} */ (['pattern', 'component', 'layout', 'utility']);

/**
 * A registry kind normalised to a tier: the previous `css` value means a CSS-only component.
 * @param {unknown} kind
 * @returns {Tier|null}
 */
export function normalizeKind(kind) {
	if (kind === 'css') return 'component';
	return TIERS.includes(/** @type {Tier} */ (kind)) ? /** @type {Tier} */ (kind) : null;
}

/**
 * The tier a SCSS partial gets from its directory (the registry may override it).
 * @param {string} file path of the partial, absolute or repository-relative
 * @returns {Tier}
 */
export function defaultTierFor(file) {
	const posix = file.split('\\').join('/');
	if (posix.includes('/02-layout/')) return 'layout';
	if (posix.includes('/05-useful/') || posix.includes('/06-utilities/')) return 'utility';
	return 'component';
}

/**
 * Whether a metric measures components of a tier.
 * @param {{ appliesTo?: readonly string[] }|null|undefined} present the metric's `present` block
 * @param {string} tier
 */
export function appliesTo(present, tier) {
	if (!present?.appliesTo) return true;
	return present.appliesTo.includes(tier);
}

/** @type {Record<Tier, string>} */
const OUTSIDE = {
	pattern: 'this is a pattern with a TypeScript contract',
	component: 'this is a CSS-only component with an anatomy but no TypeScript contract',
	layout: 'layout partials style markup the app template or the runtime emits, so they have no markup contract of their own',
	utility: 'utility classes have no anatomy, knobs or story of their own; the utilities suite measures them',
};

/**
 * Why a component of this tier sits outside an eval, for a not-applicable cell.
 * @param {string} tier
 */
export function tierText(tier) {
	return OUTSIDE[/** @type {Tier} */ (tier)] ?? `components of the ${tier} tier are outside this eval`;
}
