import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../lib/context.mjs';
import { loadRegistry } from '../lib/registry.mjs';
import {
	applyFixes,
	blockHintsFor,
	diagnose,
	disagrees,
	renderDoctor,
	renderDoctorBlocks,
	suggestEntry,
} from '../tools/doctor.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('suggestEntry derives a pattern entry from its code signals', () => {
	const overlay = suggestEntry({
		kind: 'pattern',
		name: 'Popover',
		providerDirs: [],
		text: 'this.focusTrap = new FocusTrap(); if (e.key === GlobalEnum.Keycodes.Escape) this.close(); Helper.A11Y.AriaLivePolite(x)',
		css: '',
	});
	assert.deepEqual(overlay, { kind: 'pattern', roles: ['overlay', 'feedback'], derived: true });
	const provider = suggestEntry({
		kind: 'pattern',
		name: 'ColorPicker',
		providerDirs: ['/x/providers/colorpicker'],
		text: 'switch (e.key) { case GlobalEnum.Keycodes.ArrowLeft: }',
		css: '',
	});
	assert.deepEqual(provider.roles, ['provider', 'composite']);
	const inert = suggestEntry({
		kind: 'pattern',
		name: 'Ticker',
		providerDirs: [],
		text: 'setInterval(() => this.tick(), 100)',
		css: '',
	});
	assert.deepEqual(inert.roles, ['non-interactive']);
	const events = suggestEntry({
		kind: 'pattern',
		name: 'HoverEvents',
		providerDirs: [],
		text: 'this.selfElement.addEventListener("click", cb)',
		css: '',
	});
	assert.deepEqual(events.roles, ['no-dom']);
});

test('suggestEntry derives a CSS component entry from its compiled CSS and keeps the discovered tier', () => {
	const chip = suggestEntry({
		kind: 'component',
		name: 'chip',
		text: '',
		css: '.chip:hover{} .chip.is-loading{} .chip.not-valid{}',
	});
	assert.deepEqual(chip, { kind: 'component', interactive: true, loading: true, validating: true, derived: true });
	assert.deepEqual(suggestEntry({ kind: 'component', name: 'rule', text: '', css: '.rule{height:1px}' }), {
		kind: 'component',
		derived: true,
	});
	assert.deepEqual(suggestEntry({ kind: 'layout', name: 'footer', text: '', css: '.footer:hover{}' }), {
		kind: 'layout',
		interactive: true,
		derived: true,
	});
	assert.deepEqual(
		suggestEntry({ kind: 'utility', name: 'space-gap', text: '', css: '.gap-s:hover{}' }),
		{ kind: 'utility', derived: true },
		'a utility family is classified by its tier alone'
	);
});

test('diagnose lists unknown and stale components with suggestions, and components without a story', () => {
	const ctx = createContext(root);
	const registry = loadRegistry();
	const clean = diagnose(ctx, registry);
	assert.deepEqual(clean.unknown, []);
	assert.deepEqual(clean.stale, []);
	assert.ok(Array.isArray(clean.noStory));
	const broken = {
		components: Object.fromEntries(
			Object.entries(registry.components).filter(([n]) => n !== 'Accordion' && n !== 'badge')
		),
	};
	broken.components.Ghost = { kind: 'css' };
	const r = diagnose(ctx, broken);
	assert.deepEqual(
		r.unknown.map((u) => [u.name, u.kind, u.suggested.derived]),
		[
			['Accordion', 'pattern', true],
			['badge', 'component', true],
		]
	);
	assert.deepEqual(r.badKinds, []);
	assert.ok(Array.isArray(r.tierOverride), 'tier overrides are reported, not failed');
	assert.deepEqual(r.stale, ['Ghost']);
	const md = renderDoctor(r);
	assert.match(md, /Accordion/);
	assert.match(md, /Ghost/);
	assert.match(md, /--fix/);
	assert.equal(renderDoctor(clean), '', 'nothing to say when the registry and the tree agree');
	const fixed = applyFixes(broken, r);
	assert.equal(fixed.components.Accordion.derived, true);
	assert.equal(fixed.components.badge.kind, 'component');
	assert.equal('Ghost' in fixed.components, false, 'stale entries are dropped');
	assert.deepEqual(
		Object.keys(fixed.components),
		[...Object.keys(fixed.components)].sort((a, b) => a.localeCompare(b)),
		'entries stay sorted'
	);
});

test('blockHintsFor proposes links for patterns the snapshot hints at and lists orphan API calls', () => {
	const registry = {
		components: {
			Carousel: { kind: 'pattern' },
			Tabs: { kind: 'pattern', block: [{ flow: 'Navigation', name: 'Tabs' }] },
		},
	};
	const blocks = [
		{
			key: 'Interaction/Carousel',
			flow: 'Interaction',
			name: 'Carousel',
			public: true,
			patternHints: { apiCalls: ['CarouselAPI'] },
		},
		{
			key: 'Interaction/Gallery',
			flow: 'Interaction',
			name: 'Gallery',
			public: true,
			patternHints: { apiCalls: ['GalleryAPI'] },
		},
		{
			key: 'Navigation/Tabs',
			flow: 'Navigation',
			name: 'Tabs',
			public: true,
			patternHints: { apiCalls: ['TabsAPI'] },
		},
		{
			key: 'Content/Private',
			flow: 'Content',
			name: 'Private',
			public: false,
			patternHints: { apiCalls: ['CarouselAPI'] },
		},
	];
	// callers pass the composable set; the function does not filter
	const r = blockHintsFor(
		['Carousel', 'Tabs'],
		[],
		registry,
		blocks.filter((b) => b.public)
	);
	assert.deepEqual(r.proposals, [
		{ pattern: 'Carousel', blocks: [{ flow: 'Interaction', name: 'Carousel' }], source: 'api' },
	]);
	assert.deepEqual(r.orphans, [{ key: 'Interaction/Gallery', apiCalls: ['GalleryAPI'] }]);
});

