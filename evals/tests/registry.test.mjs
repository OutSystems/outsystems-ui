import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildInventory } from '../lib/inventory.mjs';
import {
	familyMembers,
	hasRole,
	loadRegistry,
	namesWhere,
	blockRuntimeOf,
	kindOf,
	normalizeRegistry,
	ROLES,
	validateBlockLinks,
	validateRegistry,
} from '../lib/registry.mjs';
import { KINDS, normalizeKind } from '../lib/kinds.mjs';
import { createContext } from '../lib/context.mjs';
import { expectationsFor } from '../lib/expectations.mjs';
import { flattenBlocks, loadSnapshots } from '../model/lib/snapshot.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const fake = {
	components: {
		Tabs: { kind: 'pattern', roles: ['composite'], family: 'Tabs' },
		TabsHeaderItem: { kind: 'pattern', roles: ['composite'], family: 'Tabs' },
		Dropdown: { kind: 'pattern', roles: ['provider', 'overlay'], validating: true },
		badge: { kind: 'component' },
		btn: { kind: 'component', story: 'button', interactive: true, loading: true },
		layout: { kind: 'layout', host: { host: 'app template', reason: 'skeleton' } },
		'space-margin': { kind: 'utility', title: 'Spacing · margin' },
	},
};

test('namesWhere, hasRole, familyMembers and kindOf read the registry', () => {
	assert.deepEqual([...namesWhere(fake, (e) => hasRole(e, 'composite'))], ['Tabs', 'TabsHeaderItem']);
	assert.deepEqual([...namesWhere(fake, (e) => e.kind !== 'pattern' && e.interactive === true)], ['btn']);
	assert.equal(hasRole(fake.components.badge, 'overlay'), false);
	assert.deepEqual(familyMembers(fake, 'Tabs'), ['TabsHeaderItem']);
	assert.deepEqual(familyMembers(fake, 'TabsHeaderItem'), ['Tabs']);
	assert.deepEqual(familyMembers(fake, 'badge'), []);
	assert.equal(kindOf(fake, 'layout', 'component'), 'layout');
	assert.equal(kindOf(fake, 'space-margin', 'component'), 'utility');
	assert.equal(kindOf(fake, 'unknown', 'component'), 'component', 'falls back to the discovered tier');
});

test('normalizeRegistry keeps every entry as written; the legacy css kind is no longer a kind', () => {
	const reg = normalizeRegistry({ components: { card: { kind: 'css', loading: true }, Tabs: { kind: 'pattern' } } });
	assert.deepEqual(reg.components.card, { kind: 'css', loading: true });
	assert.equal(reg.components.Tabs.kind, 'pattern');
	assert.equal(normalizeKind('css'), null);
});

test('validateRegistry reports unknown components, stale entries, bad kinds, pattern mismatches and tier overrides', () => {
	const inventory = {
		patterns: [{ name: 'Tabs' }, { name: 'TabsHeaderItem' }, { name: 'Dropdown' }, { name: 'Search' }],
		cssComponents: [
			{ name: 'badge', tier: 'component' },
			{ name: 'card', tier: 'component' },
			{ name: 'layout', tier: 'layout' },
			{ name: 'space-margin', tier: 'utility' },
			{ name: 'animate', tier: 'component' },
		],
	};
	const reg = {
		components: {
			...fake.components,
			btn: { kind: 'pattern' },
			animate: { kind: 'utility' },
			Dropdown: { kind: 'component' },
		},
	};
	const r = validateRegistry(reg, inventory);
	assert.deepEqual(r.unknown, [
		{ name: 'Search', kind: 'pattern' },
		{ name: 'card', kind: 'component' },
	]);
	assert.deepEqual(r.stale, ['btn']);
	assert.deepEqual(r.badRoles, []);
	assert.deepEqual(r.badKinds, []);
	assert.deepEqual(r.kindMismatch, [{ name: 'Dropdown', registry: 'component', inventory: 'pattern' }]);
	assert.deepEqual(
		r.tierOverride,
		[{ name: 'animate', registry: 'utility', discovered: 'component' }],
		'a registry tier that differs from the directory default is reported, not failed'
	);
	const bad = validateRegistry(
		{ components: { Tabs: { kind: 'pattern', roles: ['flying'] }, badge: { kind: 'widget' } } },
		{ patterns: [{ name: 'Tabs' }], cssComponents: [{ name: 'badge', tier: 'component' }] }
	);
	assert.deepEqual(bad.badRoles, [{ name: 'Tabs', role: 'flying' }]);
	assert.deepEqual(bad.badKinds, [{ name: 'badge', kind: 'widget' }]);
	assert.ok(ROLES.includes('overlay'));
	const legacy = validateRegistry(
		{ components: { badge: { kind: 'css' } } },
		{ patterns: [], cssComponents: [{ name: 'badge' }] }
	);
	assert.deepEqual(
		legacy.kindMismatch,
		[],
		'css still means component; a component without a tier defaults to component'
	);
});

