// @ts-check
/**
 * Agent-facing documentation generated from the source of truth.
 *
 *   docs-ai/osui.components.json   one entry per pattern: lifecycle, API signatures, typed props with
 *                                  defaults and allowed values, events, CSS classes, CSS-API knobs, markup skeleton
 *   docs-ai/llms.txt               index + the gotchas an agent must know (≤ 1,500 tokens)
 *   docs-ai/llms-components.txt    one reference card per pattern (≤ 500 tokens each)
 *   docs-ai/llms-tokens.txt        framework theme roles (--color-*, --border-radius-*, …) and every --osui-* knob
 *   docs-ai/llms-patterns.txt      skeletons of the CSS-only components (Card, Section, Badge, layout, …)
 *
 * Everything is derived with the same readers the AI-friendliness evals use, so the two cannot drift.
 */
import fs from 'node:fs';
import path from 'node:path';

import { expectationsFor } from '../../evals/lib/expectations.mjs';
import { measureStory } from '../../evals/lib/markup.mjs';
import { insideDir } from '../../evals/lib/paths.mjs';
import { classNamesOf } from '../../evals/lib/scss.mjs';
import {
	classifyName,
	GRAMMAR_HEADS,
	HUES,
	SHADES,
	SIDES,
	STEPS,
	stepValues,
	templateGroups,
	templateKey,
	utilityFamilies,
} from '../../evals/lib/utilities.mjs';
import { countTokens } from '../../evals/lib/tokens.mjs';
import { getClassesInFiles, getEnums, getSourceFile } from '../../evals/lib/ts.mjs';

export const MANIFEST_VERSION = '1';

/** Explicit, locale-independent string order. */
export const byCodePoint = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : Number(a > b));
/** DatePicker (18 props, 20 API functions) is the largest card and needs ~620 tokens with types kept. */
export const CARD_TOKEN_BUDGET = 650;
const MARKUP_CAP = 1200;

/**
 * Abbreviate fully-qualified framework types for the text cards: an agent reads
 * `IAccordionItem`, not `OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem`.
 * @param {string} type
 */
export function shortType(type) {
	return type
		.replace(/string \| Record<string, unknown>/g, 'string | object')
		.replace(/OSFramework\.OSUI\.GlobalCallbacks\./g, '')
		.replace(/OSFramework\.OSUI\.Patterns\.\w+\./g, '')
		.replace(/OSFramework\.OSUI\.(Patterns|Interface|Event\.\w+|Feature\.\w+)\./g, '')
		.replace(/OSFramework\.OSUI\./g, '')
		.replace(/OutSystems\.OSUI\./g, '')
		.replace(/Providers\.OSUI\.\w+\.\w+\./g, '');
}

/** @param {import('../../evals/lib/context.mjs').EvalContext} ctx */
function globalEnums(ctx) {
	const file = path.join(ctx.root, 'src', 'scripts', 'OSFramework', 'OSUI', 'GlobalEnum.ts');
	return getEnums(getSourceFile(ctx.program, file));
}

/**
 * Enum declarations visible to a pattern: its own `Enum.*` files (framework + provider) and `GlobalEnum`.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').Pattern} pattern
 * @param {string} scope `Enum` | `GlobalEnum`
 * @param {string} enumName
 */
function findEnum(ctx, pattern, scope, enumName) {
	const pool = scope === 'GlobalEnum' ? globalEnums(ctx) : expectationsFor(ctx, pattern).enums;
	return pool.find((e) => e.name === enumName) ?? null;
}

/**
 * Literal value of a source expression used as a default or allowed value.
 * `'x'` → `x`, `false` → false, `3` → 3, `Enum.IconType.Caret` → `Caret`, `GlobalEnum.Direction.Right` → `right`.
 * Unresolvable references return null.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').Pattern} pattern
 * @param {string|null} text
 * @returns {string|number|boolean|null}
 */
export function resolveEnumReference(ctx, pattern, text) {
	if (text === null || text === undefined) return null;
	const t = text.trim();
	if (t === 'undefined' || t === 'null' || t === '') return null;
	if (t === 'true') return true;
	if (t === 'false') return false;
	if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
	const quote = t[0];
	if ((quote === "'" || quote === '"' || quote === '`') && t.length >= 2 && t.endsWith(quote)) return t.slice(1, -1);
	const ref = parseEnumPath(t);
	if (!ref || !ref.member) return null;
	const e = findEnum(ctx, pattern, ref.scope, ref.enumName);
	if (!e || !(ref.member in e.members)) return null;
	return e.members[ref.member];
}

/**
 * Split `…Enum.Name.Member` / `…GlobalEnum.Name` into its parts, or null when the text is not an
 * enum path. The scope is the last `Enum`/`GlobalEnum` segment; at most one member segment follows.
 * @param {string} text
 * @returns {{ scope: 'Enum'|'GlobalEnum', enumName: string, member: string|null }|null}
 */
export function parseEnumPath(text) {
	const parts = text.trim().split('.');
	const scopeIndex = Math.max(parts.lastIndexOf('Enum'), parts.lastIndexOf('GlobalEnum'));
	if (scopeIndex < 0) return null;
	const rest = parts.slice(scopeIndex + 1);
	if (rest.length === 0 || rest.length > 2 || !rest.every((p) => /^[A-Z]\w*$/.test(p))) return null;
	return {
		scope: /** @type {'Enum'|'GlobalEnum'} */ (parts[scopeIndex]),
		enumName: rest[0],
		member: rest[1] ?? null,
	};
}

