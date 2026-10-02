// @ts-check
/**
 * Utility classes: the `05-useful` families read from their compiled CSS, the naming grammar
 * `<property>[-<side>][-<value>]` they follow, and the templates that describe a family in a few
 * lines (`margin-{side}-{step}` instead of 48 names). Shared by the utilities suite (U01–U06) and the
 * docs generator (llms-utilities.txt, osui.utilities.json), so the measurement and the documentation
 * cannot drift.
 *
 * A class is read from the *subject* of a selector (its last compound): `.phone .phone-full-width`
 * documents `phone-full-width` under the context `.phone`, never `phone`, which is a runtime body class.
 */
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

import { registry } from './registry.mjs';

/**
 * Classes the manifest documents with at least one declaration or variant.
 * @param {string|null} text
 * @returns {Set<string>}
 */
export function manifestClasses(text) {
	/** @type {Set<string>} */
	const out = new Set();
	if (!text) return out;
	try {
		const parsed = JSON.parse(text);
		for (const f of parsed.families ?? []) {
			for (const c of f.classes ?? []) {
				if ((c.declarations?.length ?? 0) + (c.variants?.length ?? 0) > 0) out.add(c.name);
			}
		}
	} catch {
		return out;
	}
	return out;
}

/** The size scale every scalable property is expected to offer. */
export const STEPS = /** @type {const} */ (['none', 'xs', 's', 'base', 'm', 'l', 'xl', 'xxl']);
/** Box sides and axes a spacing or border class may name. */
export const SIDES = /** @type {const} */ (['top', 'bottom', 'left', 'right', 'x', 'y']);
/** Colour shade suffixes (no suffix is the base shade). */
export const SHADES = /** @type {const} */ (['lightest', 'lighter', 'light', 'dark', 'darker', 'darkest']);
/** The radius vocabulary (ADR-0010): border radius follows shapes, not the size scale. */
export const RADII = /** @type {const} */ (['none', 'soft', 'rounded', 'circle']);
/** Alignment keywords of the flex and grid properties. */
export const ALIGNS = /** @type {const} */ ([
	'baseline',
	'center',
	'flex-end',
	'flex-start',
	'initial',
	'stretch',
	'space-around',
	'space-between',
	'space-evenly',
]);
/** Colour names a `background-` or `text-` class may carry (neutrals are numbered and handled apart). */
export const HUES = /** @type {const} */ ([
	'blue',
	'cyan',
	'grape',
	'green',
	'indigo',
	'lime',
	'orange',
	'pink',
	'red',
	'teal',
	'violet',
	'yellow',
	'primary',
	'secondary',
	'error',
	'info',
	'success',
	'warning',
]);
/**
 * Property heads a class name may start with to follow the grammar. Longest match wins, so
 * `border-radius-soft` is `border-radius` + `soft`, not `border` + `radius-soft`.
 */
export const GRAMMAR_HEADS = /** @type {const} */ ([
	'margin',
	'padding',
	'display',
	'flex-direction',
	'flex-wrap',
	'flex',
	'justify-content',
	'align-items',
	'align-content',
	'align-self',
	'gap',
	'row-gap',
	'column-gap',
	'background',
	'text',
	'font-size',
	'font',
	'border-radius',
	'border-size',
	'border',
	'shadow',
	'position',
	'overflow',
	'width',
	'height',
	'white-space',
	'shape',
]);

/**
 * @typedef {{ prop: string, value: string, important: boolean }} Declaration
 * @typedef {{ context: string, declarations: Declaration[] }} Variant
 * @typedef {object} UtilityClass
 * @property {string} name
 * @property {Declaration[]} declarations  the rules whose selector is exactly the class
 * @property {Variant[]} variants          rules under an ancestor, pseudo-class or compound (`.phone .x`, `.x:hover`)
 * @property {string[]} tokens             custom properties the declarations read through `var()`
 * @typedef {{ name: string, title: string, file: string, classes: UtilityClass[], error: string|null }} UtilityFamily
 */

const HEADS_BY_LENGTH = [...GRAMMAR_HEADS].sort((a, b) => b.length - a.length);

/** @param {import('postcss').Rule} rule */
function isKeyframeStep(rule) {
	const parent = rule.parent;
	return Boolean(parent && parent.type === 'atrule' && /keyframes$/i.test(/** @type {any} */ (parent).name));
}