test('the committed registry classifies exactly the components the inventory discovers, with tiers and valid roles', () => {
	const reg = loadRegistry();
	const r = validateRegistry(reg, buildInventory(root));
	assert.deepEqual(
		r.unknown,
		[],
		'every discovered component has an entry (npm run evals:doctor -- --fix appends derived ones)'
	);
	assert.deepEqual(r.stale, [], 'every entry names a component that still exists');
	assert.deepEqual(r.badRoles, []);
	assert.deepEqual(r.badKinds, []);
	assert.deepEqual(r.kindMismatch, []);
	for (const [name, e] of Object.entries(reg.components)) assert.ok(KINDS.includes(e.kind), `${name} has a tier`);
	assert.equal(reg.components.card.kind, 'component');
	assert.equal(reg.components.header.kind, 'layout');
	assert.equal(reg.components.animate.kind, 'utility', 'helpers filed under 04-patterns are overridden to utility');
	assert.equal(reg.components['space-margin'].kind, 'utility');
	assert.equal(
		reg.components['align-center'].host,
		undefined,
		'a helper class has no host: nothing emits its markup'
	);
	assert.deepEqual(
		r.tierOverride.map((o) => o.name).sort((a, b) => a.localeCompare(b)),
		['animate', 'columns', 'list-updating', 'provider-login-button', 'pull-to-refresh']
	);
	assert.equal(reg.components['layout-section'].kind, 'layout');
});

test('validateBlockLinks resolves blocks, parameters (dotted for structure attributes), props and events', () => {
	const reg = normalizeRegistry({
		components: {
			Carousel: {
				kind: 'pattern',
				block: [
					{
						flow: 'Interaction',
						name: 'Carousel',
						paramMap: {
							'ItemsPerSlide.Desktop': 'ItemsDesktop',
							Navigation: 'Navigation',
							Ghost: 'ItemsPhone',
							'ItemsPerSlide.Nope': 'ItemsTablet',
							Loop: 'NotAProp',
						},
						platformOnly: ['Position', 'Missing'],
						eventMap: { OnSlideMoved: 'OnSlideMoved', OnNope: 'OnSlideMoved' },
					},
					{ flow: 'Interaction', name: 'Gone' },
				],
			},
		},
	});
	const blocks = new Map([
		[
			'Interaction/Carousel',
			{
				inputParameters: [
					{ name: 'ItemsPerSlide', typeKind: 'structure', typeRef: 'ItemsPerSlide' },
					{ name: 'Navigation', typeKind: 'staticEntity', typeRef: 'Navigation' },
					{ name: 'Loop', typeKind: 'basic', typeRef: null },
					{ name: 'Position', typeKind: 'basic', typeRef: null },
				],
				events: [{ name: 'OnSlideMoved' }],
			},
		],
	]);
	const structures = { ItemsPerSlide: { attributes: [{ name: 'Desktop' }, { name: 'Tablet' }, { name: 'Phone' }] } };
	const errors = validateBlockLinks(
		reg,
		blocks,
		new Map([['Carousel', ['ItemsDesktop', 'ItemsTablet', 'ItemsPhone', 'Navigation', 'Loop']]]),
		new Map([['Carousel', ['OnSlideMoved', 'Initialized']]]),
		structures
	).map((e) => e.message);
	assert.deepEqual(errors, [
		'Carousel: block Interaction/Carousel has no parameter "Ghost"',
		'Carousel: block Interaction/Carousel has no parameter "ItemsPerSlide.Nope"',
		'Carousel: pattern has no config prop "NotAProp" (paramMap Loop)',
		'Carousel: block Interaction/Carousel has no parameter "Missing" (platformOnly)',
		'Carousel: block Interaction/Carousel has no event "OnNope"',
		'Carousel: block Interaction/Gone is not in the snapshot',
	]);
});

