import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { exportPlan, LOCAL_DIR, localOml } from '../tools/export-snapshot.mjs';

const source = {
	module: 'OutSystemsUI',
	platform: 'ODC',
	origin: {
		repository: 'OutSystems/OutSystems.Tenant.Starter.Apps',
		path: 'src/10_Base/OutSystemsUI.oml',
		commit: 'f7ca45590532e200d7e394b7d6ed9e8e34d53801',
		blobSha: 'x',
		sha256: 'y',
	},
};

test("with no local OML the plan reads GitHub at the snapshot's pinned commit, or the commit given", () => {
	const plan = exportPlan({ local: null, source, platform: 'ODC', out: 'evals/model/osui.blocks.json' });
	assert.deepEqual(plan.args, [
		'--github',
		'OutSystems/OutSystems.Tenant.Starter.Apps@f7ca45590532e200d7e394b7d6ed9e8e34d53801:src/10_Base/OutSystemsUI.oml',
		'--platform',
		'ODC',
		'-o',
		'evals/model/osui.blocks.json',
	]);
	assert.equal(plan.from, 'github');
	const pinned = exportPlan({ local: null, source, platform: 'ODC', out: 'o.json', commit: 'a'.repeat(40) });
	assert.ok(pinned.args[1].includes(`@${'a'.repeat(40)}:`));
});

test('a local OML takes precedence over GitHub and the plan says so', () => {
	const plan = exportPlan({ local: 'evals/model/local/OutSystemsUI.oml', source, platform: 'ODC', out: 'o.json' });
	assert.deepEqual(plan.args, ['--oml', 'evals/model/local/OutSystemsUI.oml', '--platform', 'ODC', '-o', 'o.json']);
	assert.equal(plan.from, 'local');
});

test('without a snapshot and without a local OML the plan needs a commit', () => {
	assert.throws(() => exportPlan({ local: null, source: null, platform: 'ODC', out: 'o.json' }), /--commit/);
});

test('localOml finds the one .oml file of the local folder, or null', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-local-'));
	assert.equal(localOml(dir), null, 'an empty folder means GitHub');
	fs.writeFileSync(path.join(dir, 'notes.txt'), 'x');
	assert.equal(localOml(dir), null);
	fs.writeFileSync(path.join(dir, 'OutSystemsUI.oml'), 'oml');
	assert.equal(localOml(dir), path.join(dir, 'OutSystemsUI.oml'));
	fs.writeFileSync(path.join(dir, 'Other.oml'), 'oml');
	assert.throws(() => localOml(dir), /one \.oml/);
	fs.rmSync(dir, { recursive: true, force: true });
	assert.equal(localOml(path.join(dir, 'missing')), null, 'a missing folder means GitHub');
	assert.equal(LOCAL_DIR, 'evals/model/local');
});

test('localOml finds a .oml file nested in a subfolder of the local folder', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-local-nested-'));
	fs.mkdirSync(path.join(dir, '.oml'));
	fs.writeFileSync(path.join(dir, '.oml', 'OutSystems UI.oml'), 'oml');
	assert.equal(localOml(dir), path.join(dir, '.oml', 'OutSystems UI.oml'));
	fs.rmSync(dir, { recursive: true, force: true });
});

test('exporterDir finds the exporter beside the repository or beside the worktrees folder, or honours the env variable', async () => {
	const { exporterDir } = await import('../tools/export-snapshot.mjs');
	const base = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-exp-'));
	const root = path.join(base, 'repos.worktrees', 'branch');
	fs.mkdirSync(root, { recursive: true });
	assert.throws(() => exporterDir(root, {}), /set OSUI_BLOCKS_EXPORT/);
	fs.mkdirSync(path.join(base, 'osui-blocks-export'));
	fs.writeFileSync(path.join(base, 'osui-blocks-export', 'osui-blocks-export.csproj'), '<Project/>');
	assert.equal(
		exporterDir(root, {}),
		path.join(base, 'osui-blocks-export'),
		'two levels up, beside the worktrees folder'
	);
	assert.equal(
		exporterDir(root, { OSUI_BLOCKS_EXPORT: path.join(base, 'osui-blocks-export') }),
		path.join(base, 'osui-blocks-export')
	);
	fs.rmSync(base, { recursive: true, force: true });
});

test('dotnetPath is the dotnet executable under DOTNET_ROOT, else the one found on PATH, else an error', async () => {
	const { dotnetPath } = await import('../tools/export-snapshot.mjs');
	const base = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-dotnet-'));
	const exe = process.platform === 'win32' ? 'dotnet.exe' : 'dotnet';
	const onPath = path.join(base, 'bin');
	const root = path.join(base, 'root');
	fs.mkdirSync(onPath);
	fs.mkdirSync(root);
	assert.throws(() => dotnetPath({ PATH: onPath }), /dotnet not found/);
	fs.writeFileSync(path.join(onPath, exe), '');
	assert.equal(dotnetPath({ PATH: [path.join(base, 'empty'), onPath].join(path.delimiter) }), path.join(onPath, exe));
	assert.throws(() => dotnetPath({ DOTNET_ROOT: root, PATH: onPath }), /DOTNET_ROOT/);
	fs.writeFileSync(path.join(root, exe), '');
	assert.equal(dotnetPath({ DOTNET_ROOT: root, PATH: onPath }), path.join(root, exe));
	fs.rmSync(base, { recursive: true, force: true });
});
