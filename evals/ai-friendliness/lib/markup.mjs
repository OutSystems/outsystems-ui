// @ts-check
/**
 * Markup-contract helpers. Stories are the executable specification of the DOM each pattern
 * expects (they render the skeleton, then call `Create`/`Initialize` like Service Studio does),
 * so their HTML template literals are the best available proxy for "what an agent must emit".
 */
import ts from 'typescript';

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const MAX_INLINE_DEPTH = 4;

/** @param {string} text */
const looksLikeHtml = (text) => /<[a-zA-Z]/.test(text);

/**
 * @param {ts.Node} node
 * @param {(n: ts.Node) => void} visit
 */
function walk(node, visit) {
	visit(node);
	ts.forEachChild(node, (c) => walk(c, visit));
}

/**
 * @param {ts.Node} node
 * @returns {node is ts.TemplateLiteral}
 */
const isTemplate = (node) => ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node);

/**
 * Template literal returned by a function body (`return \`…\`` or an arrow expression body).
 * @param {ts.ConciseBody|undefined} body
 * @returns {ts.TemplateLiteral|null}
 */
function returnedTemplate(body) {
	if (!body) return null;
	if (isTemplate(body)) return looksLikeHtml(body.getText()) ? body : null;
	/** @type {ts.TemplateLiteral|null} */
	let found = null;
	walk(body, (n) => {
		if (found) return;
		if (ts.isReturnStatement(n) && n.expression && isTemplate(n.expression) && looksLikeHtml(n.expression.getText())) {
			found = n.expression;
		}
	});
	return found;
}

/**
 * Local helper functions that return HTML template literals, by name.
 * @param {ts.SourceFile} sf
 * @returns {Map<string, ts.TemplateLiteral>}
 */
function collectHelpers(sf) {
	/** @type {Map<string, ts.TemplateLiteral>} */
	const helpers = new Map();
	walk(sf, (n) => {
		if (ts.isFunctionDeclaration(n) && n.name) {
			const t = returnedTemplate(n.body);
			if (t) helpers.set(n.name.text, t);
		} else if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
			if (ts.isArrowFunction(n.initializer) || ts.isFunctionExpression(n.initializer)) {
				const t = returnedTemplate(n.initializer.body);
				if (t) helpers.set(n.name.text, t);
			}
		}
	});
	return helpers;
}

/**
 * Serialize a template literal to HTML, inlining calls to local helper templates once per level.
 * Unknown interpolations become empty strings.
 * @param {ts.TemplateLiteral} node
 * @param {Map<string, ts.TemplateLiteral>} helpers
 * @param {number} depth
 * @returns {string}
 */
function serialize(node, helpers, depth) {
	if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
	let out = node.head.text;
	for (const span of node.templateSpans) {
		out += interpolate(span.expression, helpers, depth) + span.literal.text;
	}
	return out;
}

/**
 * @param {ts.Expression} expr
 * @param {Map<string, ts.TemplateLiteral>} helpers
 * @param {number} depth
 */
function interpolate(expr, helpers, depth) {
	if (depth >= MAX_INLINE_DEPTH) return '';
	if (isTemplate(expr) && looksLikeHtml(expr.getText())) return serialize(expr, helpers, depth + 1);
	/** @type {string|null} */
	let inlined = null;
	walk(expr, (n) => {
		if (inlined !== null) return;
		if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && helpers.has(n.expression.text)) {
			inlined = serialize(/** @type {ts.TemplateLiteral} */ (helpers.get(n.expression.text)), helpers, depth + 1);
		} else if (isTemplate(n) && n !== expr && looksLikeHtml(n.getText())) {
			inlined = serialize(n, helpers, depth + 1);
		}
	});
	return inlined ?? '';
}

/**
 * Every HTML template literal in a story source, serialized with helper templates inlined.
 * @param {string} source
 * @returns {string[]}
 */
export function extractTemplates(source) {
	const sf = ts.createSourceFile('story.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const helpers = collectHelpers(sf);
	/** @type {string[]} */
	const templates = [];
	/** @type {Set<ts.Node>} */
	const nested = new Set();
	walk(sf, (n) => {
		if (!isTemplate(n) || !looksLikeHtml(n.getText())) return;
		if (nested.has(n)) return;
		// templates interpolated inside this one are covered by its serialization
		walk(n, (child) => {
			if (child !== n && isTemplate(child)) nested.add(child);
		});
		templates.push(serialize(n, helpers, 0));
	});
	return templates;
}

/**
 * Nesting depth, element count and class names of an HTML fragment.
 * @param {string} html
 */
export function measureHtml(html) {
	const re = /<(\/)?([a-zA-Z][\w-]*)([^<>]*)>/g;
	let depth = 0;
	let max = 0;
	let elements = 0;
	/** @type {Set<string>} */
	const classes = new Set();
	/** @type {Set<string>} */
	const signatures = new Set();
	for (const m of html.matchAll(re)) {
		const [, closing, tag, attrs] = m;
		if (closing) {
			depth = Math.max(0, depth - 1);
			continue;
		}
		elements++;
		/** @type {string[]} */
		const own = [];
		for (const cm of attrs.matchAll(/class\s*=\s*["']([^"']*)["']/g)) {
			cm[1]
				.split(/\s+/)
				.filter((c) => c && !/[${}()]/.test(c))
				.forEach((c) => {
					classes.add(c);
					own.push(c);
				});
		}
		// repeated siblings (list items, table rows) share one signature: an agent learns the part once
		signatures.add(`${tag.toLowerCase()}.${own.sort().join('.')}`);
		if (VOID_ELEMENTS.has(tag.toLowerCase()) || /\/\s*$/.test(attrs)) continue;
		depth++;
		if (depth > max) max = depth;
	}
	return { depth: max, elements, distinctElements: signatures.size, classes: [...classes].sort() };
}

/**
 * Deepest template of a story source.
 * @param {string} source
 */
export function measureStory(source) {
	const templates = extractTemplates(source);
	let best = {
		depth: 0,
		elements: 0,
		distinctElements: 0,
		classes: /** @type {string[]} */ ([]),
		html: /** @type {string|null} */ (null),
	};
	for (const html of templates) {
		const m = measureHtml(html);
		if (m.depth > best.depth || (m.depth === best.depth && m.elements > best.elements)) best = { ...m, html };
	}
	return { ...best, templates: templates.length };
}