/**
 * All member values of the enum an expression belongs to (`Enum.IconType.Caret` → every IconType value).
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').Pattern} pattern
 * @param {string|null} text enum member reference or `Object.values(Enum.X)` operand
 * @returns {(string|number)[]|null}
 */
export function enumValuesFor(ctx, pattern, text) {
	if (!text) return null;
	const ref = parseEnumPath(text);
	if (!ref) return null;
	const e = findEnum(ctx, pattern, ref.scope, ref.enumName);
	return e ? Object.values(e.members) : null;
}

/** @param {(string|number|boolean)[]} values */
const unionType = (values) => values.map((v) => (typeof v === 'string' ? `'${v}'` : String(v))).join(' | ');

/**
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').Pattern} pattern
 * @param {import('../../evals/lib/ts.mjs').ConfigProp} prop
 */
export function describeProp(ctx, pattern, prop) {
	/** @type {{ type: string, default?: unknown, allowed?: (string|number)[], hint?: string, description?: string }} */
	const out = { type: prop.typeText ?? 'unknown' };
	const { allowed, hint } = allowedValuesFor(ctx, pattern, prop);
	out.type = publicTypeText(prop, allowed);
	if (allowed) out.allowed = allowed;
	if (hint) out.hint = hint;
	if (prop.defaultText !== null) {
		const resolved = resolveEnumReference(ctx, pattern, prop.defaultText);
		out.default = resolved !== null ? resolved : prop.defaultText;
	}
	if (prop.docText) out.description = prop.docText;
	return out;
}

/**
 * Allowed values of a `validateInRange` prop: the explicit list, an `Object.values(Enum)` operand, or a
 * single enum reference expanded to its enum; the default is always accepted.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').Pattern} pattern
 * @param {import('../../evals/lib/ts.mjs').ConfigProp} prop
 * @returns {(string|number)[]|null}
 */
function inRangeValues(ctx, pattern, prop) {
	/** @type {(string|number)[]|null} */
	let allowed = null;
	if (prop.allowed.length) {
		const resolved = prop.allowed.map((a) => resolveEnumReference(ctx, pattern, a));
		if (resolved.every((v) => v !== null)) allowed = /** @type {(string|number)[]} */ (resolved);
	} else if (prop.allowedFrom) {
		allowed = enumValuesFor(ctx, pattern, prop.allowedFrom);
	}
	if (!allowed && prop.allowed.length === 1) allowed = enumValuesFor(ctx, pattern, prop.allowed[0]);
	const def = resolveEnumReference(ctx, pattern, prop.defaultText);
	if (allowed && def !== null && typeof def !== 'boolean' && !allowed.includes(def)) return [def, ...allowed];
	return allowed;
}

/**
 * Allowed values and, when the source does not constrain a string, a hint.
 *
 * A string prop defaulted to a *pattern-local* enum member (Enum.IconType.Caret) is constrained to
 * that enum. A GlobalEnum default (GlobalEnum.Direction.Right) is only a hint: the shared enum is a
 * superset of what the pattern handles and the source does not validate the value, so no allowed
 * list is fabricated — the gap is reported as-is.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').Pattern} pattern
 * @param {import('../../evals/lib/ts.mjs').ConfigProp} prop
 * @returns {{ allowed: (string|number)[]|null, hint?: string }}
 */
function allowedValuesFor(ctx, pattern, prop) {
	if (prop.validated === 'inRange') {
		const allowed = inRangeValues(ctx, pattern, prop);
		if (allowed) return { allowed };
	}
	if (prop.kind === 'enum' && prop.typeText) return { allowed: enumValuesFor(ctx, pattern, `${prop.typeText}.X`) };
	const enumDefault = prop.kind === 'string' ? parseEnumPath(prop.defaultText ?? '') : null;
	if (!enumDefault?.member) return { allowed: null };
	if (enumDefault.scope === 'Enum') return { allowed: enumValuesFor(ctx, pattern, prop.defaultText) };
	return {
		allowed: null,
		hint: `default from ${enumDefault.scope}.${enumDefault.enumName}; not validated — any string is accepted`,
	};
}

/**
 * Type text shown to agents for a prop.
 * @param {import('../../evals/lib/ts.mjs').ConfigProp} prop
 * @param {(string|number)[]|null} allowed
 */
function publicTypeText(prop, allowed) {
	if (allowed) return unionType(allowed);
	switch (prop.kind) {
		case 'boolean':
		case 'number':
		case 'string':
			return prop.kind;
		case 'enum':
			return prop.typeText ?? 'enum';
		case 'any':
		case 'unknown':
		case 'untyped':
			return 'unknown';
		default:
			return prop.typeText ?? prop.kind;
	}
}

/**
 * Whitespace-collapsed story skeleton without demo styling or interpolation leftovers.
 * @param {string|null} html
 */
