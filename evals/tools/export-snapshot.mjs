#!/usr/bin/env node
// @ts-check
/**
 * Refreshes the block snapshot (evals/model/osui.blocks.json) with the exporter. The OML comes from GitHub at
 * the commit the current snapshot pins (or `--commit <sha>`), unless `evals/model/local/` holds one `.oml`
 * file: then that file is exported, so a fixed module can be iterated on before it reaches the repository.
 * A snapshot exported from a local OML records no repository and is refused by the snapshot test outside an
 * iteration (the local folder is git-ignored).
 *
 *   node evals/tools/export-snapshot.mjs [--commit <40-hex>] [--platform ODC|O11]   (npm run evals:model:export)
 *
 * The exporter is the .NET tool osui-blocks-export, kept outside this repository: its project directory is
 * read from OSUI_BLOCKS_EXPORT, else ../osui-blocks-export next to the repository or next to its worktrees folder.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from '../lib/paths.mjs';

/** The git-ignored folder a fixed OML is dropped in while iterating. */
export const LOCAL_DIR = 'evals/model/local';
export const SNAPSHOT = 'evals/model/osui.blocks.json';

/** Every `.oml` file under a folder, any depth. @param {string} dir */
function omlFiles(dir) {
	/** @type {string[]} */
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const file = insideDir(dir, entry.name);
		if (entry.isDirectory()) out.push(...omlFiles(file));
		else if (entry.name.toLowerCase().endsWith('.oml')) out.push(file);
	}
	return out;
}

/**
 * The one `.oml` file of the local folder (any depth), null when the folder is missing or holds none.
 * @param {string} dir
 */
export function localOml(dir) {
	if (!fs.existsSync(dir)) return null;
	const omls = omlFiles(dir);
	if (omls.length === 0) return null;
	if (omls.length > 1) throw new Error(`${dir} holds ${omls.length} .oml files; keep one .oml in the local folder`);
	return omls[0];
}

/**
 * The exporter's arguments: the local OML when there is one, else GitHub at the pinned (or given) commit.
 * @param {{ local: string|null, source: any, platform: string, out: string, commit?: string }} input
 * @returns {{ from: 'local'|'github', args: string[] }}
 */
export function exportPlan({ local, source, platform, out, commit }) {
	if (local) return { from: 'local', args: ['--oml', local, '--platform', platform, '-o', out] };
	const origin = source?.origin ?? {};
	const sha = commit ?? origin.commit;
	const repository = origin.repository ?? 'OutSystems/OutSystems.Tenant.Starter.Apps';
	const file = origin.path ?? 'src/10_Base/OutSystemsUI.oml';
	if (!sha) throw new Error('no snapshot to read the pinned commit from: give --commit <40-hex sha>');
	return { from: 'github', args: ['--github', `${repository}@${sha}:${file}`, '--platform', platform, '-o', out] };
}

/**
 * The exporter's project directory: OSUI_BLOCKS_EXPORT, else `osui-blocks-export` next to the repository or
 * next to the worktrees folder a checkout may live in.
 * @param {string} root
 * @param {Record<string, string|undefined>} [env]
 */
export function exporterDir(root, env = process.env) {
	const candidates = env.OSUI_BLOCKS_EXPORT
		? [env.OSUI_BLOCKS_EXPORT]
		: [path.resolve(root, '..', 'osui-blocks-export'), path.resolve(root, '..', '..', 'osui-blocks-export')];
	const found = candidates.find((dir) => fs.existsSync(path.join(dir, 'osui-blocks-export.csproj')));
	if (!found) {
		throw new Error(
			`exporter not found at ${candidates.join(' or ')}: set OSUI_BLOCKS_EXPORT to the osui-blocks-export project directory`
		);
	}
	return found;
}

/** @param {string[]} argv */
function parseArgs(argv) {
	/** @type {{ commit?: string, platform: string }} */
	const out = { platform: 'ODC' };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--commit') out.commit = argv[++i];
		else if (argv[i] === '--platform') out.platform = argv[++i];
		else throw new Error(`unknown argument ${argv[i]}`);
	}
	return out;
}

function main() {
	const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
	const args = parseArgs(process.argv.slice(2));
	const snapshotFile = insideDir(root, SNAPSHOT);
	const source = fs.existsSync(snapshotFile) ? JSON.parse(fs.readFileSync(snapshotFile, 'utf8')).source : null;
	const local = localOml(insideDir(root, LOCAL_DIR));
	const plan = exportPlan({ local, source, platform: args.platform, out: snapshotFile, commit: args.commit });
	const exporter = exporterDir(root);
	process.stdout.write(
		plan.from === 'local'
			? `exporting the local OML ${path.relative(root, /** @type {string} */ (local))} (iteration: do not commit this snapshot)\n`
			: `exporting ${plan.args[1]}\n`
	);
	execFileSync('dotnet', ['run', '--project', exporter, '--', ...plan.args], { stdio: 'inherit' });
	const written = JSON.parse(fs.readFileSync(snapshotFile, 'utf8'));
	process.stdout.write(
		`wrote ${path.relative(root, snapshotFile)}: ${Object.keys(written.blocks).length} blocks, sha256 ${written.source.origin.sha256}\n`
	);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
