// @ts-check
/**
 * Source kinds: what a row *is*, which decides which evals measure it. A kind is an attribute the evals
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

/**
 * Whether a metric measures rows of a kind.
 * @param {{ appliesTo?: readonly string[] }|null|undefined} present the metric's `present` block
 * @param {string} kind
 */
export function appliesTo(present, kind) {
	if (!present?.appliesTo) return true;
	return present.appliesTo.includes(kind);
}

/**
 * Whether a metric measures a row of the universe: its kind is listed, or the list names `block` and the
 * row is a block (category `component`).
 * @param {{ appliesTo?: readonly string[] }|null|undefined} present
 * @param {{ kind: string, category: string }} row
 */
export function rowApplies(present, row) {
	if (!present?.appliesTo) return true;
	if (present.appliesTo.includes(row.kind)) return true;
	return row.category === 'component' && present.appliesTo.includes('block');
}

/** @type {Record<Kind | 'styleBlock', string>} */
export const KIND_TEXT = {
	pattern: 'this is a pattern with a TypeScript contract',
	component: 'this is a CSS-only component with an anatomy but no TypeScript contract',
	layout: 'layout partials style markup the app template or the runtime emits, so they have no markup contract of their own',
	utility: 'utility classes have no anatomy, knobs or story of their own; the utilities suite measures them',
	block: 'a pure OML block: no TypeScript pattern and no OutSystems UI stylesheet of its own',
	styleBlock: 'this block drives a CSS-only component, not a TypeScript pattern',
};

/**
 * Why a row of this kind sits outside an eval, for a not-applicable cell.
 * @param {string} kind
 */
export function kindText(kind) {
	return KIND_TEXT[/** @type {Kind} */ (kind)] ?? `rows of the ${kind} kind are outside this eval`;
}

/**
 * Why a row sits outside an eval: a block that drives a stylesheet gets the block-specific text, every other
 * row the text of its kind.
 * @param {{ kind: string, category: string }} row
 */
export function rowKindText(row) {
	if (row.category === 'component' && (row.kind === 'component' || row.kind === 'layout'))
		return KIND_TEXT.styleBlock;
	return kindText(row.kind);
}
