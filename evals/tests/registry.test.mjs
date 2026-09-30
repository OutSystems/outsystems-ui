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
	normalizeRegistry,
	ROLES,
	tierOf,
	validateRegistry,
} from '../lib/registry.mjs';
import { TIERS } from '../lib/tiers.mjs';

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

test('namesWhere, hasRole, familyMembers and tierOf read the registry', () => {
	assert.deepEqual([...namesWhere(fake, (e) => hasRole(e, 'composite'))], ['Tabs', 'TabsHeaderItem']);
	assert.deepEqual([...namesWhere(fake, (e) => e.kind !== 'pattern' && e.interactive === true)], ['btn']);
	assert.equal(hasRole(fake.components.badge, 'overlay'), false);
	assert.deepEqual(familyMembers(fake, 'Tabs'), ['TabsHeaderItem']);
	assert.deepEqual(familyMembers(fake, 'TabsHeaderItem'), ['Tabs']);
	assert.deepEqual(familyMembers(fake, 'badge'), []);
	assert.equal(tierOf(fake, 'layout', 'component'), 'layout');
	assert.equal(tierOf(fake, 'space-margin', 'component'), 'utility');
	assert.equal(tierOf(fake, 'unknown', 'component'), 'component', 'falls back to the discovered tier');
});

test('normalizeRegistry lifts the previous css kind to component and keeps every other field', () => {
	const reg = normalizeRegistry({ components: { card: { kind: 'css', loading: true }, Tabs: { kind: 'pattern' } } });
	assert.deepEqual(reg.components.card, { kind: 'component', loading: true });
	assert.equal(reg.components.Tabs.kind, 'pattern');
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
	for (const [name, e] of Object.entries(reg.components)) assert.ok(TIERS.includes(e.kind), `${name} has a tier`);
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