export function cleanMarkup(html) {
	if (!html) return '';
	let out = html
		.replace(/\s+/g, ' ')
		.replace(/ style="[^"]*"/g, '')
		.replace(/\$\{[^}]*\}/g, '')
		.replace(/ class=""/g, '')
		.replace(/> </g, '><')
		.trim();
	if (out.length > MARKUP_CAP) out = `${out.slice(0, MARKUP_CAP)}…`;
	return out;
}

/**
 * `--osui-*` custom properties declared by a compiled stylesheet, in declaration order.
 * @param {string|null} css
 */
export function knobsOf(css) {
	if (!css) return [];
	/** @type {Set<string>} */
	const knobs = new Set();
	for (const line of css.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed.startsWith('--osui-')) continue;
		const colon = trimmed.indexOf(':');
		if (colon > 0) knobs.add(trimmed.slice(0, colon).trimEnd());
	}
	return [...knobs];
}

/**
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').Pattern} pattern
 */
function lifecycleOf(ctx, pattern) {
	const names = new Set(expectationsFor(ctx, pattern).api);
	const classes = getClassesInFiles(ctx.program, pattern.classFiles);
	const isChild = classes.some((c) => c.chain.includes('AbstractChild'));
	const isParent = classes.some((c) => c.chain.includes('AbstractParent'));
	const steps = [];
	if (names.has('Create')) steps.push('Create(id, configs)');
	if (names.has('RegisterCallback')) steps.push('RegisterCallback(id, eventName, callback)');
	if (names.has('Initialize')) steps.push('Initialize(id)');
	steps.push('… runtime calls (ChangeProperty, actions) …');
	if (names.has('Dispose')) steps.push('Dispose(id)');
	let text = steps.join(' → ');
	if (isChild) text += ' · child pattern: Create after its parent, Initialize after the parent, Dispose before it';
	if (isParent) text += ' · parent pattern: Create before its children, Initialize before them, Dispose after them';
	return text;
}

/**
 * Build the component manifest.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 */
export function buildManifest(ctx) {
	/** @type {Record<string, any>} */
	const components = {};
	for (const p of ctx.inventory.patterns) {
		const e = expectationsFor(ctx, p);
		/** @type {Record<string, any>} */
		const props = {};
		for (const prop of [...e.props].sort((a, b) => a.name.localeCompare(b.name)))
			props[prop.name] = describeProp(ctx, p, prop);
		const api = e.apiFunctions.map((f) => ({
			name: f.name,
			params: f.params.map((x) => ({ name: x.name, type: x.type ?? 'unknown' })),
			returns: f.returnType ?? 'void',
			description: f.jsDoc?.description ?? '',
		}));
		const cssApi = [...new Set(p.scssFiles.flatMap((f) => knobsOf(ctx.compiledCss(f).css)))];
		const markup = p.storyFile ? cleanMarkup(measureStory(ctx.readText(p.storyFile)).html) : '';
		components[p.name] = {
			name: p.name,
			kind: 'pattern',
			providers: p.providerDirs.map((d) => path.basename(d)),
			lifecycle: lifecycleOf(ctx, p),
			api,
			props,
			events: e.events,
			cssClasses: e.cssClassMap,
			cssApi,
			markup,
			usage: usageOf(p.name, props),
			schema: `schema/configs/${p.name}.schema.json`,
			story: p.storyFile ? ctx.rel(p.storyFile) : null,
			scss: p.scssFiles.map((f) => ctx.rel(f)),
			files: p.contractFiles.map((f) => ctx.rel(f)),
		};
	}
	return {
		$schema: './schema/osui.components.schema.json',
		version: MANIFEST_VERSION,
		source: 'scripts/generate-ai-docs.mjs',
		components,
	};
}

/**
 * The canonical call shape of a pattern: a configs example with every documented default (the runtime
 * applies them anyway, so the example is behaviour-neutral) and the Create → Initialize calls.
 * @param {string} name
 * @param {Record<string, any>} props manifest props
 */
export function usageOf(name, props) {
	/** @type {Record<string, unknown>} */
	const configs = {};
	for (const [k, d] of Object.entries(props)) if (d.default !== undefined) configs[k] = d.default;
	configs.ExtendedClass = '';
	const id = `${name.charAt(0).toLowerCase()}${name.slice(1)}1`;
	return {
		configs,
		create: `OutSystems.OSUI.Patterns.${name}API.Create("${id}", ${JSON.stringify(JSON.stringify(configs))})`,
		initialize: `OutSystems.OSUI.Patterns.${name}API.Initialize("${id}")`,
	};
}

/** JSON Schema type of one manifest prop; a type beyond JSON primitives stays open and is described. @param {any} d */
function schemaPropOf(d) {
	/** @type {Record<string, unknown>} */
	const out = {};
	if (d.description) out.description = d.description;
	if (d.default !== undefined) out.default = d.default;
	if (Array.isArray(d.allowed) && d.allowed.length) out.enum = d.allowed;
	else if (d.type === 'boolean' || d.type === 'number' || d.type === 'string') out.type = d.type;
	else if (/\[\]$|^Array</.test(d.type)) out.type = 'array';
	else if (/^'[^']*'( \| '[^']*')+$/.test(d.type))
		out.enum = d.type.split(' | ').map((/** @type {string} */ s) => s.slice(1, -1));
	else out.description = `${out.description ? `${out.description} ` : ''}(source type: ${d.type})`;
	return out;
}

