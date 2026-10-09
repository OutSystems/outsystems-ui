// @ts-check
/**
 * SCSS/CSS helpers: standalone compilation of a component partial, selector complexity and
 * declaration hygiene. Analysis runs on the *compiled* CSS so no SCSS parser is needed:
 * a `$token-*` read compiles to `var(--token-…, fallback)`, a literal stays a literal, and a
 * component CSS-API read stays `var(--osui-…)`.
 */
import postcss from 'postcss';
import * as sass from 'sass';

/**
 * Compile one SCSS file on its own. Vendor baselines (`_*_lib.scss`, `splide-core.scss`) are
 * never imported by component partials — the build pulls them in through the gulp specs — so a
 * standalone compile measures authored rules only.
 * @param {string} file
 * @param {{ loadPaths?: string[] }} [options]
 * @returns {{ css: string|null, error: string|null }}
 */
export function compileScss(file, { loadPaths = [] } = {}) {
	try {
		const result = sass.compile(file, {
			loadPaths,
			style: 'expanded',
			logger: sass.Logger.silent,
			quietDeps: true,
		});
		return { css: result.css, error: null };
	} catch (e) {
		return { css: null, error: String(/** @type {any} */ (e)?.message ?? e) };
	}
}

const PSEUDO_ELEMENTS = new Set([
	'before',
	'after',
	'first-line',
	'first-letter',
	'selection',
	'placeholder',
	'marker',
	'backdrop',
	'file-selector-button',
]);

/**
 * @typedef {object} SelectorInfo
 * @property {string} selector
 * @property {number} depth        number of top-level combinators
 * @property {[number, number, number]} specificity
 */

const SPECIFICITY_ZERO = /** @type {[number, number, number]} */ ([0, 0, 0]);
/** Functional pseudo-classes whose specificity is that of their most specific argument. */
const FORWARDING_PSEUDOS = new Set(['not', 'is', 'has', 'matches']);

/**
 * Specificity contributed by one pseudo node.
 * @param {import('postcss-selector-parser').Pseudo} node
 * @returns {[number, number, number]}
 */
function pseudoSpecificity(node) {
	const name = node.value.replace(/^:+/, '').toLowerCase();
	if (node.value.startsWith('::') || PSEUDO_ELEMENTS.has(name)) return [0, 0, 1];
	if (name === 'where') return SPECIFICITY_ZERO;
	if (!FORWARDING_PSEUDOS.has(name)) return [0, 1, 0];
	let best = SPECIFICITY_ZERO;
	for (const inner of node.nodes ?? []) {
		const s = specificityOf(inner);
		if (compareSpec(s, best) > 0) best = s;
	}
	return best;
}

/**
 * Specificity contributed by one simple selector node.
 * @param {import('postcss-selector-parser').Node} node
 * @returns {[number, number, number]}
 */
function nodeSpecificity(node) {
	switch (node.type) {
		case 'id':
			return [1, 0, 0];
		case 'class':
		case 'attribute':
			return [0, 1, 0];
		case 'tag':
			return node.value === '*' ? SPECIFICITY_ZERO : [0, 0, 1];
		case 'pseudo':
			return pseudoSpecificity(/** @type {import('postcss-selector-parser').Pseudo} */ (node));
		default:
			return SPECIFICITY_ZERO;
	}
}

/**
 * Specificity of one parsed selector (postcss-selector-parser `Selector` node).
 * @param {import('postcss-selector-parser').Selector} sel
 * @returns {[number, number, number]}
 */
function specificityOf(sel) {
	/** @type {[number, number, number]} */
	const total = [0, 0, 0];
	for (const node of sel.nodes) {
		const s = nodeSpecificity(node);
		total[0] += s[0];
		total[1] += s[1];
		total[2] += s[2];
	}
	return total;
}

/** @param {number[]} x @param {number[]} y */
function compareSpec(x, y) {
	for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
	return 0;
}

/**
 * Nearest-rank percentile of a numeric array (0 for an empty array).
 * @param {number[]} values
 * @param {number} p 0–1
 */
function percentile(values, p) {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((x, y) => x - y);
	const rank = Math.max(1, Math.ceil(p * sorted.length));
	return sorted[rank - 1];
}

/**
 * Class names a compiled stylesheet selects, in first-seen order: read from the rule selectors, never
 * from comments or values (`.scss` in a source comment is not a class). Keyframe steps are skipped.
 * @param {string} css
 * @returns {string[]}
 */
export function classNamesOf(css) {
	const root = postcss.parse(css);
	/** @type {Set<string>} */
	const out = new Set();
	root.walkRules((rule) => {
		const parent = rule.parent;
		if (parent && parent.type === 'atrule' && /keyframes$/i.test(/** @type {any} */ (parent).name)) return;
		// an escaped character (`.a\:b`) belongs to the name; the backslash itself does not
		for (const m of rule.selector.matchAll(/\.(-?[_a-zA-Z](?:[\w-]|\\.)*)/g)) out.add(m[1].replace(/\\/g, ''));
	});
	return [...out];
}

