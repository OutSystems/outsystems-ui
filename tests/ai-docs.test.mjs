import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../evals/ai-friendliness/lib/context.mjs';
import { expectationsFor } from '../evals/ai-friendliness/lib/expectations.mjs';
import { componentFacets } from '../evals/ai-friendliness/lib/manifest.mjs';
import { countTokens } from '../evals/ai-friendliness/lib/tokens.mjs';
import {
	buildManifest,
	CARD_TOKEN_BUDGET,
	renderComponentCards,
	renderIndex,
	renderTokens,
	resolveEnumReference,
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
		/Create\(accordionId: string, configs: string \| object\): IAccordion\b/,
		'namespace prefixes are abbreviated and the configs union reads as string | object'
	);
});

test('index and tokens documents are compact and name every pattern / theme role', () => {
	const index = renderIndex(manifest);
	assert.ok(countTokens(index) <= 1500, `llms.txt is ${countTokens(index)} tokens`);
	for (const p of ctx.inventory.patterns) assert.ok(index.includes(p.name), `${p.name} missing from llms.txt`);
	const tokens = renderTokens(ctx, manifest);
	assert.match(tokens, /--color-primary/);
	assert.match(tokens, /--osui-card-padding/);
});