/**
 * JSON Schema of a pattern's `configs` string once parsed: one property per config prop with its type,
 * allowed values, default and description, plus `ExtendedClass`. Lets an agent validate before `Create`.
 * @param {any} c manifest component
 */
export function configSchemaOf(c) {
	/** @type {Record<string, unknown>} */
	const properties = {};
	for (const [name, d] of Object.entries(c.props)) properties[name] = schemaPropOf(d);
	properties.ExtendedClass = {
		type: 'string',
		default: '',
		description: 'CSS classes added to the pattern root; always present, empty by default.',
	};
	return {
		$schema: 'https://json-schema.org/draft/2020-12/schema',
		$id: `https://github.com/OutSystems/outsystems-ui/docs-ai/schema/configs/${c.name}.schema.json`,
		title: `${c.name} configs`,
		description: `The configs JSON string of OutSystems.OSUI.Patterns.${c.name}API.Create, parsed. Invalid values fall back to the defaults at runtime; unknown properties are ignored. Generated by scripts/generate-ai-docs.mjs.`,
		type: 'object',
		properties,
		additionalProperties: false,
	};
}

/** Progressive compaction stages tried until a card fits the token budget. */
const CARD_STAGES = [
	{},
	{ markupChars: 300 },
	{ markupChars: 300, withCssApi: false },
	{ markupChars: 0, withCssApi: false },
	{ markupChars: 0, withCssApi: false, maxClasses: 10 },
	{ markupChars: 0, withCssApi: false, maxClasses: 6, withDescriptions: false },
];

/**
 * @param {any} c manifest component
 * @param {boolean} withDescriptions
 */
function renderCardProps(c, withDescriptions) {
	const props = Object.entries(c.props);
	if (props.length === 0) return ['Props: none besides ExtendedClass'];
	const lines = ['Props (configs JSON, always include "ExtendedClass": ""):'];
	for (const [name, d] of props) {
		let line = `- ${name}: ${d.type}`;
		if (d.default !== undefined) line += ` = ${JSON.stringify(d.default)}`;
		if (d.hint) line += ` (${d.hint})`;
		if (withDescriptions && d.description) line += ` — ${d.description}`;
		lines.push(line);
	}
	return lines;
}

/** @param {any} c */
function renderCardApi(c) {
	const lines = [`API (OutSystems.OSUI.Patterns.${c.name}API):`];
	for (const a of c.api) {
		const params = a.params.map((/** @type {any} */ p) => `${p.name}: ${shortType(p.type)}`).join(', ');
		const returns = shortType(a.returns);
		lines.push(`- ${a.name}(${params}): ${returns}`);
	}
	return lines;
}

/**
 * @param {any} c
 * @param {number} maxClasses
 */
function renderCardClasses(c, maxClasses) {
	const classes = Object.values(c.cssClasses);
	if (classes.length === 0) return [];
	const shown = classes.slice(0, maxClasses);
	const more = classes.length - shown.length;
	const suffix = more > 0 ? ` (+${more} more in osui.components.json)` : '';
	return [`CSS classes: ${shown.join(' ')}${suffix}`];
}

/**
 * @param {any} c
 * @param {number} markupChars
 */
function renderCardMarkup(c, markupChars) {
	if (!c.markup || markupChars <= 0) return [];
	const m = c.markup.length > markupChars ? `${c.markup.slice(0, markupChars)}…` : c.markup;
	return [`Markup skeleton (from ${c.story}): ${m}`];
}

/** @param {any} c */
function renderCard(c, { markupChars = 600, withCssApi = true, maxClasses = Infinity, withDescriptions = true } = {}) {
	const lines = [`## ${c.name}`, `Lifecycle: ${c.lifecycle}`, ...renderCardProps(c, withDescriptions)];
	if (c.events.length) lines.push(`Events (RegisterCallback eventName): ${c.events.join(', ')}`);
	lines.push(...renderCardApi(c), ...renderCardClasses(c, maxClasses));
	if (withCssApi && c.cssApi.length) lines.push(`CSS API: ${c.cssApi.join(' ')}`);
	if (c.schema) lines.push(`Configs schema: ${c.schema}`);
	lines.push(...renderCardMarkup(c, markupChars));
	return lines.join('\n');
}

/**
 * One reference card per pattern, each fitted to the token budget.
 * @param {ReturnType<typeof buildManifest>} manifest
 */
export function renderComponentCards(manifest) {
	const cards = Object.values(manifest.components).map((c) => {
		for (const opts of CARD_STAGES) {
			const card = renderCard(c, opts);
			if (countTokens(card) <= CARD_TOKEN_BUDGET) return card;
		}
		return renderCard(c, CARD_STAGES[CARD_STAGES.length - 1]);
	});
	return `# OutSystems UI — component reference cards\n\nOne card per pattern. Signatures, props, defaults and allowed values are generated from the TypeScript source; markup skeletons come from the Storybook stories that drive the compiled bundle exactly as the platform does.\n\n${cards.join('\n\n')}\n`;
}

/**
 * llms.txt — index and gotchas.
 * @param {ReturnType<typeof buildManifest>} manifest
 */