test('applyFixes appends a derived block link for a single-block proposal and leaves confirmed links alone', () => {
	const registry = {
		components: {
			Carousel: { kind: 'pattern' },
			Tabs: { kind: 'pattern', block: [{ flow: 'Navigation', name: 'Tabs' }] },
		},
	};
	const fixed = applyFixes(registry, {
		unknown: [],
		stale: [],
		badRoles: [],
		badKinds: [],
		kindMismatch: [],
		tierOverride: [],
		noStory: [],
		blockHints: {
			proposals: [{ pattern: 'Carousel', blocks: [{ flow: 'Interaction', name: 'Carousel' }] }],
			orphans: [],
		},
	});
	assert.deepEqual(fixed.components.Carousel.block, [
		{ flow: 'Interaction', name: 'Carousel', paramMap: {}, derived: true },
	]);
	assert.deepEqual(fixed.components.Tabs.block, [{ flow: 'Navigation', name: 'Tabs' }]);
});

test('renderDoctorBlocks lists proposals and orphans without turning them into a disagreement', () => {
	const r = {
		unknown: [],
		stale: [],
		badRoles: [],
		badKinds: [],
		kindMismatch: [],
		tierOverride: [],
		noStory: [],
		blockHints: {
			proposals: [{ pattern: 'Carousel', blocks: [{ flow: 'Interaction', name: 'Carousel' }] }],
			orphans: [{ key: 'Interaction/Gallery', apiCalls: ['GalleryAPI'] }],
		},
	};
	assert.equal(disagrees(r), false);
	const text = renderDoctorBlocks(r);
	assert.ok(text.includes('`Carousel`') && text.includes('Interaction/Carousel'));
	assert.ok(text.includes('Interaction/Gallery') && text.includes('GalleryAPI'));
	assert.equal(renderDoctorBlocks({ ...r, blockHints: { proposals: [], orphans: [] } }), '');
});

test('diagnose reads the snapshot through the context, not the repository default', () => {
	const ctx = createContext(root);
	const fake = {
		...ctx,
		modelSnapshots: () => [
			{
				version: 1,
				source: { module: 'X', platform: 'ODC' },
				staticEntities: {},
				structures: {},
				blocks: {
					'Zed/Only': {
						flow: 'Zed',
						name: 'Only',
						public: true,
						description: '',
						inputParameters: [],
						placeholders: [],
						events: [],
						requiredScripts: [],
						patternHints: { apiCalls: ['SearchAPI'] },
					},
				},
			},
		],
	};
	const r = diagnose(/** @type {any} */ (fake), { components: { Search: { kind: 'pattern' } } });
	assert.deepEqual(r.blockHints.proposals, [
		{ pattern: 'Search', blocks: [{ flow: 'Zed', name: 'Only' }], source: 'api' },
	]);
});

test('normalizedName maps PascalCase and kebab-case to one key', async () => {
	const { normalizedName } = await import('../tools/doctor.mjs');
	assert.equal(normalizedName('CardSectioned'), 'card-sectioned');
	assert.equal(normalizedName('card-sectioned'), 'card-sectioned');
	assert.equal(normalizedName('InputWithIcon'), 'input-with-icon');
	assert.equal(normalizedName('SwipeEvents'), 'swipe-events');
});

test('blockHintsFor proposes links by exact name for patterns and stylesheets, never by prefix', () => {
	const hints = (apiCalls) => ({ apiCalls });
	const blocks = [
		{ key: 'Content/Card', flow: 'Content', name: 'Card', public: true, patternHints: hints([]) },
		{ key: 'Numbers/ProgressBar', flow: 'Numbers', name: 'ProgressBar', public: true, patternHints: hints([]) },
		{ key: 'Utilities/SwipeEvents', flow: 'Utilities', name: 'SwipeEvents', public: true, patternHints: hints([]) },
		{ key: 'Content/Tooltip', flow: 'Content', name: 'Tooltip', public: true, patternHints: hints(['TooltipAPI']) },
	];
	const registry = {
		components: {
			card: { kind: 'component' },
			progress: { kind: 'component' },
			SwipeEvents: { kind: 'pattern' },
			Tooltip: { kind: 'pattern' },
		},
	};
	const r = blockHintsFor(['Tooltip', 'SwipeEvents'], ['card', 'progress'], registry, blocks);
	const byKey = Object.fromEntries(r.proposals.map((p) => [p.pattern ?? p.style, p]));
	assert.deepEqual(byKey.card, { style: 'card', blocks: [{ flow: 'Content', name: 'Card' }], source: 'name' });
	assert.deepEqual(byKey.SwipeEvents, {
		pattern: 'SwipeEvents',
		blocks: [{ flow: 'Utilities', name: 'SwipeEvents' }],
		source: 'name',
	});
	assert.equal(byKey.Tooltip.source, 'api');
	assert.equal(byKey.progress, undefined, 'ProgressBar does not match progress');
	assert.deepEqual(r.unlinked, ['Numbers/ProgressBar']);
});

test('applyFixes appends a derived link to a stylesheet entry without a paramMap', () => {
	const registry = { components: { card: { kind: 'component' } } };
	const r = {
		stale: [],
		unknown: [],
		blockHints: {
			proposals: [{ style: 'card', blocks: [{ flow: 'Content', name: 'Card' }], source: 'name' }],
			orphans: [],
			unlinked: [],
		},
	};
	const fixed = applyFixes(registry, /** @type {any} */ (r));
	assert.deepEqual(fixed.components.card.block, [{ flow: 'Content', name: 'Card', derived: true }]);
});
