// @ts-check
/**
 * Source kinds: what a component *is*. A kind is an attribute the generators
 * reason with; the two categories a reader filters by live in lib/universe.mjs.
 *
 *   pattern    TypeScript behaviour + SCSS, a public `*API.ts` (Accordion, DatePicker, …)
 *   component  CSS-only component with an anatomy and a story (card, badge, tag, the widget styles, …)
 *   layout     host-styled partial: styles markup the app template or the runtime emits (layout, menu, header)
 *   utility    helper classes with no anatomy, knobs or story (align-center, the `05-useful` families)
 *   block      a composable OML block that drives no pattern and no stylesheet (Columns2, DisplayOnDevice, …)
 *
 * The directory gives a partial its default kind; `components.json` may override it. A metric's
 * `present.appliesTo` lists the kinds it measures; `'block'` in that list means every block row whatever its
 * runtime. A row outside the list gets a "not applicable" cell that names its kind.
 */

/** @typedef {'pattern'|'component'|'layout'|'utility'|'block'} Kind */

/** The kinds, in the order the data set lists them. */
export const KINDS = /** @type {const} */ (['pattern', 'component', 'layout', 'utility', 'block']);

/**
 * A registry kind normalised, or null when it is not a kind.
 * @param {unknown} kind
 * @returns {Kind|null}
 */
export function normalizeKind(kind) {
	return KINDS.includes(/** @type {Kind} */ (kind)) ? /** @type {Kind} */ (kind) : null;
}

/**
 * The kind a SCSS partial gets from its directory (the registry may override it).
 * @param {string} file path of the partial, absolute or repository-relative
 * @returns {Kind}
 */
export function defaultKindFor(file) {
	const posix = file.split('\\').join('/');
	if (posix.includes('/02-layout/')) return 'layout';
	if (posix.includes('/05-useful/') || posix.includes('/06-utilities/')) return 'utility';
	return 'component';
}
