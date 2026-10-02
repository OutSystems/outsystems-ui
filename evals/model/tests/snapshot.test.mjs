import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
	blockKey,
	flattenBlocks,
	isFreeText,
	loadSnapshots,
	composableBlocks,
	snapshotFiles,
	staticEntitiesReferenced,
	validateSnapshot,
} from '../lib/snapshot.mjs';

/** A minimal valid snapshot; tests mutate copies of it. */
export function sample(platform = 'ODC') {
	return {
		version: 1,
		source: {
			module: 'OutSystemsUI',
			platform,
			moduleVersion: null,
			lastModifiedUtc: null,
			omlKey: null,
			origin: { sha256: 'abc' },
			exporter: 'test',
			exportedAt: null,
		},
		staticEntities: {
			Color: { description: '', records: [{ identifier: 'Transparent', label: 'Transparent', attributes: {} }] },
		},
		structures: {
			ItemsPerSlide: {
				description: '',
				attributes: [
					{
						name: 'Desktop',
						type: 'Integer',
						typeKind: 'basic',
						typeRef: null,
						mandatory: false,
						default: '1',
						description: '',
					},
				],
			},
		},
		blocks: {
			'Interaction/Carousel': {
				flow: 'Interaction',
				name: 'Carousel',
				public: true,
				description: 'A carousel.',
				inputParameters: [
					{
						name: 'ItemsPerSlide',
						type: 'ItemsPerSlide',
						typeKind: 'structure',
						typeRef: 'ItemsPerSlide',
						mandatory: false,
						default: null,
						description: 'Items per slide.',
					},
					{
						name: 'Color',
						type: 'Color Identifier',
						typeKind: 'staticEntity',
						typeRef: 'Color',
						mandatory: false,
						default: 'Entities.Color.Transparent',
						description: '',
					},
					{
						name: 'ExtendedClass',
						type: 'Text',
						typeKind: 'basic',
						typeRef: null,
						mandatory: false,
						default: '""',
						description: 'Extra classes.',
					},
				],
				placeholders: [{ name: 'CarouselItems', description: 'The slides.' }],
				events: [
					{
						name: 'OnSlideMoved',
						mandatory: false,
						description: '',
						parameters: [{ name: 'Position', type: 'Integer', description: '' }],
					},
				],
				requiredScripts: [],
				patternHints: { apiCalls: ['CarouselAPI'] },
			},
			'Content/Internal': {
				flow: 'Content',
				name: 'Internal',
				public: false,
				description: '',
				inputParameters: [],
				placeholders: [],
				events: [],
				requiredScripts: [],
				patternHints: { apiCalls: [] },
			},
		},
	};
}

test('a conforming snapshot has no violations; a missing block field and a bad typeKind are reported', () => {
	assert.deepEqual(validateSnapshot(sample()), []);
	const broken = sample();
	delete broken.blocks['Interaction/Carousel'].flow;
	broken.blocks['Interaction/Carousel'].inputParameters[0].typeKind = 'struct';
	const paths = validateSnapshot(broken).map((v) => v.path);
	assert.ok(paths.includes('$.blocks.Interaction/Carousel.flow'));
	assert.ok(paths.includes('$.blocks.Interaction/Carousel.inputParameters[0].typeKind'));
});

test('snapshotFiles lists osui.blocks*.json but never the schema, sorted; loadSnapshots reads them', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-snap-'));
	fs.writeFileSync(path.join(dir, 'osui.blocks.schema.json'), '{}');
	fs.writeFileSync(path.join(dir, 'osui.blocks.o11.json'), JSON.stringify(sample('O11')));
	fs.writeFileSync(path.join(dir, 'osui.blocks.json'), JSON.stringify(sample('ODC')));
	assert.deepEqual(
		snapshotFiles(dir).map((f) => path.basename(f)),
		['osui.blocks.json', 'osui.blocks.o11.json']
	);
	assert.equal(loadSnapshots(dir).length, 2);
});

test('flattenBlocks labels duplicates by platform and keeps both rows', () => {
	const rows = flattenBlocks([sample('ODC'), sample('O11')]);
	assert.deepEqual(
		rows.map((r) => r.label).sort((a, b) => (a < b ? -1 : Number(a > b))),
		['Content/Internal (O11)', 'Content/Internal (ODC)', 'Interaction/Carousel (O11)', 'Interaction/Carousel (ODC)']
	);
	const single = flattenBlocks([sample('ODC')]);
	assert.deepEqual(
		single.map((r) => r.label),
		['Content/Internal', 'Interaction/Carousel']
	);
	assert.equal(blockKey({ flow: 'A', name: 'B' }), 'A/B');
	assert.deepEqual(
		composableBlocks(single).map((r) => r.key),
		['Interaction/Carousel']
	);
});

test('staticEntitiesReferenced and isFreeText read parameter types', () => {
	assert.deepEqual([...staticEntitiesReferenced([sample()])], ['Color']);
	const params = sample().blocks['Interaction/Carousel'].inputParameters;
	assert.equal(isFreeText(params[0]), false, 'a structure is precise');
	assert.equal(isFreeText(params[2]), true, 'free Text is not');
	assert.equal(isFreeText({ typeKind: 'other', type: 'Object' }), true);
	assert.equal(isFreeText({ typeKind: 'basic', type: 'Integer' }), false);
});

test('the committed snapshot, when present, conforms to the schema', () => {
	for (const s of loadSnapshots()) assert.deepEqual(validateSnapshot(s), [], s.file);
});

test('composableBlocks keeps public blocks that are not deprecated and not the Licenses block', async () => {
	const { isComposable, LICENSES_KEY } = await import('../lib/snapshot.mjs');
	const row = (flow, name, pub = true) => ({
		flow,
		name,
		key: `${flow}/${name}`,
		label: `${flow}/${name}`,
		public: pub,
	});
	const rows = [
		row('Content', 'Card'),
		row('Content', 'DEPRECATED_Accordion'),
		row('Licenses', 'Licenses'),
		row('Private', 'MenuDrag', false),
	];
	assert.deepEqual(
		composableBlocks(rows).map((r) => r.key),
		['Content/Card']
	);
	assert.equal(LICENSES_KEY, 'Licenses/Licenses');
	assert.equal(isComposable(row('Adaptive', 'Columns2')), true);
	assert.equal(isComposable(row('Content', 'DEPRECATED_Card')), false);
});
