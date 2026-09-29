// @ts-check
/** Freshness check for the generated docs-ai/ set: regenerate into a temp dir and compare. */
import fs from 'node:fs';
import path from 'node:path';

/** @param {string} text */
const normalize = (text) => text.replace(/\r\n/g, '\n');

/**
 * Generated files (in `freshDir`) that differ from, or are missing in, the committed `committedDir`.
 * Files that only exist in the committed dir (e.g. the hand-written JSON Schema) are ignored.
 * @param {string} committedDir
 * @param {string} freshDir
 * @returns {{ file: string, status: 'modified'|'missing' }[]}
 */
export function compareDocs(committedDir, freshDir) {
	/** @type {{ file: string, status: 'modified'|'missing' }[]} */
	const drift = [];
	for (const file of fs.readdirSync(freshDir).filter((f) => fs.statSync(path.join(freshDir, f)).isFile()).sort((a, b) => a.localeCompare(b))) {
		const committed = path.join(committedDir, file);
		if (!fs.existsSync(committed)) {
			drift.push({ file, status: 'missing' });
			continue;
		}
		if (normalize(fs.readFileSync(committed, 'utf8')) !== normalize(fs.readFileSync(path.join(freshDir, file), 'utf8'))) {
			drift.push({ file, status: 'modified' });
		}
	}
	return drift;
}
