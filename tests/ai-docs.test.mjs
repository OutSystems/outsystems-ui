import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../evals/lib/context.mjs';
import { expectationsFor } from '../evals/lib/expectations.mjs';
import { componentFacets } from '../evals/lib/manifest.mjs';
import { countTokens } from '../evals/lib/tokens.mjs';
import { isMarked, isRuntimeOnlyLine, PRODUCERS_HEADING, RUNTIME_GOTCHA_NEEDLES } from '../evals/lib/producers.mjs';
import { docCoverage, utilityFamilies } from '../evals/lib/utilities.mjs';
import { buildBlocksManifest } from '../scripts/lib/ai-docs-blocks.mjs';
import {
	buildManifest,
	buildUtilitiesManifest,
	CARD_TOKEN_BUDGET,
	configSchemaOf,
	parseVarChain,
	renderComponentCards,
	renderCssComponents,
	renderIndex,
	renderTokens,
	renderUtilities,
	resolveEnumReference,
	writeDocs,
} from '../scripts/lib/ai-docs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = createContext(root);
const manifest = buildManifest(ctx);

test('manifest is versioned and has one entry per public pattern', () => {
	assert.equal(manifest.version, '1');
	assert.deepEqual(
		Object.keys(manifest.components).sort(),
		ctx.inventory.patterns.map((p) => p.name)
	);
});

test('every prop carries a type; stringly-typed enums get their allowed values and resolved default', () => {
	for (const [name, c] of Object.entries(manifest.components)) {
		for (const [prop, def] of Object.entries(c.props)) {
			assert.ok(typeof def.type === 'string' && def.type.length > 0, `${name}.${prop} has no type`);
		}
	}
	const icon = manifest.components.AccordionItem.props.Icon;
	assert.deepEqual(icon.allowed, ['Caret', 'Custom', 'PlusMinus'], 'enum members in source order');
	assert.equal(icon.default, 'Caret');
	assert.equal(icon.type, "'Caret' | 'Custom' | 'PlusMinus'");
	assert.equal(manifest.components.Accordion.props.MultipleItems.default, false);
	assert.equal(manifest.components.Accordion.props.MultipleItems.type, 'boolean');
	// GlobalEnum defaults are a hint, not a fabricated allowed-list: the source never validates the value
	const pos = manifest.components.AccordionItem.props.IconPosition;
	assert.equal(pos.type, 'string');
	assert.equal(pos.default, 'right');
	assert.equal(pos.allowed, undefined);
	assert.match(pos.hint, /GlobalEnum\.Direction/);
	// validateInRange(value, default, ...allowed): the default is always accepted
	const orientation = manifest.components.Tabs.props.TabsOrientation;
	assert.deepEqual(orientation.allowed, ['horizontal', 'vertical']);
	assert.equal(orientation.type, "'horizontal' | 'vertical'");
});

test('resolveEnumReference maps enum member paths to their literal values', () => {
	const pattern = ctx.inventory.patterns.find((p) => p.name === 'AccordionItem');
	assert.equal(resolveEnumReference(ctx, pattern, 'Enum.IconType.Caret'), 'Caret');
	assert.equal(resolveEnumReference(ctx, pattern, 'GlobalEnum.Direction.Right'), 'right');
	assert.equal(resolveEnumReference(ctx, pattern, "'plain'"), 'plain');
	assert.equal(resolveEnumReference(ctx, pattern, 'false'), false);
	assert.equal(resolveEnumReference(ctx, pattern, '3'), 3);
	assert.equal(resolveEnumReference(ctx, pattern, 'Enum.Nope.X'), null);
});

test('api entries carry parameters, return type and description; lifecycle order is stated', () => {
	const create = manifest.components.Accordion.api.find((a) => a.name === 'Create');
	assert.deepEqual(
		create.params.map((p) => p.name),
		['accordionId', 'configs']
	);
	assert.match(create.returns, /IAccordion/);
	assert.ok(create.description.length > 0);
	assert.match(manifest.components.Accordion.lifecycle, /Create.*Initialize/);
});

