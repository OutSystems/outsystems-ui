// @ts-check
/**
 * SCSS/CSS helpers: standalone compilation of a component partial, selector complexity and
 * declaration hygiene. Analysis runs on the *compiled* CSS so no SCSS parser is needed:
 * a `$token-*` read compiles to `var(--token-…, fallback)`, a literal stays a literal, and a
 * component CSS-API read stays `var(--osui-…)`.
 */
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
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
		const result = sass.compile(file, { loadPaths, style: 'expanded', logger: sass.Logger.silent, quietDeps: true });
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
export function percentile(values, p) {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((x, y) => x - y);
	const rank = Math.max(1, Math.ceil(p * sorted.length));
	return sorted[rank - 1];
}

/**
 * Selector complexity of a compiled stylesheet. Keyframe step selectors are skipped.
 * @param {string} css
 */
export function analyseSelectors(css) {
	const root = postcss.parse(css);
	/** @type {SelectorInfo[]} */
	const selectors = [];
	let rules = 0;
	root.walkRules((rule) => {
		const parent = rule.parent;
		if (parent && parent.type === 'atrule' && /keyframes$/i.test(/** @type {any} */ (parent).name)) return;
		rules++;
		for (const raw of rule.selectors) {
			const selector = raw.trim();
			let depth = 0;
			let specificity = /** @type {[number, number, number]} */ ([0, 0, 0]);
			try {
				selectorParser((sels) => {
					sels.each((sel) => {
						depth = sel.nodes.filter((n) => n.type === 'combinator').length;
						specificity = specificityOf(sel);
					});
				}).processSync(selector);
			} catch {
				// unparsable selector (vendor hacks): count it with zero complexity
			}
			selectors.push({ selector, depth, specificity });
		}
	});
	const depths = selectors.map((s) => s.depth);
	const bs = selectors.map((s) => s.specificity[1]);
	const avgDepth = depths.length ? Number((depths.reduce((x, y) => x + y, 0) / depths.length).toFixed(2)) : 0;
	return {
		rules,
		selectors,
		avgDepth,
		maxDepth: depths.length ? Math.max(...depths) : 0,
		p90b: percentile(bs, 0.9),
		p90depth: percentile(depths, 0.9),
	};
}

const THEMEABLE_EXACT = new Set([
	'color',
	'background',
	'background-color',
	'border',
	'box-shadow',
	'text-shadow',
	'outline',
	'outline-color',
	'outline-width',
	'padding',
	'margin',
	'gap',
	'row-gap',
	'column-gap',
	'inset',
	'top',
	'right',
	'bottom',
	'left',
	'font-size',
	'line-height',
	'fill',
	'stroke',
]);
const THEMEABLE_PREFIXES = ['padding-', 'margin-', 'inset-'];

/**
 * Properties whose value is a colour, space, radius, shadow or type size — the ones a theme or a
 * component knob is expected to drive.
 * @param {string} prop lower-case property name
 */
export function isThemeableProp(prop) {
	if (THEMEABLE_EXACT.has(prop)) return true;
	if (THEMEABLE_PREFIXES.some((p) => prop.startsWith(p))) return true;
	if (!prop.startsWith('border-')) return false;
	// border sides/axes (`border-inline-start`), their colour/width, and every radius longhand
	return prop.endsWith('-radius') || prop.endsWith('-color') || prop.endsWith('-width') || /^border-(top|right|bottom|left|block|inline)(-(start|end))?$/.test(prop);
}

const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|\b(rgb|rgba|hsl|hsla)\(|(?<![\w-])(white|black)(?![\w-])/i;
const SIZE_TOKEN = /^-?(\d+\.?\d*|\.\d+)(px|rem|em|pt)$/i;

/**
 * True when the value carries a raw colour or a non-zero px/rem/em/pt number.
 * @param {string} value
 */
export function isLiteralValue(value) {
	if (COLOR_LITERAL.test(value)) return true;
	for (const token of value.split(/[\s,()/]+/)) {
		const m = SIZE_TOKEN.exec(token);
		if (m && Number.parseFloat(m[1]) !== 0) return true;
	}
	return false;
}

/**
 * Declaration hygiene of a compiled stylesheet, limited to themeable properties and
 * `--osui-*` component CSS-API knobs.
 * @param {string} css
 */
export function analyseDeclarations(css) {
	const root = postcss.parse(css);
	let total = 0;
	let literal = 0;
	let routed = 0;
	let tokened = 0;
	let important = 0;
	let knobs = 0;
	/** @type {{ prop: string, value: string, selector: string }[]} */
	const samples = [];
	root.walkDecls((decl) => {
		const prop = decl.prop.toLowerCase();
		const isKnob = prop.startsWith('--osui-');
		if (!isKnob && !isThemeableProp(prop)) return;
		if (prop.startsWith('--') && !isKnob) return;
		total++;
		if (isKnob) knobs++;
		if (decl.important) important++;
		const value = decl.value.toLowerCase();
		if (value.includes('var(')) {
			if (value.includes('var(--osui-')) routed++;
			else tokened++;
		} else if (isLiteralValue(value)) {
			literal++;
			const selector = decl.parent && 'selector' in decl.parent ? String(decl.parent.selector) : '';
			samples.push({ prop: decl.prop, value: decl.value, selector });
		}
	});
	return { total, literal, routed, tokened, important, knobs, samples };
}

/**
 * Resolve every `var(--token-*, fallback)` (nested included) to its fallback so two
 * stylesheets can be compared for behavioural equivalence.
 * @param {string} css
 */
export function resolveTokenFallbacks(css) {
	const marker = 'var(--token-';
	let out = css;
	let from = 0;
	for (;;) {
		const start = out.indexOf(marker, from);
		if (start < 0) return out;
		// walk to the matching parenthesis, remembering the first top-level comma
		let depth = 0;
		let comma = -1;
		let end = -1;
		for (let i = start + 'var'.length; i < out.length; i++) {
			const ch = out[i];
			if (ch === '(') depth++;
			else if (ch === ')') {
				depth--;
				if (depth === 0) {
					end = i;
					break;
				}
			} else if (ch === ',' && depth === 1 && comma < 0) comma = i;
		}
		if (end < 0) return out;
		if (comma < 0) {
			// no fallback: nothing to resolve, keep scanning after this var()
			from = end + 1;
			continue;
		}
		out = out.slice(0, start) + out.slice(comma + 1, end).trim() + out.slice(end + 1);
		from = start; // the fallback may itself contain a var(--token-…)
	}
}
