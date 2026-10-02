import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../evals/lib/context.mjs';
import { countTokens } from '../evals/lib/tokens.mjs';
import { loadSnapshots } from '../evals/model/lib/snapshot.mjs';
import { sample } from '../evals/model/tests/snapshot.test.mjs';
import {
	BLOCK_CARD_BUDGET,
	buildBlocksManifest,
	buildEnumsManifest,
	recipesFor,
	renderBlockCard,
	renderBlockCards,
} from '../scripts/lib/ai-docs-blocks.mjs';
import { buildIconsManifest, iconClassesOf } from '../scripts/lib/ai-docs-icons.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** A context over the sample snapshot and a registry that links Carousel. */
function fakeCtx(
	registryEntry = {
		kind: 'pattern',
		block: [
			{
				flow: 'Interaction',
				name: 'Carousel',
				paramMap: { Color: 'Color' },
				eventMap: { OnSlideMoved: 'OnSlideMoved' },
			},
		],
	}
) {
	return {
		inventory: { patterns: [{ name: 'Carousel' }, { name: 'Tabs' }] },
		modelSnapshots: () => [sample()],
		registryOverride: { components: { Carousel: registryEntry, Tabs: { kind: 'pattern' } } },
	};
}

test('buildBlocksManifest joins the snapshot with the crosswalk and keeps only public blocks', () => {
	const m = buildBlocksManifest(/** @type {any} */ (fakeCtx()));
	assert.deepEqual(Object.keys(m.blocks), ['Interaction/Carousel']);
	const b = m.blocks['Interaction/Carousel'];
	assert.equal(b.pattern, 'Carousel');
	assert.equal(b.patternSource, 'registry');
	assert.deepEqual(b.paramMap, { Color: 'Color' });
	assert.deepEqual(b.params.find((p) => p.name === 'Color').values, ['Transparent']);
	assert.equal(m.snapshots[0].platform, 'ODC');
	assert.equal(m.version, '1');
});

test('a block with no registry link falls back to the hint and reports it as such', () => {
	const m = buildBlocksManifest(/** @type {any} */ (fakeCtx({ kind: 'pattern' })));
	assert.equal(m.blocks['Interaction/Carousel'].pattern, 'Carousel');
	assert.equal(m.blocks['Interaction/Carousel'].patternSource, 'hint');
	assert.deepEqual(m.blocks['Interaction/Carousel'].hints, ['CarouselAPI']);
});

test('recipesFor writes a deterministic OpenUI and TSX instantiation from the signature', () => {
	const b = buildBlocksManifest(/** @type {any} */ (fakeCtx())).blocks['Interaction/Carousel'];
	assert.deepEqual(recipesFor(b), {
		openui: '_Carousel1 = Block(SourceBlock: Interaction/Carousel, ItemsPerSlide: …, Color: Entities.Color.Transparent, ExtendedClass: "", CarouselItems: [_CarouselItems1])',
		tsx: '<Carousel id={"_Carousel1"} data-source={"Interaction/Carousel"} ItemsPerSlide={…} Color={Entities.Color.Transparent} ExtendedClass={""} CarouselItems={<>…</>} />',
	});
});

test('renderBlockCard has the sections M01/M04 read and fits the budget through its stages', () => {
	const b = buildBlocksManifest(/** @type {any} */ (fakeCtx())).blocks['Interaction/Carousel'];
	const card = renderBlockCard(b);
	assert.ok(card.startsWith('## Interaction/Carousel\n'));
	for (const head of ['Purpose:', 'Params:', 'Slots:', 'Events:', 'Runtime pattern:', 'OpenUI:', 'TSX:']) {
		assert.ok(card.includes(`\n${head}`), head);
	}
	assert.ok(card.includes('[Transparent]'), 'static-entity values listed at stage 0');
	assert.ok(!renderBlockCard(b, 2).includes('[Transparent]'), 'stage 2 drops enum values');
	assert.ok(!renderBlockCard(b, 3).includes('→'), 'stage 3 drops the param map');
	assert.ok(countTokens(card) <= BLOCK_CARD_BUDGET);
});