export function renderIndex(manifest) {
	const names = Object.keys(manifest.components);
	const rows = names.map((n) => {
		const c = manifest.components[n];
		return `- ${n}: ${Object.keys(c.props).length} props, ${c.events.length} events, ${c.api.length} API functions`;
	});
	return `# OutSystems UI (llms.txt)

> Browser-side TypeScript behaviours + SCSS for the OutSystems UI patterns (O11 Reactive/Mobile and ODC). The build emits one AMD bundle and one CSS bundle per platform (\`dist/<O11|ODC>.OutSystemsUI.{js,css}\`). Patterns are driven through the global namespace \`OutSystems.OSUI.Patterns.<Name>API\`; third-party providers (Flatpickr, Splide, noUiSlider, VirtualSelect, Floating UI) are loaded by the host app as window globals.

${SINGLE_THEME_SCOPE}

## Components (${names.length})
${rows.join('\n')}

## Read next
- llms-components.txt — per-pattern card: lifecycle, typed props with defaults/allowed values, events, API signatures, CSS classes, CSS API knobs, markup skeleton
- llms-tokens.txt — framework theme roles (--color-*, --border-radius-*) and every --osui-* component knob; legacy aliases are marked
- llms-utilities.txt — the utility grammar (<property>[-<side>][-<value>], the size scale, colour hues and shades) and every family as template rows with their declarations
- osui.utilities.json — every utility class with its declarations, variants and tokens, machine-readable (schema/osui.utilities.schema.json)
- llms-patterns.txt — CSS-only components (markup skeleton, knobs), layout partials (host-styled: never generate their markup) and helper classes, one group per tier
- osui.components.json — the same data, machine-readable (schema/osui.components.schema.json), plus a usage example per pattern (Create with every default, Initialize)
- schema/configs/<Name>.schema.json — JSON Schema of each pattern's configs string, to validate before Create

## Gotchas (read before generating)
1. A pattern root element needs \`name="<id>"\`; the runtime resolves it with \`getElementsByName\`. It must sit inside an element with \`[data-block]\` whose \`id\` becomes the pattern's \`widgetId\` (callbacks receive that id first).
2. Lifecycle: \`Create(id, configsJson)\` → \`RegisterCallback\` → \`Initialize(id)\`. Parents before children on Create/Initialize; children before parents on Dispose.
3. \`configs\` is a JSON *string*. Always include \`"ExtendedClass": ""\`; invalid values fall back to defaults silently.
4. Every runtime API function returns a JSON string envelope \`{ code, isSuccess, message, value? }\`; only \`Create\` throws (duplicate id).
5. Styling is token-based: override CSS custom properties (\`--color-primary\`, \`--border-radius-default\`, \`--osui-card-padding\`), never component rules. Dark mode = class \`os-dark-theme\` on \`<html>\`.
6. Responsiveness is class-driven: the runtime sets \`phone\`, \`tablet\` or \`desktop\` (and \`landscape\`/\`portrait\`) on \`<body>\`; write \`.phone .card { … }\` rather than media queries.
7. Utility classes follow \`<property>[-<side>][-<value>]\` in long form (\`margin-top-base\`, \`display-flex\`, \`justify-content-space-between\`); Tailwind-style short names do not exist. The grammar and the size scale are in llms-utilities.txt, every class with its CSS in osui.utilities.json.
8. Logical CSS properties are the default (\`padding-inline-start\`, not \`padding-left\`); RTL is handled by the framework.
9. Load one card from llms-components.txt per pattern you use (about 450 tokens each). Never load the compiled typings (dist/*.d.ts, about 53k tokens): the cards carry the same contract with defaults, allowed values and markup.
`;
}

/**
 * Classic-compatible aliases in the theme layer. They predate the token migration and survive
 * for three runtime readers only (`GetColorValueFromColorType`, `GetBorderRadiusValueFromShapeType`,
 * Gallery `ItemsGap`); no component SCSS reads them.
 */
export const LEGACY_ALIAS = /^--(color-neutral(-\d+)?|color-<color>|space-<type>|border-radius-(none|soft|rounded))$/;

export const SINGLE_THEME_SCOPE =
	'Scope: OutSystems UI ships a single token-based theme (light, plus the generated dark mode under class os-dark-theme on <html>). The pre-migration "classic" CSS snapshot under classic-theme/ is a Storybook comparison artifact, not a target for generated code.';

/**
 * Theme-layer custom properties declared in `_root.scss`: literal declarations (`--color-text: …`) and
 * `@each`-generated families (`--color-#{$color}: …` → `--color-<color>`), in source order.
 * @param {string} rootScss
 */
export function themeRolesOf(rootScss) {
	/** @type {Set<string>} */
	const roles = new Set();
	/** @type {Set<string>} */
	const generated = new Set();
	for (const line of rootScss.split('\n')) {
		const t = line.trim();
		if (!t.startsWith('--')) continue;
		const colon = t.indexOf(':');
		if (colon < 0) continue;
		const name = t.slice(0, colon).trim();
		const interp = name.indexOf('#{$');
		if (interp < 0) {
			roles.add(name);
			continue;
		}
		const close = name.indexOf('}', interp);
		if (close < 0) continue;
		const variable = name.slice(interp + '#{$'.length, close);
		generated.add(`${name.slice(0, interp)}<${variable}>`);
	}
	return { roles: [...roles], generated: [...generated] };
}