/** @param {import('postcss').Rule} rule @returns {Declaration[]} */
function declarationsOf(rule) {
	/** @type {Declaration[]} */
	const out = [];
	for (const node of rule.nodes) {
		if (node.type === 'decl') out.push({ prop: node.prop, value: node.value, important: Boolean(node.important) });
	}
	return out;
}

/**
 * The utility class a selector documents and the context it applies in: the first class of the last
 * compound is the subject; everything else (ancestors, other classes, pseudos, attributes) is context.
 * @param {string} selector
 * @returns {{ name: string, context: string }|null}
 */
export function subjectOf(selector) {
	/** @type {{ name: string, context: string }|null} */
	let found = null;
	try {
		const root = selectorParser().astSync(selector);
		const sel = root.nodes[0];
		if (!sel) return null;
		const nodes = sel.nodes;
		let start = 0;
		for (let i = 0; i < nodes.length; i++) if (nodes[i].type === 'combinator') start = i + 1;
		const compound = nodes.slice(start);
		const subject = compound.find((n) => n.type === 'class');
		if (!subject) return null;
		const before = nodes
			.slice(0, start)
			.map((n) => n.toString())
			.join('')
			.trim();
		const rest = compound
			.filter((n) => n !== subject)
			.map((n) => n.toString())
			.join('');
		found = {
			name: /** @type {any} */ (subject).value,
			context: `${before}${before && rest ? ' ' : ''}${rest}`.trim(),
		};
	} catch {
		return null;
	}
	return found;
}

/**
 * Every utility class of a compiled stylesheet, in first-seen order.
 * @param {string} css
 * @returns {UtilityClass[]}
 */
export function parseUtilityCss(css) {
	/** @type {Map<string, UtilityClass>} */
	const classes = new Map();
	const root = postcss.parse(css);
	root.walkRules((rule) => {
		if (isKeyframeStep(rule)) return;
		const declarations = declarationsOf(rule);
		for (const raw of rule.selectors) {
			const subject = subjectOf(raw.trim());
			if (!subject) continue;
			const entry = classEntry(classes, subject.name);
			if (subject.context === '') entry.declarations.push(...declarations);
			else entry.variants.push({ context: subject.context, declarations });
			addTokens(entry, declarations);
		}
	});
	return [...classes.values()];
}

/**
 * The entry of a class name, created on first sight.
 * @param {Map<string, UtilityClass>} classes
 * @param {string} name
 */
function classEntry(classes, name) {
	let entry = classes.get(name);
	if (!entry) {
		entry = { name, declarations: [], variants: [], tokens: [] };
		classes.set(name, entry);
	}
	return entry;
}

/**
 * Add the custom properties a list of declarations reads through `var()`, once each.
 * @param {UtilityClass} entry
 * @param {Declaration[]} declarations
 */
function addTokens(entry, declarations) {
	for (const d of declarations) {
		for (const m of d.value.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/g)) addUnique(entry.tokens, m[1]);
	}
}

/** @param {string[]} list @param {string} value */
function addUnique(list, value) {
	if (!list.includes(value)) list.push(value);
}

/**
 * Where a class name sits in the grammar `<property>[-<side>][-<value>]`.
 * @param {string} name
 * @returns {{ conformant: boolean, head: string|null, side: string|null, value: string|null, step: string|null }}
 */
export function classifyName(name) {
	const head = HEADS_BY_LENGTH.find((h) => name === h || name.startsWith(`${h}-`));
	if (!head) return { conformant: false, head: null, side: null, value: null, step: null };
	const segments = name === head ? [] : name.slice(head.length + 1).split('-');
	let side = null;
	if (segments.length > 1 && SIDES.includes(/** @type {any} */ (segments[0]))) {
		side = segments.shift() ?? null;
		// a corner: `border-radius-top-left-soft`
		if (segments.length > 1 && ['left', 'right'].includes(segments[0]) && ['top', 'bottom'].includes(side ?? '')) {
			side = `${side}-${segments.shift()}`;
		}
	}
	const value = segments.length ? segments.join('-') : null;
	const last = segments[segments.length - 1];
	const step = last && STEPS.includes(/** @type {any} */ (last)) ? last : null;
	return { conformant: true, head, side, value, step };
}

/**
 * The template of a class name: variable segments (steps, sides, shades, hues, numbers) replaced by
 * placeholders, so `margin-top-xs` and `margin-bottom-xl` share `margin-{side}-{step}`.
 * @param {string} name
 */