test('buildEnumsManifest lists referenced static entities with their values and users', () => {
	const e = buildEnumsManifest(/** @type {any} */ (fakeCtx()));
	assert.deepEqual(Object.keys(e), ['Color']);
	assert.deepEqual(e.Color.values, [{ identifier: 'Transparent', label: 'Transparent' }]);
	assert.deepEqual(e.Color.usedBy, ['Interaction/Carousel.Color']);
});

test('on the committed snapshot every public block gets a card within budget (when a snapshot exists)', (t) => {
	if (loadSnapshots().length === 0) {
		t.skip('no evals/model/osui.blocks*.json snapshot');
		return;
	}
	const ctx = createContext(root);
	const manifest = buildBlocksManifest(ctx);
	const text = renderBlockCards(manifest);
	for (const key of Object.keys(manifest.blocks)) assert.ok(text.includes(`\n## ${key}\n`), key);
	for (const section of text.split('\n## ').slice(1)) {
		const tokens = countTokens(`## ${section}`);
		assert.ok(tokens <= BLOCK_CARD_BUDGET, `${section.split('\n')[0]}: ${tokens} tokens`);
	}
});

test('iconClassesOf reads the icon class names of a font stylesheet', () => {
	const css = '.ph-acorn:before{content:"\e000"}.ph.ph-address-book:before{content:"\e001"}.ph-fill{font-family:x}';
	assert.deepEqual(iconClassesOf(css, 'ph-'), ['ph-acorn', 'ph-address-book']);
});

test('buildIconsManifest documents both libraries from the installed packages', () => {
	const icons = buildIconsManifest(createContext(root));
	assert.ok(icons.phosphor.classes.length > 1000);
	assert.ok(icons.fontawesome4.classes.includes('fa-search'));
	assert.equal(icons.phosphor.usage, 'icon ph ph-<name>');
});

test('with two platform snapshots the manifest, the cards and M01/M04 agree on the labelled identity', async () => {
	const { default: M01 } = await import('../evals/model/metrics/M01-block-manifest.mjs');
	const { default: M04 } = await import('../evals/model/metrics/M04-block-cards.mjs');
	const two = { ...fakeCtx(), modelSnapshots: () => [sample('ODC'), sample('O11')] };
	const manifest = buildBlocksManifest(/** @type {any} */ (two));
	assert.deepEqual(Object.keys(manifest.blocks), ['Interaction/Carousel (O11)', 'Interaction/Carousel (ODC)']);
	const text = renderBlockCards(manifest);
	assert.ok(text.includes('\n## Interaction/Carousel (ODC)\n') && text.includes('\n## Interaction/Carousel (O11)\n'));
	const docs = { 'osui.blocks.json': JSON.stringify(manifest), 'llms-blocks.txt': text };
	const ctx = { ...two, docsAi: (n) => docs[n] ?? null, tokens: { countTokens } };
	const m01 = M01.compute(/** @type {any} */ (ctx));
	assert.deepEqual(
		m01.perComponent.map((r) => [r.label, r.present]),
		[
			['Interaction/Carousel (O11)', true],
			['Interaction/Carousel (ODC)', true],
		]
	);
	const m04 = M04.compute(/** @type {any} */ (ctx));
	assert.deepEqual(
		m04.perComponent.map((r) => r.tokens !== null),
		[true, true]
	);
});

test('the block manifest and cards cover the composable set only: no deprecated block, no Licenses', () => {
	const ctx = createContext(root);
	const manifest = buildBlocksManifest(ctx);
	const keys = Object.keys(manifest.blocks);
	assert.ok(keys.length > 0);
	assert.ok(
		keys.every((k) => !k.includes('DEPRECATED_')),
		'no deprecated block'
	);
	assert.ok(!keys.includes('Licenses/Licenses'));
	const text = renderBlockCards(manifest);
	assert.ok(!text.includes('## Licenses/Licenses'));
	assert.ok(!text.includes('DEPRECATED_'));
});