/**
 * llms-tokens.txt — theme roles and component knobs.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {ReturnType<typeof buildManifest>} manifest
 */
export function renderTokens(ctx, manifest) {
	const rootScss = ctx.readText(path.join(ctx.root, 'src', 'scss', '01-foundations', '_root.scss'));
	const { roles, generated } = themeRolesOf(rootScss);
	const legacyNote =
		' — legacy alias kept for GetColorValueFromColorType / GetBorderRadiusValueFromShapeType / Gallery ItemsGap; prefer --osui-* knobs or --token-*';
	const roleLine = (/** @type {string} */ r, /** @type {string} */ suffix = '') =>
		`- ${r}${suffix}${LEGACY_ALIAS.test(r) ? legacyNote : ''}`;
	const lines = [
		'# OutSystems UI — theming surface',
		'',
		SINGLE_THEME_SCOPE,
		'',
		'Read chain: property → var(--osui-{component}-{prop}) → var(--{role}) → $token-* → var(--token-*, fallback).',
		'Override variables only. App/theme: set roles or --token-* at :root (dark: class os-dark-theme on <html>). Instance: set an --osui-* knob inline or in a class.',
		'',
		'## Framework theme roles (src/scss/01-foundations/_root.scss)',
		...roles.map((r) => roleLine(r)),
		...generated.map((g) => roleLine(g, ' (generated per family)')),
		'',
		'## Component CSS API knobs (--osui-*)',
	];
	for (const c of Object.values(manifest.components)) {
		if (c.cssApi.length) lines.push(`- ${c.name}: ${c.cssApi.join(' ')}`);
	}
	for (const c of ctx.inventory.cssComponents) {
		if (c.kind === 'utility') continue; // helper classes and utility families expose no knobs
		const knobs = knobsOf(ctx.compiledCss(c.scssFile).css);
		if (knobs.length) lines.push(`- ${c.name}: ${knobs.join(' ')}`);
	}
	return `${lines.join('\n')}\n`;
}

/** The three groups of llms-patterns.txt, by tier, with what an agent may do with each. */
const CSS_GROUPS = [
	{
		tier: 'component',
		title: 'Components',
		intro: 'CSS-only components: no TypeScript behaviour. Emit the markup and classes below and the compiled stylesheet does the rest. Skeletons come from the Storybook stories; `--osui-*` knobs are the per-instance overrides. A component marked **host-styled** is a layer another pattern creates (a balloon): adjust it through its knobs only.',
	},
	{
		tier: 'layout',
		title: 'Layout partials (host-styled)',
		intro: 'They style markup that something else emits: the app template Layout and Menu blocks, the Login common screen or the platform runtime. Never generate that markup: place content in the host placeholders and adjust the look through the knobs listed.',
	},
	{
		tier: 'utility',
		title: 'Helper classes',
		intro: 'Single-purpose classes applied to any element: no anatomy, no knobs, nothing to generate but the class itself. The utility families (spacing, display, colours, typography, …) are in llms-utilities.txt.',
	},
];

/**
 * One entry of llms-patterns.txt: a host-styled note, a skeleton from the story, or the helper's classes.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {import('../../evals/lib/inventory.mjs').CssComponent} c
 * @param {Set<string>} seenStories stories already rendered (sub-components share their parent's)
 * @returns {string[]} lines, empty when the component has nothing to show
 */
function cssComponentEntry(ctx, c, seenStories) {
	const css = ctx.compiledCss(c.scssFile).css ?? '';
	const knobs = knobsOf(css);
	const knobLine = knobs.length ? [`CSS API: ${knobs.join(' ')}`] : [];
	const heading = `### ${c.name} (${ctx.rel(c.scssFile)})`;
	if (c.kind === 'utility') {
		const classes = classNamesOf(css).slice(0, 12);
		return [heading, `Classes: ${classes.join(' ')}`, ...knobLine, ''];
	}
	if (c.host) {
		return [
			`${heading} — host-styled`,
			`Markup emitted by: ${c.host.host}. ${c.host.reason}. Do not generate this markup.`,
			...knobLine,
			'',
		];
	}
	if (c.kind === 'layout') {
		// a layout partial without a declared host: its classes are applied to the template's containers
		const classes = classNamesOf(css).slice(0, 12);
		return [
			heading,
			`Layout classes applied to the app template's containers: ${classes.join(' ')}`,
			...knobLine,
			'',
		];
	}
	if (!c.storyFile || seenStories.has(c.storyFile)) return [];
	seenStories.add(c.storyFile);
	const m = measureStory(ctx.readText(c.storyFile));
	if (!m.html) return [];
	const skeleton = cleanMarkup(m.html).slice(0, 700);
	return [heading, `Skeleton (from ${ctx.rel(c.storyFile)}): ${skeleton}`, ...knobLine, ''];
}

