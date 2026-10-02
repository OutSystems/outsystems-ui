// @ts-check
/**
 * Block-level agent documentation for OML producers (the Model bridge):
 *   docs-ai/osui.blocks.json   one entry per public OutSystems UI block: signature from the snapshot, the
 *                              runtime pattern it drives and the parameter map (crosswalk), two recipes
 *   docs-ai/llms-blocks.txt    one card per block (≤ 250 tokens): purpose, params, slots, events, recipes
 *   docs-ai/osui.enums.json    the static entities block parameters take, with their values
 * Derived from evals/model/osui.blocks*.json and evals/components.json with the readers the model suite uses.
 */
import { registry } from '../../evals/lib/registry.mjs';
import { countTokens } from '../../evals/lib/tokens.mjs';
import { linksFor, patternOfBlock } from '../../evals/model/lib/crosswalk.mjs';
import { flattenBlocks, publicBlocks } from '../../evals/model/lib/snapshot.mjs';

export const BLOCK_CARD_BUDGET = 250;
const SHOWN_PARAMS = 3;
const STAGES = 5;

/** Explicit, locale-independent string order. @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/** @param {any} ctx */
const registryOf = (ctx) => ctx.registryOverride ?? registry();

/**
 * @param {import('../../evals/lib/context.mjs').EvalContext & { registryOverride?: any }} ctx
 */
export function buildBlocksManifest(ctx) {
	const snapshots = ctx.modelSnapshots();
	const reg = registryOf(ctx);
	const patterns = ctx.inventory.patterns.map((p) => p.name);
	const rows = publicBlocks(flattenBlocks(snapshots));
	/** @type {Record<string, any>} */
	const blocks = {};
	for (const b of rows) {
		const snapshot = snapshots.find((s) => s.source.platform === b.platform);
		const { pattern, source } = patternOfBlock(b, patterns, reg);
		const link = pattern ? linksFor(pattern, reg, rows).find((l) => l.key === b.key) : undefined;
		const entry = {
			key: b.key,
			label: b.label,
			flow: b.flow,
			name: b.name,
			platform: b.platform,
			public: b.public,
			description: b.description,
			params: b.inputParameters.map((p) => {
				const records =
					p.typeKind === 'staticEntity' && p.typeRef
						? snapshot?.staticEntities[p.typeRef]?.records
						: undefined;
				return records ? { ...p, values: records.map((r) => r.identifier) } : { ...p };
			}),
			placeholders: b.placeholders,
			events: b.events,
			pattern,
			patternSource: source,
			hints: b.patternHints.apiCalls,
			paramMap: link?.paramMap ?? {},
			platformOnly: link?.platformOnly ?? [],
			eventMap: link?.eventMap ?? {},
			recipes: { openui: '', tsx: '' },
		};
		entry.recipes = recipesFor(entry);
		blocks[b.label] = entry;
	}
	const sorted = Object.fromEntries(Object.entries(blocks).sort(([a], [b]) => byCodePoint(a, b)));
	return {
		$schema: null,
		version: '1',
		source: 'scripts/generate-ai-docs.mjs',
		snapshots: snapshots.map((s) => ({
			platform: s.source.platform,
			module: s.source.module,
			moduleVersion: s.source.moduleVersion ?? null,
			origin: s.source.origin ?? null,
		})),
		blocks: sorted,
	};
}

/** The parameters a recipe shows: mandatory first, then optional, three at most. @param {any[]} params */
function shownParams(params) {
	const mandatory = params.filter((p) => p.mandatory);
	const optional = params.filter((p) => !p.mandatory);
	return [...mandatory, ...optional].slice(0, Math.max(SHOWN_PARAMS, mandatory.length));
}

/** The expression text a recipe writes for a parameter. @param {any} p */
export function recipeValue(p) {
	if (p.default) return p.default;
	if (p.typeKind === 'staticEntity' && p.typeRef)
		return p.values?.length ? `Entities.${p.typeRef}.${p.values[0]}` : '…';
	if (p.typeKind === 'basic') {
		if (p.type === 'Text') return '""';
		if (p.type === 'Boolean') return 'False';
		return '0';
	}
	return '…';
}

/**
 * @param {any} block manifest entry
 * @param {{ mandatoryOnly?: boolean }} [options] the compact form keeps only the required parameters
 */
export function recipesFor(block, { mandatoryOnly = false } = {}) {
	const id = `_${block.name}1`;
	const params = mandatoryOnly
		? block.params.filter((/** @type {any} */ p) => p.mandatory)
		: shownParams(block.params);
	const openuiArgs = [
		`SourceBlock: ${block.key}`,
		...params.map((p) => `${p.name}: ${recipeValue(p)}`),
		...block.placeholders.map((/** @type {any} */ ph) => `${ph.name}: [_${ph.name}1]`),
	];
	const tsxProps = [
		`id={"${id}"}`,
		`data-source={"${block.key}"}`,
		...params.map((p) => `${p.name}={${recipeValue(p)}}`),
		...block.placeholders.map((/** @type {any} */ ph) => `${ph.name}={<>…</>}`),
	];
	return {
		openui: `${id} = Block(${openuiArgs.join(', ')})`,
		tsx: `<${block.name} ${tsxProps.join(' ')} />`,
	};
}

