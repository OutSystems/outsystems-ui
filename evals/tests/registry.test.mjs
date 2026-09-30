import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildInventory } from '../lib/inventory.mjs';
import { familyMembers, hasRole, loadRegistry, namesWhere, ROLES, validateRegistry } from '../lib/registry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const fake = {
	components: {
		Tabs: { kind: 'pattern', roles: ['composite'], family: 'Tabs' },
		TabsHeaderItem: { kind: 'pattern', roles: ['composite'], family: 'Tabs' },
		Dropdown: { kind: 'pattern', roles: ['provider', 'overlay'], validating: true },
		badge: { kind: 'css' },
		btn: { kind: 'css', story: 'button', interactive: true, loading: true },
	},
};

test('namesWhere, hasRole and familyMembers read the registry', () => {
	assert.deepEqual([...namesWhere(fake, (e) => hasRole(e, 'composite'))], ['Tabs', 'TabsHeaderItem']);
	assert.deepEqual([...namesWhere(fake, (e) => e.kind === 'css' && e.interactive === true)], ['btn']);
	assert.equal(hasRole(fake.components.badge, 'overlay'), false);
	assert.deepEqual(familyMembers(fake, 'Tabs'), ['TabsHeaderItem']);
	assert.deepEqual(familyMembers(fake, 'TabsHeaderItem'), ['Tabs']);
	assert.deepEqual(familyMembers(fake, 'badge'), []);
});

test('validateRegistry reports entries the inventory does not know, components without an entry, and kind mismatches', () => {
	const inventory = {
		patterns: [{ name: 'Tabs' }, { name: 'TabsHeaderItem' }, { name: 'Dropdown' }, { name: 'Search' }],
		cssComponents: [{ name: 'badge' }, { name: 'card' }],
	};
	const r = validateRegistry({ components: { ...fake.components, btn: { kind: 'pattern' } } }, inventory);
	assert.deepEqual(r.unknown, [
		{ name: 'Search', kind: 'pattern' },
		{ name: 'card', kind: 'css' },
	]);
	assert.deepEqual(r.stale, ['btn']);
	assert.deepEqual(r.badRoles, []);
	const roles = validateRegistry(
		{ components: { Tabs: { kind: 'pattern', roles: ['flying'] } } },
		{ patterns: [{ name: 'Tabs' }], cssComponents: [] }
	);
	assert.deepEqual(roles.badRoles, [{ name: 'Tabs', role: 'flying' }]);
	assert.ok(ROLES.includes('overlay'));
});

test('the committed registry classifies exactly the components the inventory discovers, with valid roles', () => {
	const r = validateRegistry(loadRegistry(), buildInventory(root));
	assert.deepEqual(
		r.unknown,
		[],
		'every discovered component has an entry (npm run evals:doctor -- --fix appends derived ones)'
	);
	assert.deepEqual(r.stale, [], 'every entry names a component that still exists');
	assert.deepEqual(r.badRoles, []);
	assert.deepEqual(r.kindMismatch, []);
});