/**
 * llms-patterns.txt — the CSS-only components by tier: components (skeleton and knobs), layout
 * partials (host-styled, never generated) and helper classes (class names only).
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 */
export function renderCssComponents(ctx) {
	const lines = [
		'# OutSystems UI — CSS-only components, layout partials and helper classes',
		'',
		'Three tiers of styles without TypeScript behaviour, each with a different contract. Read the group intro before using its entries.',
		'',
	];
	/** @type {Set<string>} */
	const seen = new Set();
	// the utility families of 05-useful are documented in llms-utilities.txt, not here
	const components = ctx.inventory.cssComponents.filter((c) => c.source !== 'useful');
	for (const group of CSS_GROUPS) {
		lines.push(`## ${group.title}`, '', group.intro, '');
		for (const c of components.filter((x) => x.kind === group.tier)) lines.push(...cssComponentEntry(ctx, c, seen));
	}
	return `${lines.join('\n')}\n`;
}

/**
 * A whole value of the form `var(--name)` or `var(--name, fallback)`, split without a regular
 * expression: the token name and the fallback text (null without one); null when the value is anything
 * else. The fallback may itself be a `var(…)` chain.
 * @param {string} value
 * @returns {{ token: string, fallback: string|null }|null}
 */
export function parseVarChain(value) {
	const v = value.trim();
	if (!v.startsWith('var(') || !v.endsWith(')')) return null;
	const inner = v.slice(4, -1);
	const comma = inner.indexOf(',');
	const token = (comma === -1 ? inner : inner.slice(0, comma)).trim();
	if (!/^--[\w-]+$/.test(token)) return null;
	// the closing parenthesis must be the one that ends the outer var(): the fallback is balanced
	let depth = 0;
	for (const ch of inner) {
		if (ch === '(') depth++;
		else if (ch === ')') {
			depth--;
			if (depth < 0) return null;
		}
	}
	if (depth !== 0) return null;
	const fallback = comma === -1 ? null : inner.slice(comma + 1).trim();
	return { token, fallback: fallback || null };
}

/**
 * A CSS value for a text row: a token chain shows the token it reads and the literal it falls back to
 * (`var(--token-border-radius-0, var(--token-scale-0, 0px))` → `--token-border-radius-0 (0px)`); any
 * other long value is cut. The full value is in osui.utilities.json.
 * @param {string} value
 */
function shortValue(value) {
	const chain = parseVarChain(value);
	if (chain) {
		let fallback = chain.fallback;
		for (
			let inner = fallback ? parseVarChain(fallback) : null;
			inner;
			inner = fallback ? parseVarChain(fallback) : null
		) {
			fallback = inner.fallback;
		}
		return fallback ? `${chain.token} (${fallback})` : chain.token;
	}
	return value.length > 64 ? `${value.slice(0, 61)}…` : value;
}

const MAX_DECLS = 4;

/** `prop: value; prop: value`, capped. @param {import('../../evals/lib/utilities.mjs').Declaration[]} decls */
function declText(decls) {
	const shown = decls
		.slice(0, MAX_DECLS)
		.map((d) => `${d.prop}: ${shortValue(d.value)}${d.important ? ' !important' : ''}`);
	const more = decls.length - shown.length;
	return `${shown.join('; ')}${more > 0 ? ` (+${more} more in osui.utilities.json)` : ''}`;
}

/**
 * A row for one class: its plain declarations, else its first variant with the context it applies in.
 * @param {import('../../evals/lib/utilities.mjs').UtilityClass} c
 */
function singletonRow(c) {
	const legacy = classifyName(c.name).conformant ? '' : ' [legacy name]';
	if (c.declarations.length) return `- ${c.name} → ${declText(c.declarations)}${legacy}`;
	const v = c.variants[0];
	return v ? `- ${c.name} → [${v.context}] ${declText(v.declarations)}${legacy}` : `- ${c.name}${legacy}`;
}

/**
 * A row for a template group: the key with its placeholders, the properties it sets, the values the
 * placeholders take. `margin-{side}-{step}` stands for 48 classes.
 * @param {import('../../evals/lib/utilities.mjs').TemplateGroup} g
 */
function templateRow(g) {
	const parts = [];
	if (g.sides.length) parts.push(`side: ${g.sides.join(' ')}`);
	if (g.steps.length) parts.push(`step: ${g.steps.join(' ')}`);
	if (g.hues.length) parts.push(`hue: ${g.hues.join(' ')}`);
	if (g.shades.length) parts.push(`shade: ${g.shades.join(' ')}`);
	if (g.radii.length) parts.push(`radius: ${g.radii.join(' ')}`);
	if (g.aligns.length) parts.push(`align: ${g.aligns.join(' ')}`);
	if (g.ns.length) parts.push(`n: ${g.ns.join(' ')}`);
	const props = g.props.length ? g.props.join(' | ') : '(variants only)';
	return `- ${g.key} → ${props} (${parts.join('; ')}; ${g.members.length} classes)`;
}

/** `xs = --token-scale-100 (4px)` per step, from the plain classes of a head. @param {Record<string, { value: string, token: string|null }>} steps */
function stepsLine(steps) {
	return Object.entries(steps)
		.map(([step, s]) => {
			const chain = parseVarChain(s.value);
			const fallback = chain?.fallback && !chain.fallback.startsWith('var(') ? ` (${chain.fallback})` : '';
			return s.token ? `${step} = ${s.token}${fallback}` : `${step} = ${s.value}`;
		})
		.join(' · ');
}

/**
 * llms-utilities.txt — the utility grammar first, then every family as template rows (a placeholder
 * per variable segment) and single rows with their declarations. Generated from the compiled partials
 * through the same reader the utilities suite measures, so U04 checks this file covers every class.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 */