/** First sentence of a description, whitespace collapsed. @param {string} text */
export function firstSentence(text) {
	const t = text.split(/\s+/).filter(Boolean).join(' ');
	const dot = t.indexOf('. ');
	return dot === -1 ? t : t.slice(0, dot + 1);
}

/** @param {string} text */
const collapsed = (text) => text.split(/\s+/).filter(Boolean).join(' ');

/**
 * One card. Stages: 0 full · 1 first-sentence descriptions · 2 no enum values · 3 no param map ·
 * 4 names and types only (no parameter, slot or event descriptions) · 5 no purpose line and recipes with
 * the required parameters only. Names are never dropped.
 * @param {any} b manifest entry
 * @param {number} [stage]
 */
export function renderBlockCard(b, stage = 0) {
	const desc = (/** @type {string} */ s) => (stage >= 1 ? firstSentence(s) : collapsed(s));
	const withDescriptions = stage < 4;
	/** ` — description` when the stage keeps descriptions and there is one, else nothing. */
	const tail = (/** @type {string|undefined} */ s) => (withDescriptions && s ? ` — ${desc(s)}` : '');
	const lines = [`## ${b.label ?? b.key}`];
	if (b.description && stage < 5) lines.push(`Purpose: ${desc(b.description)}`);
	lines.push(b.params.length ? 'Params:' : 'Params: none');
	for (const p of b.params) lines.push(paramLine(p, stage) + tail(p.description));
	if (b.placeholders.length) {
		const slots = b.placeholders.map((/** @type {any} */ ph) => ph.name + tail(ph.description));
		lines.push(`Slots: ${slots.join(' · ')}`);
	}
	if (b.events.length) {
		const events = b.events.map((/** @type {any} */ e) => eventSignature(e) + tail(e.description));
		lines.push(`Events: ${events.join(' · ')}`);
	}
	if (b.pattern) lines.push(patternLine(b, stage));
	const recipes = stage >= 5 ? recipesFor(b, { mandatoryOnly: true }) : b.recipes;
	lines.push(`OpenUI: ${recipes.openui}`, `TSX: ${recipes.tsx}`);
	return lines.join('\n');
}

/** The card line of one parameter without its description. @param {any} p @param {number} stage */
function paramLine(p, stage) {
	let line = `- ${p.name}: ${p.type}${p.mandatory ? ' (required)' : ''}`;
	if (p.default) line += ` = ${p.default}`;
	if (stage < 2 && p.values?.length && p.values.length <= 8) line += ` [${p.values.join(', ')}]`;
	return line;
}

/** `Name(param: Type, …)`. @param {any} e */
function eventSignature(e) {
	const payload = e.parameters.map((/** @type {any} */ p) => `${p.name}: ${p.type}`).join(', ');
	return `${e.name}(${payload})`;
}

/** The runtime-pattern line, with the parameter map until stage 3. @param {any} b @param {number} stage */
function patternLine(b, stage) {
	const map = Object.entries(b.paramMap).map(([k, v]) => `${k}→${v}`);
	const mapTail = stage < 3 && map.length ? ` · ${map.join(', ')}` : '';
	return `Runtime pattern: ${b.pattern} (llms-components.txt)${mapTail}`;
}

/** @param {ReturnType<typeof buildBlocksManifest>} manifest */
export function renderBlockCards(manifest) {
	const cards = Object.values(manifest.blocks).map((b) => {
		for (let stage = 0; stage <= STAGES; stage++) {
			const card = renderBlockCard(b, stage);
			if (countTokens(card) <= BLOCK_CARD_BUDGET) return card;
		}
		return renderBlockCard(b, STAGES);
	});
	const sources = manifest.snapshots
		.map((s) => [s.module, s.platform, s.moduleVersion].filter(Boolean).join(' '))
		.join(', ');
	const intro = manifest.snapshots.length
		? `One card per public OutSystems UI block, from the OML (${sources}). Compose blocks with these signatures; never emit a pattern's markup or lifecycle calls — the block does that. Values for an \`<Entity> Identifier\` come from osui.enums.json; classes for ExtendedClass from llms-utilities.txt.`
		: 'No block snapshot is present under evals/model; export one with osui-blocks-export (see evals/model/README.md).';
	return `# OutSystems UI — block reference cards (OML producers)\n\n${intro}\n\n${cards.join('\n\n')}\n`;
}

/**
 * @param {import('../../evals/lib/context.mjs').EvalContext} ctx
 */
export function buildEnumsManifest(ctx) {
	const snapshots = ctx.modelSnapshots();
	/** @type {Record<string, { description: string, values: { identifier: string, label: string }[], usedBy: string[] }>} */
	const out = {};
	for (const s of snapshots) {
		for (const [key, block] of Object.entries(s.blocks)) {
			for (const p of block.inputParameters) {
				if (p.typeKind !== 'staticEntity' || !p.typeRef) continue;
				const entity = s.staticEntities[p.typeRef];
				const entry = out[p.typeRef] ?? {
					description: entity?.description ?? '',
					values: (entity?.records ?? []).map((r) => ({ identifier: r.identifier, label: r.label })),
					usedBy: [],
				};
				if (!entry.usedBy.includes(`${key}.${p.name}`)) entry.usedBy.push(`${key}.${p.name}`);
				out[p.typeRef] = entry;
			}
		}
	}
	for (const e of Object.values(out)) e.usedBy.sort(byCodePoint);
	return Object.fromEntries(Object.entries(out).sort(([a], [b]) => byCodePoint(a, b)));
}
