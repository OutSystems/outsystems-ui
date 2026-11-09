// @ts-check
/** Freshness check for the generated docs-ai/ set: regenerate into a temp dir and compare. */
import fs from 'node:fs';

import { insideDir } from './paths.mjs';

/** @param {string} text */
const normalize = (text) => text.replaceAll('\r\n', '\n');

/**
 * Files under `dir`, recursively, as `/`-separated relative paths, sorted.
 * @param {string} dir
 * @param {string[]} [prefix]
 * @returns {string[]}
 */
function listFiles(dir, prefix = []) {
	/** @type {string[]} */
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const rel = [...prefix, entry.name];
		if (entry.isDirectory()) out.push(...listFiles(insideDir(dir, entry.name), rel));
		else if (entry.isFile()) out.push(rel.join('/'));
	}
	return out.sort((a, b) => a.localeCompare(b));
}

/** The files of docs-ai/ written by hand rather than by the generator: the schemas of the two manifests. */
export const HAND_WRITTEN = ['schema/osui.components.schema.json', 'schema/osui.utilities.schema.json'];

/**
 * Drift between the committed `committedDir` and a fresh generation in `freshDir` (nested directories
 * included): generated files that differ (`modified`) or are not committed (`missing`), and committed files
 * the generator no longer writes (`obsolete`), such as the config schema of a removed or renamed pattern.
 * The hand-written files are never obsolete.
 * @param {string} committedDir
 * @param {string} freshDir
 * @param {string[]} [handWritten]
 * @returns {{ file: string, status: 'modified'|'missing'|'obsolete' }[]}
 */
export function compareDocs(committedDir, freshDir, handWritten = HAND_WRITTEN) {
	/** @type {{ file: string, status: 'modified'|'missing'|'obsolete' }[]} */
	const drift = [];
	const freshFiles = listFiles(freshDir);
	for (const file of freshFiles) {
		const segments = file.split('/');
		const committed = insideDir(committedDir, ...segments);
		if (!fs.existsSync(committed)) {
			drift.push({ file, status: 'missing' });
			continue;
		}
		if (
			normalize(fs.readFileSync(committed, 'utf8')) !==
			normalize(fs.readFileSync(insideDir(freshDir, ...segments), 'utf8'))
		) {
			drift.push({ file, status: 'modified' });
		}
	}
	const generated = new Set(freshFiles);
	const kept = new Set(handWritten);
	for (const file of listFiles(committedDir)) {
		if (!generated.has(file) && !kept.has(file)) drift.push({ file, status: 'obsolete' });
	}
	return drift;
}
