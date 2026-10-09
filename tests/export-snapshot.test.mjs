import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { exporterDir, localOml, parseArgs } from '../scripts/ai-docs/export-snapshot.mjs';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'osui-oml-'));

test('localOml: a missing folder or one without .oml files is a clear error that names the folder', () => {
	const missing = path.join(tmp(), 'nope');
	assert.throws(() => localOml(missing), new RegExp(`no \\.oml file under .*nope`));
	const empty = tmp();
	fs.writeFileSync(path.join(empty, 'readme.txt'), '');
	assert.throws(() => localOml(empty), /no \.oml file under/);
});

test('localOml: one .oml at any depth is found; two is an error', () => {
	const deep = tmp();
	fs.mkdirSync(path.join(deep, 'nested'));
	fs.writeFileSync(path.join(deep, 'nested', 'OutSystems UI.oml'), '');
	assert.equal(path.basename(localOml(deep)), 'OutSystems UI.oml');
	fs.writeFileSync(path.join(deep, 'other.oml'), '');
	assert.throws(() => localOml(deep), /holds 2 \.oml files/);
});

test('parseArgs: only --platform ODC|O11 is accepted', () => {
	assert.deepEqual(parseArgs([]), { platform: 'ODC' });
	assert.deepEqual(parseArgs(['--platform', 'O11']), { platform: 'O11' });
	assert.throws(() => parseArgs(['--platform', 'web']), /unknown argument/);
	assert.throws(() => parseArgs(['--github', 'abc']), /unknown argument/);
});

test('exporterDir: OSUI_BLOCKS_EXPORT wins, else the sibling folder; a clear error otherwise', () => {
	const root = tmp();
	const sibling = path.join(root, '..', 'osui-blocks-export');
	assert.throws(() => exporterDir(root, {}), /OSUI_BLOCKS_EXPORT/);
	const custom = tmp();
	fs.writeFileSync(path.join(custom, 'osui-blocks-export.csproj'), '');
	assert.equal(exporterDir(root, { OSUI_BLOCKS_EXPORT: custom }), custom);
	assert.ok(!fs.existsSync(sibling) || exporterDir(root, {}) === path.resolve(sibling));
});