test('events, css classes, css api knobs and a markup skeleton are present where the source declares them', () => {
	const item = manifest.components.AccordionItem;
	assert.deepEqual(item.events, ['OnToggle']);
	assert.equal(item.cssClasses.PatternContent, 'osui-accordion-item__content');
	assert.ok(item.cssApi.some((k) => k.startsWith('--osui-accordion-item-')));
	assert.match(item.markup, /osui-accordion-item__title/);
	assert.ok(!/\$\{/.test(item.markup), 'interpolations are stripped');
	assert.ok(item.markup.length <= 1500, 'skeletons are capped');
});

test('generated docs score ≥ 90 on E03 for every pattern (generator and eval agree)', () => {
	for (const p of ctx.inventory.patterns) {
		const r = componentFacets(manifest, p.name, expectationsFor(ctx, p));
		assert.ok(r.score >= 0.9, `${p.name}: ${JSON.stringify(r.facets)}`);
	}
});

test('component cards stay within the token budget and cover every pattern', () => {
	const cards = renderComponentCards(manifest);
	const sections = cards.split(/^## /m).slice(1);
	assert.equal(sections.length, ctx.inventory.patterns.length);
	for (const s of sections) {
		const tokens = countTokens(`## ${s}`);
		assert.ok(tokens <= CARD_TOKEN_BUDGET, `${s.split('\n')[0]} card is ${tokens} tokens`);
	}
	assert.match(
		cards,
		/Create\(accordionId: string, configs: string \| Configs\): IAccordion\b/,
		'namespace prefixes are abbreviated and Create names the generated Configs type'
	);
});

test('CSS-only document groups components, layout partials and helper classes by tier', () => {
	const doc = renderCssComponents(ctx);
	const groups = doc.split(/^## /m).slice(1);
	assert.deepEqual(
		groups.map((g) => g.split('\n')[0]),
		['Components', 'Layout partials (host-styled)', 'Helper classes']
	);
	const [components, layout, helpers] = groups;
	assert.match(
		components,
		/^### card \(src\/scss\/04-patterns\/02-content\/_card\.scss\)\n\[runtime-only\] Skeleton \(from stories\/Card\.stories\.ts\)/m
	);
	assert.match(components, /^### balloon .* — host-styled/m, 'a layer another pattern creates stays a component');
	assert.match(components, /^### section \(src\/scss\/04-patterns/m);
	assert.match(
		layout,
		/^### header \(src\/scss\/02-layout\/_header\.scss\) — host-styled\nMarkup emitted by: app template Layout blocks/m
	);
	assert.match(layout, /^### layout-section \(src\/scss\/02-layout\/_section\.scss\)/m);
	assert.doesNotMatch(layout, /Skeleton \(from/, 'layout partials show no skeleton to generate');
	assert.match(
		helpers,
		/^### align-center \(src\/scss\/04-patterns\/06-utilities\/_align-center\.scss\)\nClasses: /m
	);
	assert.match(helpers, /^### animate .*\nClasses: .*animate/m);
	assert.doesNotMatch(helpers, /Do not generate/, 'a helper class has no host: nothing emits its markup');
	assert.doesNotMatch(doc, /space-margin|05-useful/, 'utility families belong to llms-utilities.txt');
});

test('every pattern gets a configs JSON Schema and a usage example, and its card points at them', () => {
	const accordion = manifest.components.Accordion;
	assert.equal(accordion.schema, 'schema/configs/Accordion.schema.json');
	assert.deepEqual(accordion.usage.configs, { MultipleItems: false, ExtendedClass: '' });
	assert.equal(
		accordion.usage.create,
		'OutSystems.OSUI.Patterns.AccordionAPI.Create("accordion1", "{\\"MultipleItems\\":false,\\"ExtendedClass\\":\\"\\"}")'
	);
	assert.equal(accordion.usage.initialize, 'OutSystems.OSUI.Patterns.AccordionAPI.Initialize("accordion1")');
	const schema = configSchemaOf(accordion);
	assert.equal(schema.type, 'object');
	assert.equal(schema.additionalProperties, false);
	assert.deepEqual(schema.properties.MultipleItems, {
		description: 'Allows several items to be expanded at once; when false, expanding an item collapses the others.',
		default: false,
		type: 'boolean',
	});
	assert.deepEqual(schema.properties.ExtendedClass.default, '');
	const item = configSchemaOf(manifest.components.AccordionItem);
	assert.deepEqual(item.properties.Icon.enum, ['Caret', 'Custom', 'PlusMinus']);
	assert.equal(item.properties.Icon.default, 'Caret');
	const picker = configSchemaOf(manifest.components.DatePicker);
	assert.match(
		picker.properties.OnChange.description,
		/source type: .*Generic/,
		'a callback type stays open and is described'
	);
	assert.match(renderComponentCards(manifest), /^Configs schema: schema\/configs\/Accordion\.schema\.json/m);
});

test('utilities document states the grammar, then every family as template rows with declarations', () => {
	const doc = renderUtilities(ctx);
	assert.match(doc, /^## Grammar/m);
	assert.match(doc, /Name: <property>\[-<side>\]\[-<value>\]/);
	assert.match(
		doc,
		/none = --token-scale-0 \(0px\) · xs = --token-scale-100 \(4px\)/,
		'the size scale resolves each step to its token and fallback'
	);
	assert.match(doc, /^## Spacing · margin \(\d+ classes; src\/scss\/05-useful\/_space-margin\.scss\)/m);
	assert.match(
		doc,
		/^- margin-\{side\}-\{step\} → margin-block-start \| .*\(side: top bottom left right x y; step: none xs s base m l xl xxl; 48 classes\)/m
	);
	assert.match(doc, /^- margin-auto → margin-block: 0; margin-inline: auto$/m, 'a singleton shows its declarations');
	assert.match(doc, /^- display-flex → display: flex$/m);
	assert.match(doc, /^- background-\{hue\}-\{shade\} → background-color/m);
	assert.match(doc, /^- bold → font-weight: .* \[legacy name\]$/m, 'names outside the grammar are marked');
	assert.match(doc, /^- phone-full-width → \[\.phone\] /m, 'a variant-only class shows its context');
	assert.match(doc, /^## Legacy names \(\d+\)/m);
	assert.doesNotMatch(doc, /(^|\s)scss(\s|$)/m, 'no class named after the source comment');
	assert.doesNotMatch(doc, /^- (phone|tablet) →/m, 'runtime body classes are not utilities');
	// the grammar plus a declaration per row; the previous list of bare names was 3,300 tokens for less information
	assert.ok(countTokens(doc) <= 4100, `llms-utilities.txt is ${countTokens(doc)} tokens`);
	const families = utilityFamilies(ctx);
	for (const f of families) {
		const covered = docCoverage(doc, f.classes);
		const missing = f.classes.filter((c) => !covered.get(c.name)).map((c) => c.name);
		assert.deepEqual(missing, [], `${f.name} classes covered by a row`);
	}
});

test('parseVarChain splits a var() value into its token and fallback without a regular expression', () => {
	assert.deepEqual(parseVarChain('var(--token-scale-100, 4px)'), { token: '--token-scale-100', fallback: '4px' });
	assert.deepEqual(parseVarChain('var(--a, var(--b, 0px))'), { token: '--a', fallback: 'var(--b, 0px)' });
	assert.deepEqual(parseVarChain(' var(--a) '), { token: '--a', fallback: null });
	assert.equal(parseVarChain('4px'), null);
	assert.equal(parseVarChain('var(--a, 4px) solid'), null, 'the value must be one var() call');
	assert.equal(parseVarChain('var(--a, 4px)) x ('), null, 'unbalanced parentheses are not a chain');
	assert.equal(parseVarChain('var(a, 4px)'), null, 'the token must be a custom property');
	assert.match(
		renderUtilities(ctx),
		/none = --token-scale-0 \(0px\)/,
		'the step table still resolves through the parser'
	);
});

test('utilities manifest carries the grammar and every class with declarations, variants and tokens', () => {
	const m = buildUtilitiesManifest(ctx);
	assert.equal(m.version, '1');
	assert.deepEqual(m.grammar.steps, ['none', 'xs', 's', 'base', 'm', 'l', 'xl', 'xxl']);
	assert.equal(m.families.length, 24);
	const classes = m.families.flatMap((f) => f.classes);
	assert.ok(classes.length >= 500, `${classes.length} classes`);
	for (const c of classes) {
		assert.ok(c.declarations.length + c.variants.length > 0, `${c.name} has a rule`);
		assert.equal(typeof c.conformant, 'boolean');
		assert.ok(c.template.length > 0);
	}
	const xs = classes.find((c) => c.name === 'margin-xs');
	assert.deepEqual(xs.declarations, [{ prop: 'margin', value: 'var(--token-scale-100, 4px)', important: false }]);
	assert.deepEqual(xs.tokens, ['--token-scale-100']);
	assert.equal(xs.template, 'margin-{step}');
	assert.ok(JSON.stringify(m).length < 400 * 1024, 'the manifest stays a reasonable download');
});

test('tokens document marks the classic-compatible aliases and states the single-theme scope', () => {
	const tokens = renderTokens(ctx, manifest);
	assert.match(tokens, /single token-based theme/i);
	assert.match(tokens, /^- --color-neutral-0 .*legacy alias/m);
	assert.match(tokens, /^- --border-radius-soft .*legacy alias/m);
	assert.match(tokens, /^- --space-<type> .*legacy alias/m);
	assert.doesNotMatch(tokens, /^- --color-primary .*legacy alias/m, 'real roles are not marked');
	assert.match(tokens, /GetColorValueFromColorType/, 'the runtime readers that keep the aliases alive are named');
});

test('index and tokens documents are compact and name every pattern / theme role', () => {
	const index = renderIndex(manifest);
	assert.ok(countTokens(index) <= 1600, `llms.txt is ${countTokens(index)} tokens`);
	for (const p of ctx.inventory.patterns) assert.ok(index.includes(p.name), `${p.name} missing from llms.txt`);
	assert.match(index, /llms-utilities\.txt/);
	assert.match(index, /single token-based theme/i);
	const tokens = renderTokens(ctx, manifest);
	assert.match(tokens, /--color-primary/);
	assert.match(tokens, /--osui-card-padding/);
});

test('llms.txt has a Producers section that routes OML and runtime producers, and marks runtime-only gotchas', () => {
	const text = renderIndex(manifest, buildBlocksManifest(ctx));
	const lines = text.split('\n');
	const start = lines.findIndex((l) => l.startsWith(PRODUCERS_HEADING));
	assert.ok(start > 0);
	const end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
	const section = lines.slice(start + 1, end).join('\n');
	assert.ok(section.includes('llms-blocks.txt') && section.includes('llms-components.txt'));
	const gotchas = lines.slice(lines.findIndex((l) => l.startsWith('## Gotchas')) + 1);
	for (const l of gotchas.filter((l) => RUNTIME_GOTCHA_NEEDLES.some((n) => l.includes(n)))) assert.ok(isMarked(l), l);
	assert.ok(text.includes('- llms-blocks.txt —'), 'read-next lists the block cards');
});

test('every runtime-only line of the cards and of llms-patterns.txt carries the marker', () => {
	for (const l of renderComponentCards(manifest).split('\n').filter(isRuntimeOnlyLine)) assert.ok(isMarked(l), l);
	for (const l of renderCssComponents(ctx).split('\n').filter(isRuntimeOnlyLine)) assert.ok(isMarked(l), l);
});

test('writeDocs emits the block-level files', async () => {
	const fs = await import('node:fs');
	const os = await import('node:os');
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-docs-'));
	const files = writeDocs(ctx, dir).map((f) => path.relative(dir, f).split(path.sep).join('/'));
	for (const f of ['osui.blocks.json', 'llms-blocks.txt', 'osui.enums.json', 'osui.icons.json'])
		assert.ok(files.includes(f), f);
	fs.rmSync(dir, { recursive: true, force: true });
});

test('quotedUnionMembers reads a union of quoted literals without a regular expression', async () => {
	const { quotedUnionMembers } = await import('../scripts/lib/ai-docs.mjs');
	assert.deepEqual(quotedUnionMembers("'a' | 'b c'"), ['a', 'b c']);
	assert.equal(quotedUnionMembers("'a'"), null, 'one literal is not a union');
	assert.equal(quotedUnionMembers("'a' | b"), null, 'an unquoted member');
	assert.equal(quotedUnionMembers("'a' | 'b'c'"), null, 'a quote inside a member');
	assert.equal(quotedUnionMembers('string'), null);
});

test('utility synonyms: the manifest names the canonical class of each group and the doc lists the groups', () => {
	const ctx = createContext(root);
	const m = buildUtilitiesManifest(ctx);
	const byName = Object.fromEntries(m.families.flatMap((f) => f.classes.map((c) => [c.name, c])));
	assert.equal(byName['display-none'].canonical, 'display-none', 'the grammar form is canonical');
	assert.equal(byName.hidden.canonical, 'display-none', 'a synonym points at the canonical name');
	assert.equal(byName['font-bold'].canonical, 'font-bold');
	assert.equal(byName.bold.canonical, 'font-bold');
	assert.equal(byName['text-primary'].canonical, 'text-primary');
	assert.equal(byName['text-primary-darker'].canonical, 'text-primary');
	assert.equal(byName['margin-top-s']?.canonical, null, 'a class with no synonym has none');
	const doc = renderUtilities(ctx);
	assert.match(doc, /^## Synonyms \(\d+ groups: /m);
	assert.match(doc, /- display-none = hidden/);
	assert.match(doc, /- font-bold = bold/);
});

test('synonymLines compacts the groups: number runs, shared substitutions and shared suffixes', async () => {
	const { synonymLines } = await import('../scripts/lib/ai-docs.mjs');
	const lines = synonymLines([
		['display-none', 'hidden'],
		['font-bold', 'bold'],
		['text-primary', 'text-primary-darker'],
		['text-secondary', 'text-secondary-darker'],
		['text-neutral-5', 'text-neutral-5-darker'],
		['text-neutral-6', 'text-neutral-6-darker'],
		['background-teal-light', 'background-cyan-light'],
		['background-teal-dark', 'background-cyan-dark'],
		['text-teal-light', 'text-cyan-light'],
		[
			'background-primary-lightest',
			'background-secondary-lightest',
			'background-neutral-0-lightest',
			'background-neutral-1-lightest',
			'background-neutral-2-lightest',
		],
	]);
	assert.deepEqual(lines, [
		'- display-none = hidden',
		'- font-bold = bold',
		'- text-primary, text-secondary, text-neutral-{5..6} = same + -darker',
		'- background-teal-{light,dark}, text-teal-light = same with cyan for teal',
		'- background-primary-lightest = background-secondary-lightest = background-neutral-{0..2}-lightest',
	]);
});
