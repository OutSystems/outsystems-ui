// @ts-check
/**
 * Shared, lazily-built context handed to every metric: inventory, TypeScript program,
 * compiled-CSS cache, token counter and the agent-docs directory.
 */
import fs from 'node:fs';
import path from 'node:path';

import { insideDir, isRefName } from './paths.mjs';

/**
 * Abbreviated commit id of HEAD read from the repository metadata (works for linked worktrees), without
 * spawning git. Returns 'unknown' when the checkout has no readable metadata.
 * @param {string} root
 */
export function readHeadCommit(root) {
	try {
		const gitDir = resolveGitDir(path.resolve(root));
		if (!gitDir) return 'unknown';
		const head = fs.readFileSync(insideDir(gitDir, 'HEAD'), 'utf8').trim();
		const commit = head.startsWith('ref:')
			? resolveRef(gitDir, head.slice('ref:'.length).trim())
			: head.slice(0, 9);
		return shortCommitId(commit);
	} catch {
		return 'unknown';
	}
}

/**
 * Name of the branch HEAD points at (`refs/heads/<name>` → `<name>`), or null for a detached HEAD or
 * unreadable metadata. Read from the repository metadata, without spawning git.
 * @param {string} root
 * @returns {string|null}
 */
export function readHeadBranch(root) {
	try {
		const gitDir = resolveGitDir(path.resolve(root));
		if (!gitDir) return null;
		const head = fs.readFileSync(insideDir(gitDir, 'HEAD'), 'utf8').trim();
		if (!head.startsWith('ref: refs/heads/')) return null;
		const ref = head.slice('ref: '.length);
		return isRefName(ref) ? ref.slice('refs/heads/'.length) : null;
	} catch {
		return null;
	}
}

/**
 * Only a short hexadecimal object id is ever returned (and later printed); anything else is 'unknown'.
 * @param {string|null} commit
 */
function shortCommitId(commit) {
	if (!commit) return 'unknown';
	const id = commit.toLowerCase().slice(0, 9);
	return /^[0-9a-f]{4,9}$/.test(id) ? id : 'unknown';
}

/**
 * The `.git` metadata directory of a checkout. `base` is the repository root chosen on the command
 * line; only its `.git` entry is read, and a linked-worktree pointer is honoured only when it names a
 * `.git` metadata directory.
 * @param {string} base resolved repository root
 * @returns {string|null}
 */
function resolveGitDir(base) {
	if (!fs.statSync(base).isDirectory()) return null;
	const gitDir = insideDir(base, '.git');
	if (!fs.statSync(gitDir).isFile()) return gitDir;
	const pointer = fs.readFileSync(gitDir, 'utf8').trim();
	if (!pointer.startsWith('gitdir:')) return null;
	const target = path.resolve(base, pointer.slice('gitdir:'.length).trim());
	return target.split(path.sep).includes('.git') ? target : null;
}

/**
 * Abbreviated commit id a symbolic ref points at, from a loose ref file or `packed-refs`. A linked worktree keeps
 * its refs in the common directory recorded in `commondir`.
 * @param {string} gitDir
 * @param {string} ref e.g. `refs/heads/dev`; anything but a plain `refs/…` name is rejected
 * @returns {string|null}
 */
function resolveRef(gitDir, ref) {
	if (!isRefName(ref)) return null;
	const commonDir = resolveCommonDir(gitDir);
	if (!commonDir) return null;
	// the ref name is validated above and the result is confined to the common directory
	const refFile = insideDir(commonDir, ...ref.split('/'));
	if (fs.existsSync(refFile)) return fs.readFileSync(refFile, 'utf8').trim().slice(0, 9);
	const packed = insideDir(commonDir, 'packed-refs');
	if (!fs.existsSync(packed)) return null;
	for (const line of fs.readFileSync(packed, 'utf8').split('\n')) {
		const [commit, name] = line.trim().split(' ');
		if (name === ref && commit) return commit.slice(0, 9);
	}
	return null;
}

/**
 * The directory holding the refs: the metadata directory itself, or for a linked worktree the
 * `.git` directory named by its `commondir` file (accepted only when it is a `.git` directory).
 * @param {string} gitDir
 * @returns {string|null}
 */
function resolveCommonDir(gitDir) {
	const commonDirFile = insideDir(gitDir, 'commondir');
	if (!fs.existsSync(commonDirFile)) return gitDir;
	const target = path.resolve(gitDir, fs.readFileSync(commonDirFile, 'utf8').trim());
	return path.basename(target) === '.git' && fs.statSync(target).isDirectory() ? target : null;
}

import { buildInventory } from './inventory.mjs';
import { compileScss } from './scss.mjs';
import { countFilesTokens, countFileTokens, countTokens, tokenizerName } from './tokens.mjs';
import { createProgram } from './ts.mjs';

/**
 * @typedef {ReturnType<typeof createContext>} EvalContext
 */

/**
 * @param {string} root repository root
 * @param {{ docsAiDir?: string, program?: import('typescript').Program }} [options]
 */
export function createContext(root, options = {}) {
	const inventory = buildInventory(root);
	const docsAiDir = options.docsAiDir ?? path.join(root, 'docs-ai');
	/** @type {import('typescript').Program|undefined} */
	let program = options.program;
	/** @type {Map<string, { css: string|null, error: string|null }>} */
	const cssCache = new Map();
	/** @type {Map<string, string>} */
	const textCache = new Map();

	const ctx = {
		root,
		inventory,
		docsAiDir,
		tokenizerName,
		/** File paths handed to the token counters must lie inside the repository. */
		tokens: {
			countTokens,
			countFileTokens: (/** @type {string} */ file) => countFileTokens(insideDir(root, file)),
			countFilesTokens: (/** @type {string[]} */ files) => countFilesTokens(files.map((f) => insideDir(root, f))),
		},

		/** One program compiled with `noImplicitAny` so E04 can read the diagnostics. */
		get program() {
			if (!program) program = createProgram(root, { noImplicitAny: true });
			return program;
		},

		/**
		 * @param {string} file
		 */
		readText(file) {
			let text = textCache.get(file);
			if (text === undefined) {
				const safe = insideDir(root, file);
				text = fs.existsSync(safe) ? fs.readFileSync(safe, 'utf8') : '';
				textCache.set(file, text);
			}
			return text;
		},

		/**
		 * Standalone compile of a component SCSS partial, cached.
		 * @param {string} file
		 */
		compiledCss(file) {
			let hit = cssCache.get(file);
			if (!hit) {
				hit = compileScss(insideDir(root, file), { loadPaths: [path.join(root, 'src', 'scss')] });
				cssCache.set(file, hit);
			}
			return hit;
		},

		/**
		 * Text of a file under docs-ai/, or null when absent.
		 * @param {string} name
		 */
		docsAi(name) {
			const file = insideDir(docsAiDir, name);
			return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
		},

		/** Abbreviated commit id of the working tree HEAD, or 'unknown'. */
		headCommit() {
			return readHeadCommit(root);
		},

		/** Branch of the working tree HEAD, or null when detached. */
		headBranch() {
			return readHeadBranch(root);
		},

		/** @param {string} file */
		rel(file) {
			return path.relative(root, file).split(path.sep).join('/');
		},
	};
	return ctx;
}
