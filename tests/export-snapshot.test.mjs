import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { exporterDir, localOml, parseArgs } from '../scripts/docs-ai-generator/export-snapshot.mjs';

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
	// exporterDir looks one and two levels above the root, so the root sits two levels inside a unique folder:
	// both candidates are then private to this test instead of shared names such as <tmpdir>/osui-blocks-export
	const parent = tmp();
	const root = path.join(parent, 'a', 'repo');
	fs.mkdirSync(root, { recursive: true });
	const sibling = path.join(parent, 'a', 'osui-blocks-export');
	const grandparentSibling = path.join(parent, 'osui-blocks-export');
	assert.throws(() => exporterDir(root, {}), /OSUI_BLOCKS_EXPORT/);
	const custom = tmp();
	fs.writeFileSync(path.join(custom, 'osui-blocks-export.csproj'), '');
	assert.equal(exporterDir(root, { OSUI_BLOCKS_EXPORT: custom }), custom);
	fs.mkdirSync(grandparentSibling);
	fs.writeFileSync(path.join(grandparentSibling, 'osui-blocks-export.csproj'), '');
	assert.equal(exporterDir(root, {}), grandparentSibling, 'the folder two levels up is found');
	fs.mkdirSync(sibling);
	fs.writeFileSync(path.join(sibling, 'osui-blocks-export.csproj'), '');
	assert.equal(exporterDir(root, {}), sibling, 'the sibling wins over the folder two levels up');
});