export function templateKey(name) {
	// an alignment keyword spans two segments (`flex-end`): matched on the value, not per segment
	const c = classifyName(name);
	if (c.conformant && c.value && ALIGNS.includes(/** @type {any} */ (c.value))) return `${c.head}-{align}`;
	let out = '';
	for (const s of segmentsOf(name)) {
		const text = s.kind ? `{${s.kind}}` : s.text;
		if (s.glued || out === '') out += text;
		else out += `-${text}`;
	}
	return out;
}

/** @typedef {'step'|'side'|'shade'|'hue'|'radius'|'n'} Placeholder */

/**
 * @param {string} name
 * @returns {{ text: string, kind: Placeholder|null, glued: boolean }[]}
 */
function segmentsOf(name) {
	// a number glued to the head (`flex1`) is its own segment, joined without a dash
	const glued = /[a-zA-Z]\d+$/.test(name);
	const spaced = glued ? name.replace(/([a-zA-Z])(\d+)$/, '$1-$2') : name;
	const segments = spaced.split('-');
	const radius = name.startsWith('border-radius');
	return segments.map((text, i) => {
		const isLast = i === segments.length - 1;
		/** @type {Placeholder|null} */
		let kind = null;
		if (radius && RADII.includes(/** @type {any} */ (text))) kind = 'radius';
		else if (STEPS.includes(/** @type {any} */ (text))) kind = 'step';
		else if (SIDES.includes(/** @type {any} */ (text))) kind = 'side';
		else if (SHADES.includes(/** @type {any} */ (text))) kind = 'shade';
		else if (HUES.includes(/** @type {any} */ (text))) kind = 'hue';
		else if (/^\d+$/.test(text)) kind = 'n';
		return { text, kind, glued: glued && isLast };
	});
}

/**
 * @typedef {object} TemplateGroup
 * @property {string} key             the template (`margin-{side}-{step}`), or the name of a singleton
 * @property {UtilityClass[]} members
 * @property {string[]} props         properties the members declare, in first-seen order
 * @property {string[]} sides         sides present, in SIDES order
 * @property {string[]} steps         steps present, in STEPS order
 * @property {string[]} shades        shades present, in SHADES order
 * @property {string[]} hues          hues present, in HUES order
 * @property {string[]} radii         radius words present, in RADII order
 * @property {string[]} aligns        alignment keywords present, in ALIGNS order
 * @property {string[]} ns            numbers present, ascending
 * @property {string|null} template   the key when the group is large enough to render as a template (≥ 3)
 */

/**
 * A family collapsed into template groups: names that differ only by step, side, shade, hue or number
 * share a group; every other name is a group of one.
 * @param {UtilityClass[]} classes
 * @returns {TemplateGroup[]}
 */
export function templateGroups(classes) {
	/** @type {Map<string, TemplateGroup>} */
	const groups = new Map();
	for (const c of classes) {
		const key = templateKey(c.name);
		let g = groups.get(key);
		if (!g) {
			g = emptyGroup(key);
			groups.set(key, g);
		}
		addToGroup(g, c);
	}
	for (const g of groups.values()) finishGroup(g);
	return [...groups.values()];
}

/** The list of a template group that collects each placeholder kind. */
const GROUP_FIELD = /** @type {const} */ ({
	side: 'sides',
	step: 'steps',
	shade: 'shades',
	hue: 'hues',
	radius: 'radii',
	n: 'ns',
});

/** The order each list of a template group is sorted in. */
const GROUP_ORDER = /** @type {const} */ ([
	['sides', SIDES],
	['steps', STEPS],
	['shades', SHADES],
	['hues', HUES],
	['radii', RADII],
	['aligns', ALIGNS],
]);

/** @param {string} key @returns {TemplateGroup} */
function emptyGroup(key) {
	return {
		key,
		members: [],
		props: [],
		sides: [],
		steps: [],
		shades: [],
		hues: [],
		radii: [],
		aligns: [],
		ns: [],
		template: null,
	};
}

/**
 * What one class adds to its group: itself, the properties it sets, the values of its placeholders.
 * @param {TemplateGroup} g
 * @param {UtilityClass} c
 */