test('validateBlockLinks reports a dotted key whose structure is missing from the snapshot instead of throwing', () => {
	const reg = normalizeRegistry({
		components: {
			Carousel: {
				kind: 'pattern',
				block: [{ flow: 'I', name: 'C', paramMap: { 'ItemsPerSlide.Desktop': 'ItemsDesktop' } }],
			},
		},
	});
	const blocks = new Map([
		[
			'I/C',
			{
				inputParameters: [{ name: 'ItemsPerSlide', typeKind: 'structure', typeRef: 'ItemsPerSlide' }],
				events: [],
			},
		],
	]);
	const errors = validateBlockLinks(reg, blocks, new Map([['Carousel', ['ItemsDesktop']]]), new Map(), {});
	assert.deepEqual(
		errors.map((e) => e.message),
		['Carousel: block I/C has no parameter "ItemsPerSlide.Desktop"']
	);
});

test('every block link of the committed registry resolves against the snapshot and the patterns', () => {
	const snapshots = loadSnapshots();
	if (snapshots.length === 0) return;
	const ctx = createContext(root);
	const blocks = new Map(flattenBlocks(snapshots).map((b) => [b.key, b]));
	const props = new Map(
		ctx.inventory.patterns.map((p) => [
			p.name,
			[...expectationsFor(ctx, p).props.map((x) => x.name), 'ExtendedClass'],
		])
	);
	const events = new Map(
		ctx.inventory.patterns.map((p) => [p.name, [...expectationsFor(ctx, p).events, 'Initialized']])
	);
	const structures = Object.assign({}, ...snapshots.map((s) => s.structures));
	assert.deepEqual(validateBlockLinks(loadRegistry(), blocks, props, events, structures), []);
});

test('blockRuntimeOf finds the pattern and the stylesheet entry that link a block', () => {
	const reg = {
		components: {
			Tooltip: { kind: 'pattern', block: [{ flow: 'Content', name: 'Tooltip', paramMap: {} }] },
			card: { kind: 'component', block: [{ flow: 'Content', name: 'Card' }] },
			btn: { kind: 'component' },
		},
	};
	assert.deepEqual(blockRuntimeOf(reg, 'Content', 'Tooltip'), { pattern: 'Tooltip', style: null });
	assert.deepEqual(blockRuntimeOf(reg, 'Content', 'Card'), { pattern: null, style: 'card' });
	assert.deepEqual(blockRuntimeOf(reg, 'Adaptive', 'Columns2'), { pattern: null, style: null });
});

test('validateBlockLinks rejects a block linked twice, a map on a stylesheet entry, a link on a utility and a deprecated target', () => {
	const blocksByKey = new Map([
		['Content/Card', { inputParameters: [], events: [] }],
		['Content/DEPRECATED_Card', { inputParameters: [], events: [] }],
	]);
	const reg = {
		components: {
			card: { kind: 'component', block: [{ flow: 'Content', name: 'Card', paramMap: { A: 'a' } }] },
			'stacked-cards': { kind: 'component', block: [{ flow: 'Content', name: 'Card' }] },
			animate: { kind: 'utility', block: [{ flow: 'Interaction', name: 'Animate' }] },
			'card-item': { kind: 'component', block: [{ flow: 'Content', name: 'DEPRECATED_Card' }] },
		},
	};
	const messages = validateBlockLinks(reg, blocksByKey, new Map(), new Map(), {}).map((e) => e.message);
	assert.ok(
		messages.some((m) => m.includes('card: paramMap on a CSS-only component')),
		messages.join('; ')
	);
	assert.ok(messages.some((m) => m.includes('Content/Card is linked from card and stacked-cards')));
	assert.ok(messages.some((m) => m.includes('animate: a utility family never links a block')));
	assert.ok(messages.some((m) => m.includes('DEPRECATED_Card: deprecated blocks are not composable')));
});
