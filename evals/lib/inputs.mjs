// @ts-check
/**
 * The measured inputs of a run, fingerprinted: a loop is a measurement of pattern code, so a run whose
 * pattern sources, stories and agent docs equal the newest recorded run's is not recorded again. Tooling
 * (evals/, workflows, docs-internal), results and generated design tokens do not count.
 *
 * The fingerprint is a SHA-256 over `<path>\n<git blob id>\n` lines of every file under MEASURED_DIRS,
 * sorted by path. The blob ids come from `git hash-object`, so they are exactly the ids of the
 * committed tree (git applies its own line-ending filters) and the same value can be derived from a
 * commit with `git ls-tree -r`, without a checkout.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';

import { walk } from './inventory.mjs';
import { insideDir } from './paths.mjs';

/** Repository directories whose content a run measures. */
export const MEASURED_DIRS = ['src', 'stories', 'docs-ai'];
/** Generated from the design-tokens package at build time; not pattern code. */
const EXCLUDED = ['src/scss/tokens/'];

/** @param {string[]} args @param {{ cwd?: string, input?: string|Buffer }} [options] */
function git(args, options = {}) {
	return execFileSync('git', args, { ...options, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

/**
 * Git's blob id of a content, as `git hash-object --stdin` computes it.
 * @param {Buffer} content
 */
export function blobId(content) {
	return git(['hash-object', '--stdin'], { input: content }).trim();
}

/**
 * Git's blob ids of files, in the order given, from one `git hash-object --stdin-paths` call. Inside a
 * repository git applies the clean filters of each path (line endings), so a CRLF checkout hashes to the
 * id of the committed LF content.
 * @param {string} root directory the paths are relative to
 * @param {string[]} relPaths `/`-separated paths under `root`
 * @returns {string[]}
 */
export function blobIds(root, relPaths) {
	if (relPaths.length === 0) return [];
	for (const rel of relPaths) insideDir(root, rel);
	const out = git(['hash-object', '--stdin-paths'], { cwd: root, input: `${relPaths.join('\n')}\n` });
	const ids = out.trim().split(/\r?\n/);
	if (ids.length !== relPaths.length)
		throw new Error(`git hash-object returned ${ids.length} ids for ${relPaths.length} paths`);
	return ids;
}

/** Code-point order, the order `git ls-tree` lists paths in. @param {string} a @param {string} b */
function byCodePoint(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

/**
 * Fingerprint of the measured inputs of a checkout.
 * @param {string} root repository root
 */
export function measuredFingerprint(root) {
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
	const ids = blobIds(root, files);
	const hash = createHash('sha256');
	files.forEach((rel, i) => hash.update(`${rel}\n${ids[i]}\n`));
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