function addToGroup(g, c) {
	g.members.push(c);
	for (const d of [...c.declarations, ...c.variants.flatMap((v) => v.declarations)]) addUnique(g.props, d.prop);
	const align = classifyName(c.name).value;
	if (g.key.endsWith('{align}') && align) {
		addUnique(g.aligns, align);
		return;
	}
	for (const s of segmentsOf(c.name)) {
		if (s.kind) addUnique(g[GROUP_FIELD[s.kind]], s.text);
	}
}

/** Sort the lists of a group and decide whether it renders as a template. @param {TemplateGroup} g */
function finishGroup(g) {
	for (const [field, list] of GROUP_ORDER) {
		g[field].sort(
			(a, b) =>
				/** @type {readonly string[]} */ (list).indexOf(a) - /** @type {readonly string[]} */ (list).indexOf(b)
		);
	}
	g.ns.sort((a, b) => Number(a) - Number(b));
	g.template = g.members.length >= 3 ? g.key : null;
}

/**
 * Whether llms-utilities.txt covers each class: a template group is covered by its template row, a
 * singleton by its own name. The renderer writes the same keys, so the check cannot drift from it.
 * @param {string} doc text of llms-utilities.txt
 * @param {UtilityClass[]} classes
 * @returns {Map<string, boolean>}
 */
export function docCoverage(doc, classes) {
	/** @type {Map<string, boolean>} */
	const out = new Map();
	for (const g of templateGroups(classes)) {
		const covered = doc.includes(g.template ?? g.members[0].name);
		for (const c of g.members) out.set(c.name, covered);
	}
	return out;
}

/** Families whose classes are behavioural or runtime hooks, not style utilities: outside the grammar. */
export const HOOK_FAMILIES = new Set(['a11y', 'miscellaneous']);

/** Families expected to follow the size scale, with the property heads that carry it. */
export const SCALED = /** @type {Record<string, string[]>} */ ({
	'space-margin': ['margin'],
	'space-padding': ['padding'],
	'display-flex': ['gap', 'row-gap', 'column-gap'],
	typography: ['font-size'],
	shadow: ['shadow'],
	'border-size': ['border-size'],
});

/** Families where a viewport variant (phone, tablet) is meaningful: layout and text, not colour or hooks. */
export const RESPONSIVE_FAMILIES = new Set([
	'space-margin',
	'space-padding',
	'display',
	'display-flex',
	'display-align',
	'text',
	'typography',
	'visibility',
	'box-width',
	'box-height',
	'positioning',
	'positioning-absolute',
	'overflow',
]);

/** Whether a class carries a viewport variant: a `.phone`/`.tablet`/`.desktop` context or prefix. @param {UtilityClass} c */
export function isResponsive(c) {
	return (
		/^(phone|tablet|desktop)-/.test(c.name) ||
		c.variants.some((v) => /\.(phone|tablet|desktop)(?![\w-])/.test(v.context))
	);
}

/**
 * The value each step resolves to, read from the plain class `<head>-<step>` (`margin-xs`).
 * @param {UtilityClass[]} classes
 * @param {string} head
 * @returns {Record<string, { value: string, token: string|null }>}
 */
export function stepValues(classes, head) {
	/** @type {Record<string, { value: string, token: string|null }>} */
	const out = {};
	for (const step of STEPS) {
		const c = classes.find((x) => x.name === `${head}-${step}`);
		const d = c?.declarations[0];
		if (!d) continue;
		const token = /var\(\s*(--[a-zA-Z0-9-]+)/.exec(d.value);
		out[step] = { value: d.value, token: token ? token[1] : null };
	}
	return out;
}

/**
 * The utility families of `05-useful`, each with its classes read from the compiled partial.
 * @param {import('./context.mjs').EvalContext} ctx
 * @returns {UtilityFamily[]}
 */
export function utilityFamilies(ctx) {
	const reg = registry();
	/** @type {Set<string>} */
	const seen = new Set();
	return ctx.inventory.cssComponents
		.filter((c) => c.source === 'useful')
		.map((c) => {
			const { css, error } = ctx.compiledCss(c.scssFile);
			// a class belongs to the family that declares it first
			const classes = css ? parseUtilityCss(css).filter((x) => !seen.has(x.name)) : [];
			for (const x of classes) seen.add(x.name);
			return {
				name: c.name,
				title: reg.components[c.name]?.title ?? c.name,
				file: ctx.rel(c.scssFile),
				classes,
				error: css ? null : (error ?? 'no CSS'),
			};
		});
}
