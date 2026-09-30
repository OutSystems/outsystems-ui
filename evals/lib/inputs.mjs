// @ts-check
/**
 * The measured inputs of a run, fingerprinted: a loop is a measurement of pattern code, so a run whose
 * pattern sources, stories and agent docs equal the newest recorded run's is not recorded again. Tooling
 * (evals/, workflows, docs-internal), results and generated design tokens do not count.
 *
 * The fingerprint is a SHA-256 over `<path>\n<git blob id>\n` lines of every file under MEASURED_DIRS,
 * sorted by path, so the same value can be derived from a commit's tree (`git ls-tree -r`) without a
 * checkout.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { walk } from './inventory.mjs';
import { insideDir } from './paths.mjs';

/** Repository directories whose content a run measures. */
export const MEASURED_DIRS = ['src', 'stories', 'docs-ai'];
/** Generated from the design-tokens package at build time; not pattern code. */
const EXCLUDED = ['src/scss/tokens/'];

/**
 * Git's blob id of a content: SHA-1 of `blob <size>\0<content>`.
 * @param {Buffer} content
 */
export function blobId(content) {
	return createHash('sha1').update(`blob ${content.length}\0`).update(content).digest('hex');
}

/**
 * A checkout may carry CRLF where git stores LF (core.autocrlf); hash what git stores.
 * @param {Buffer} content
 */
function normalised(content) {
	return content.includes(13) ? Buffer.from(content.toString('utf8').replace(/\r\n/g, '\n')) : content;
}

/** Code-point order, the order `git ls-tree` lists paths in. @param {string} a @param {string} b */
function byCodePoint(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

/**
 * Fingerprint of the measured inputs of a checkout (line endings normalised to LF, as git stores them).
 * @param {string} root repository root
 */
export function measuredFingerprint(root) {
	const hash = createHash('sha256');
	/** @type {string[]} */
	const files = [];
	for (const dir of MEASURED_DIRS) {
		for (const f of walk(insideDir(root, dir))) {
			const rel = path.relative(root, f).split(path.sep).join('/');
			if (EXCLUDED.some((x) => rel.startsWith(x))) continue;
			files.push(rel);
		}
	}
	files.sort((a, b) => byCodePoint(a, b));
	for (const rel of files) {
		hash.update(`${rel}\n${blobId(normalised(fs.readFileSync(insideDir(root, rel))))}\n`);
	}
	return hash.digest('hex');
}

/**
 * Whether a run with this fingerprint should be recorded in the history: not when the newest entry
 * measured the same inputs, unless forced. Entries without a fingerprint cannot block.
 * @param {{ label: string, date: string, inputs?: string }[]} history
 * @param {string} inputs
 * @param {boolean} [force]
 * @returns {{ record: boolean, same: string|null }}
 */
export function shouldRecord(history, inputs, force = false) {
	const newest = [...history].sort((a, b) => a.date.localeCompare(b.date))[history.length - 1];
	const same = newest && newest.inputs === inputs ? newest.label : null;
	return { record: force || same === null, same };
}
