// @ts-check
/** Freshness check for the generated docs-ai/ set: regenerate into a temp dir and compare. */
import fs from 'node:fs';

import { insideDir } from '../../evals/lib/paths.mjs';

/** @param {string} text */
const normalize = (text) => text.replace(/\r\n/g, '\n');

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

/**
 * Generated files (in `freshDir`, nested directories included) that differ from, or are missing in, the
 * committed `committedDir`. Files that only exist in the committed dir (the hand-written JSON Schemas)
 * are ignored.
 * @param {string} committedDir
 * @param {string} freshDir
 * @returns {{ file: string, status: 'modified'|'missing' }[]}
 */
export function compareDocs(committedDir, freshDir) {
	/** @type {{ file: string, status: 'modified'|'missing' }[]} */
	const drift = [];
	for (const file of listFiles(freshDir)) {
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
	return drift;
}
