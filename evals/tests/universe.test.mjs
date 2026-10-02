import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildUniverse, CATEGORIES, CATEGORY_LABEL, rowIndex, rowsForResult } from '../lib/universe.mjs';

const snapshot = (platform, blocks) => ({
	version: 1,
	source: { module: 'OutSystemsUI', platform },
	staticEntities: {},
	structures: {},
	blocks: Object.fromEntries(
		blocks.map(([flow, name, pub = true]) => [
			`${flow}/${name}`,
			{
				flow,
				name,
				public: pub,
				description: '',
				inputParameters: [],
				placeholders: [],
				events: [],
				requiredScripts: [],
				patternHints: { apiCalls: [] },
			},
		])
	),
});
const registry = {
	components: {
		Dropdown: {
			kind: 'pattern',
			block: [
				{ flow: 'Interaction', name: 'DropdownSearch', paramMap: {} },
				{ flow: 'Interaction', name: 'DropdownTags', paramMap: {} },
			],
		},
		Tooltip: { kind: 'pattern', block: [{ flow: 'Content', name: 'Tooltip', paramMap: {} }] },
		card: { kind: 'component', block: [{ flow: 'Content', name: 'Card' }] },
		btn: { kind: 'component' },
		layout: { kind: 'layout' },
		text: { kind: 'utility' },
		SwipeEvents: { kind: 'pattern' },
	},
};
const inventory = {
	patterns: [{ name: 'Dropdown' }, { name: 'Tooltip' }, { name: 'SwipeEvents' }],
	cssComponents: [
		{ name: 'card', kind: 'component' },
		{ name: 'btn', kind: 'component' },
		{ name: 'layout', kind: 'layout' },
		{ name: 'text', kind: 'utility' },
	],
};
const blocks = [
	['Interaction', 'DropdownSearch'],
	['Interaction', 'DropdownTags'],
	['Content', 'Tooltip'],
	['Content', 'Card'],
	['Adaptive', 'Columns2'],
	['Content', 'DEPRECATED_Card'],
	['Licenses', 'Licenses'],
	['Private', 'MenuDrag', false],
];

test('the two categories and their labels', () => {
	assert.deepEqual([...CATEGORIES], ['component', 'platform']);
	assert.equal(CATEGORY_LABEL.component, 'components (OML blocks)');
	assert.equal(CATEGORY_LABEL.platform, 'platform & layout styles');
});

test('buildUniverse: composable blocks first with their runtime and kind, then the platform styles no block links', () => {
	const rows = buildUniverse([snapshot('ODC', blocks)], registry, inventory);
	assert.deepEqual(
		rows.map((r) => r.id),
		[
			'Adaptive/Columns2',
			'Content/Card',
			'Content/Tooltip',
			'Interaction/DropdownSearch',
			'Interaction/DropdownTags',
			'SwipeEvents',
			'btn',
			'layout',
			'text',
		]
	);
	const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
	assert.deepEqual(byId['Content/Tooltip'], {
		id: 'Content/Tooltip',
		name: 'Tooltip',
		flow: 'Content',
		category: 'component',
		kind: 'pattern',
		runtime: { pattern: 'Tooltip', style: null },
		platform: 'ODC',
	});
	assert.deepEqual(byId['Content/Card'].runtime, { pattern: null, style: 'card' });
	assert.equal(byId['Content/Card'].kind, 'component');
	assert.equal(byId['Adaptive/Columns2'].kind, 'block');
	assert.equal(byId['Adaptive/Columns2'].category, 'component');
	assert.deepEqual(byId.btn, {
		id: 'btn',
		name: 'btn',
		flow: null,
		category: 'platform',
		kind: 'component',
		runtime: { pattern: null, style: 'btn' },
		platform: '',
	});
	assert.equal(byId.layout.kind, 'layout');
	assert.equal(byId.text.kind, 'utility');
	assert.deepEqual(
		byId.SwipeEvents,
		{
			id: 'SwipeEvents',
			name: 'SwipeEvents',
			flow: null,
			category: 'platform',
			kind: 'pattern',
			runtime: { pattern: 'SwipeEvents', style: null },
			platform: '',
		},
		'a pattern no block drives is a platform row'
	);
	assert.equal(byId['Content/DEPRECATED_Card'], undefined);
	assert.equal(byId['Licenses/Licenses'], undefined);
	assert.equal(byId['Private/MenuDrag'], undefined);
});

test('rowsForResult: a shared pattern feeds every block it drives; a block id feeds itself; a style feeds its block or itself', () => {
	const rows = buildUniverse([snapshot('ODC', blocks)], registry, inventory);
	const index = rowIndex(rows);
	assert.deepEqual(
		rowsForResult(index, 'Dropdown').map((r) => r.id),
		['Interaction/DropdownSearch', 'Interaction/DropdownTags']
	);
	assert.deepEqual(
		rowsForResult(index, 'Content/Card').map((r) => r.id),
		['Content/Card']
	);
	assert.deepEqual(
		rowsForResult(index, 'card').map((r) => r.id),
		['Content/Card']
	);
	assert.deepEqual(
		rowsForResult(index, 'btn').map((r) => r.id),
		['btn']
	);
	assert.deepEqual(rowsForResult(index, 'Renamed'), []);
});

test('two snapshots: ids carry the platform and a pattern feeds the row of each platform', () => {
	const rows = buildUniverse(
		[snapshot('ODC', blocks), snapshot('O11', [['Content', 'Tooltip']])],
		registry,
		inventory
	);
	const ids = rows.map((r) => r.id);
	assert.ok(ids.includes('Content/Tooltip (ODC)') && ids.includes('Content/Tooltip (O11)'));
	assert.deepEqual(
		rowsForResult(rowIndex(rows), 'Tooltip').map((r) => r.id),
		['Content/Tooltip (O11)', 'Content/Tooltip (ODC)']
	);
});

test('a block with a stylesheet link and an API hint to a pattern has one row and the registry runtime', () => {
	const snap = snapshot('ODC', [['Content', 'Card']]);
	snap.blocks['Content/Card'].patternHints.apiCalls = ['TooltipAPI'];
	const rows = buildUniverse([snap], registry, inventory);
	const card = rows.filter((r) => r.id === 'Content/Card');
	assert.equal(card.length, 1);
	assert.deepEqual(card[0].runtime, { pattern: null, style: 'card' });
});

test('no snapshot: platform rows only', () => {
	const rows = buildUniverse([], registry, inventory);
	assert.ok(rows.every((r) => r.category === 'platform'));
	assert.deepEqual(
		rows.map((r) => r.id),
		['Dropdown', 'SwipeEvents', 'Tooltip', 'btn', 'card', 'layout', 'text']
	);
});
