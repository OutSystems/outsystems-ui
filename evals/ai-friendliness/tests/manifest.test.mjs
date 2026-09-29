import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { componentFacets, loadManifest } from '../lib/manifest.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-manifest-'));
const fakeCtx = (files) => {
	for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(tmp, name), text);
	return { docsAi: (n) => (fs.existsSync(path.join(tmp, n)) ? fs.readFileSync(path.join(tmp, n), 'utf8') : null) };
};

const expectations = {
	props: [
		{ name: 'MultipleItems', validated: 'boolean', defaultText: 'false' },
		{ name: 'Icon', validated: 'inRange', defaultText: "'Caret'" },
		{ name: 'Label', validated: null, defaultText: null },
	],
	api: ['Create', 'Initialize', 'Dispose'],
	events: ['OnToggle'],
	cssClasses: ['osui-accordion', 'osui-accordion--is-open'],
};

test('loadManifest returns null when the file is missing or invalid', () => {
	assert.equal(loadManifest(fakeCtx({})), null);
	assert.equal(loadManifest(fakeCtx({ 'osui.components.json': '{ not json' })), null);
	assert.equal(loadManifest(fakeCtx({ 'osui.components.json': '{"components":{}}' })), null, 'a version or $schema is required');
});

test('componentFacets scores the six facets against source-derived expectations', () => {
	const manifest = {
		version: '1',
		components: {
			Accordion: {
				props: { MultipleItems: { type: 'boolean', default: false }, Icon: { type: 'string' } },
				api: [{ name: 'Create' }, { name: 'Initialize' }, { name: 'Dispose' }],
				events: ['OnToggle'],
				cssClasses: { Pattern: 'osui-accordion' },
				markup: '<div class="osui-accordion"></div>',
			},
		},
	};
	const r = componentFacets(manifest, 'Accordion', expectations);
	assert.equal(r.facets.props, 2 / 3);
	assert.equal(r.facets.defaults, 1 / 2, 'Icon has a default in source but none in the manifest');
	assert.equal(r.facets.api, 1);
	assert.equal(r.facets.events, 1);
	assert.equal(r.facets.cssClasses, 1 / 2);
	assert.equal(r.facets.markup, 1);
	assert.ok(Math.abs(r.score - (2 / 3 + 1 / 2 + 1 + 1 + 1 / 2 + 1) / 6) < 1e-9);
});

test('componentFacets: missing entry scores 0 and not-applicable facets are skipped', () => {
	assert.equal(componentFacets({ version: '1', components: {} }, 'Nope', expectations).score, 0);
	const r = componentFacets(
		{ version: '1', components: { X: { props: {}, api: [], events: [], cssClasses: {}, markup: '' } } },
		'X',
		{ props: [], api: [], events: [], cssClasses: [] }
	);
	assert.deepEqual(Object.keys(r.facets), ['markup'], 'only markup applies when the source declares nothing else');
	assert.equal(r.score, 0);
});
