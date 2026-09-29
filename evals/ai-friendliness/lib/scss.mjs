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

/**
 * Specificity of one parsed selector (postcss-selector-parser `Selector` node).
 * @param {import('postcss-selector-parser').Selector} sel
 * @returns {[number, number, number]}
 */
function specificityOf(sel) {
	let a = 0;
	let b = 0;
	let c = 0;
	for (const node of sel.nodes) {
		switch (node.type) {
			case 'id':
				a++;
				break;
			case 'class':
			case 'attribute':
				b++;
				break;
			case 'tag':
				if (node.value !== '*') c++;
				break;
			case 'pseudo': {
				const name = node.value.replace(/^:+/, '').toLowerCase();
				if (node.value.startsWith('::') || PSEUDO_ELEMENTS.has(name)) {
					c++;
				} else if (name === 'where') {
					// zero specificity by definition
				} else if (name === 'not' || name === 'is' || name === 'has' || name === 'matches') {
					let best = [0, 0, 0];
					for (const inner of node.nodes ?? []) {
						const s = specificityOf(inner);
						if (compareSpec(s, best) > 0) best = s;
					}
					a += best[0];
					b += best[1];
					c += best[2];
				} else {
					b++;
				}
				break;
			}
			default:
				break;
		}
	}
	return [a, b, c];
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

const THEMEABLE =
	/^(color|background|background-color|border|border-(top|right|bottom|left|block|inline)(-(start|end))?|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?-(color|width)|border(-[a-z]+)*-radius|box-shadow|text-shadow|outline|outline-(color|width)|padding|padding-[a-z-]+|margin|margin-[a-z-]+|gap|row-gap|column-gap|inset|inset-[a-z-]+|top|right|bottom|left|font-size|line-height|fill|stroke)$/;

const COLOR_LITERAL = /#[0-9a-f]{3,8}\b|\b(rgb|rgba|hsl|hsla)\(|(?<![\w-])(white|black)(?![\w-])/i;
const SIZE_LITERAL = /(?<![\w.-])(-?\d*\.?\d+)(px|rem|em|pt)(?![\w-])/gi;

/**
 * True when the value carries a raw colour or a non-zero px/rem/em/pt number.
 * @param {string} value
 */
export function isLiteralValue(value) {
	if (COLOR_LITERAL.test(value)) return true;
	for (const m of value.matchAll(SIZE_LITERAL)) {
		if (parseFloat(m[1]) !== 0) return true;
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
		if (!isKnob && !THEMEABLE.test(prop)) return;
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
	let out = css;
	const re = /var\(\s*--token-[\w-]+\s*,\s*/g;
	// iterate until stable: each pass unwraps the innermost var(--token-…, X)
	for (let i = 0; i < 20 && re.test(out); i++) {
		out = out.replace(/var\(\s*--token-[\w-]+\s*,\s*([^()]*?(?:\([^()]*\)[^()]*?)*)\)/g, '$1');
		re.lastIndex = 0;
	}
	return out;
}
