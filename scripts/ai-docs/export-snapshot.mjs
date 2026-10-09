#!/usr/bin/env node
// @ts-check
/**
 * Refreshes the block snapshot (scripts/ai-docs/snapshot/osui.blocks.json) from a local OutSystems UI OML.
 *
 * Drop the module as the one `.oml` file under scripts/ai-docs/snapshot/local/ (git-ignored, any depth) and run
 *
 *   npm run blocks:export [-- --platform ODC|O11]
 *
 * The committed snapshot is pinned to that file by name and SHA-256 (`source.origin`). The OML itself is never
 * committed. After a refresh run `npm run docs:ai` so the block docs under docs-ai/ follow the snapshot.
 *
 * The exporter is the .NET tool osui-blocks-export, kept outside this repository: its project directory is
 * read from OSUI_BLOCKS_EXPORT, else ../osui-blocks-export next to the repository or next to its worktrees folder.
 * It runs with the dotnet executable under DOTNET_ROOT, else the first one found on PATH, by its full path.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from './lib/paths.mjs';

/** The git-ignored folder the OutSystems UI OML to export is dropped in. */
export const LOCAL_DIR = 'scripts/ai-docs/snapshot/local';
export const SNAPSHOT = 'scripts/ai-docs/snapshot/osui.blocks.json';

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
 * The one `.oml` file of the local folder (any depth); an error names the folder when it is missing, empty
 * or holds more than one.
 * @param {string} dir
 */
export function localOml(dir) {
	const omls = fs.existsSync(dir) ? omlFiles(dir) : [];
	if (omls.length === 0) throw new Error(`no .oml file under ${dir}: drop the OutSystems UI module there`);
	if (omls.length > 1) throw new Error(`${dir} holds ${omls.length} .oml files; keep one .oml in the local folder`);
	return omls[0];
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

/**
 * The full path of the dotnet executable: under DOTNET_ROOT when set, else the first one on PATH. Resolved
 * once here so the exporter is never run by a bare name looked up at call time.
 * @param {Record<string, string|undefined>} [env]
 */
export function dotnetPath(env = process.env) {
	const exe = process.platform === 'win32' ? 'dotnet.exe' : 'dotnet';
	if (env.DOTNET_ROOT) {
		const file = path.join(env.DOTNET_ROOT, exe);
		if (!fs.existsSync(file)) throw new Error(`DOTNET_ROOT is set but ${file} does not exist`);
		return file;
	}
	const dirs = (env.PATH ?? env.Path ?? '').split(path.delimiter).filter(Boolean);
	const found = dirs.map((dir) => path.join(dir, exe)).find((file) => fs.existsSync(file));
	if (!found) throw new Error('dotnet not found on PATH: install the .NET SDK or set DOTNET_ROOT to its folder');
	return found;
}

/** @param {string[]} argv */
export function parseArgs(argv) {
	const out = { platform: 'ODC' };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--platform' && ['ODC', 'O11'].includes(argv[i + 1])) out.platform = argv[++i];
		else throw new Error(`unknown argument ${argv[i]}; usage: npm run blocks:export [-- --platform ODC|O11]`);
	}
	return out;
}

function main() {
	const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
	const { platform } = parseArgs(process.argv.slice(2));
	const snapshotFile = insideDir(root, SNAPSHOT);
	const local = localOml(insideDir(root, LOCAL_DIR));
	const exporter = exporterDir(root);
	const dotnet = dotnetPath();
	process.stdout.write(`exporting the local OML ${path.relative(root, local)}\n`);
	execFileSync(dotnet, ['run', '--project', exporter, '--', '--oml', local, '--platform', platform, '-o', snapshotFile], {
		stdio: 'inherit',
	});
	// The exporter records only the SHA-256 for a local file; name the file so the pin is readable.
	const written = JSON.parse(fs.readFileSync(snapshotFile, 'utf8'));
	written.source.origin = { ...written.source.origin, path: path.basename(local) };
	fs.writeFileSync(snapshotFile, JSON.stringify(written, null, '\t') + '\n');
	process.stdout.write(
		`wrote ${path.relative(root, snapshotFile)}: ${Object.keys(written.blocks).length} blocks, sha256 ${written.source.origin.sha256}\n`
	);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