export function renderUtilities(ctx) {
	const families = utilityFamilies(ctx).filter((f) => !f.error);
	const all = families.flatMap((f) => f.classes);
	const margin = families.find((f) => f.name === 'space-margin');
	const hues = HUES.filter((h) => all.some((c) => c.name === `background-${h}` || c.name === `text-${h}`));
	const legacy = all.filter((c) => !classifyName(c.name).conformant).map((c) => c.name);
	const lines = [
		'# OutSystems UI — utility classes',
		'',
		SINGLE_THEME_SCOPE,
		'',
		`${all.length} classes in ${families.length} families, generated from src/scss/05-useful and the design tokens. Machine-readable, with every declaration: osui.utilities.json (schema/osui.utilities.schema.json).`,
		'',
		'## Grammar',
		'',
		'- Name: <property>[-<side>][-<value>], long-form, no abbreviations (margin-top-base, display-flex, justify-content-space-between). Tailwind-style short names (p-4, mt-2) do not exist.',
		`- Property heads: ${GRAMMAR_HEADS.join(' ')}.`,
		'- Sides: top bottom left right (left/right compile to the logical inline-start/inline-end) · x = inline · y = block.',
		`- Steps, the size scale: ${STEPS.join(' ')}. Values: ${margin ? stepsLine(stepValues(margin.classes, 'margin')) : 'see the spacing family'}.`,
		`- Colours: background-<hue>[-<shade>] and text-<hue>[-<shade>]; hues: ${hues.join(' ')}; shades: ${SHADES.join(' ')} (no suffix = base). Neutrals are numbered: background-neutral-<0..10>[-lightest], text-neutral-<0..10>[-darker].`,
		'- Responsive: no prefixes. The runtime sets phone / tablet / desktop on <body>; write `.phone .x { … }` for a viewport rule. Only phone-full-width and tablet-full-width ship as viewport helpers.',
		'- A row with {placeholders} stands for every combination of the listed values (margin-{side}-{step} → margin-top-xs, margin-x-base, …). A row without braces is one class. [legacy name] marks a name outside the grammar.',
		'',
	];
	for (const f of families) {
		const groups = templateGroups(f.classes);
		const templates = groups.filter((g) => g.template).sort((a, b) => b.members.length - a.members.length);
		const singles = groups.filter((g) => !g.template).flatMap((g) => g.members);
		lines.push(`## ${f.title} (${f.classes.length} classes; ${f.file})`, '');
		for (const g of templates) lines.push(templateRow(g));
		for (const c of singles) lines.push(singletonRow(c));
		lines.push('');
	}
	lines.push(
		`## Legacy names (${legacy.length})`,
		'',
		'Names outside the grammar, kept for compatibility; their effect is in their family row above. Prefer the grammar form when one exists (display-none over hidden, font-bold over bold).',
		'',
		legacy.join(' '),
		''
	);
	return `${lines.join('\n')}\n`;
}

/**
 * osui.utilities.json — every utility class with its declarations, variants and tokens, plus the
 * grammar, machine-readable.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 */
export function buildUtilitiesManifest(ctx) {
	return {
		$schema: './schema/osui.utilities.schema.json',
		version: MANIFEST_VERSION,
		source: 'scripts/generate-ai-docs.mjs',
		grammar: {
			pattern: '<property>[-<side>][-<value>]',
			heads: [...GRAMMAR_HEADS],
			sides: [...SIDES],
			steps: [...STEPS],
			shades: [...SHADES],
			hues: [...HUES],
		},
		families: utilityFamilies(ctx).map((f) => ({
			name: f.name,
			title: f.title,
			file: f.file,
			classes: f.classes.map((c) => ({
				name: c.name,
				conformant: classifyName(c.name).conformant,
				template: templateKey(c.name),
				declarations: c.declarations,
				variants: c.variants,
				tokens: c.tokens,
			})),
		})),
	};
}

/**
 * Write the whole docs set.
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 * @param {string} outDir
 */
export function writeDocs(ctx, outDir) {
	const manifest = buildManifest(ctx);
	fs.mkdirSync(outDir, { recursive: true });
	const files = {
		'osui.components.json': `${JSON.stringify(manifest, null, '\t')}\n`,
		'llms.txt': renderIndex(manifest),
		'llms-components.txt': renderComponentCards(manifest),
		'llms-tokens.txt': renderTokens(ctx, manifest),
		'llms-utilities.txt': renderUtilities(ctx),
		'osui.utilities.json': `${JSON.stringify(buildUtilitiesManifest(ctx), null, '\t')}\n`,
		...Object.fromEntries(
			Object.values(manifest.components).map((c) => [
				c.schema,
				`${JSON.stringify(configSchemaOf(c), null, '\t')}\n`,
			])
		),
		'llms-patterns.txt': renderCssComponents(ctx),
	};
	fs.mkdirSync(insideDir(outDir, 'schema', 'configs'), { recursive: true });
	for (const [name, text] of Object.entries(files)) fs.writeFileSync(insideDir(outDir, ...name.split('/')), text);
	return Object.keys(files).map((f) => path.join(outDir, ...f.split('/')));
}
