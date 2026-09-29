// @ts-check
/**
 * Shared, lazily-built context handed to every metric: inventory, TypeScript program,
 * compiled-CSS cache, token counter and the agent-docs directory.
 */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Short SHA of HEAD read from the repository metadata (works for linked worktrees), without
 * spawning git. Returns 'unknown' when the checkout has no readable metadata.
 * @param {string} root
 */
export function readGitSha(root) {
	try {
		// `root` is the repository root chosen on the command line; only its `.git` entry is read,
		// and a worktree pointer is honoured only when it names a `.git` metadata directory.
		const base = path.resolve(root);
		if (!fs.statSync(base).isDirectory()) return 'unknown';
		let gitDir = path.join(base, '.git');
		if (fs.statSync(gitDir).isFile()) {
			const pointer = fs.readFileSync(gitDir, 'utf8').trim();
			if (!pointer.startsWith('gitdir:')) return 'unknown';
			const target = path.resolve(base, pointer.slice('gitdir:'.length).trim());
			if (!target.split(path.sep).includes('.git')) return 'unknown';
			gitDir = target;
		}
		const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
		if (!head.startsWith('ref:')) return head.slice(0, 9);
		const ref = head.slice('ref:'.length).trim();
		// a linked worktree keeps refs in the common dir
		const commonDirFile = path.join(gitDir, 'commondir');
		const commonDir = fs.existsSync(commonDirFile)
			? path.resolve(gitDir, fs.readFileSync(commonDirFile, 'utf8').trim())
			: gitDir;
		const refFile = path.join(commonDir, ref);
		if (fs.existsSync(refFile)) return fs.readFileSync(refFile, 'utf8').trim().slice(0, 9);
		const packed = path.join(commonDir, 'packed-refs');
		if (fs.existsSync(packed)) {
			for (const line of fs.readFileSync(packed, 'utf8').split('\n')) {
				const [sha, name] = line.trim().split(' ');
				if (name === ref && sha) return sha.slice(0, 9);
			}
		}
		return 'unknown';
	} catch {
		return 'unknown';
	}
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
		tokens: { countTokens, countFileTokens, countFilesTokens },

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
				text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
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
				hit = compileScss(file, { loadPaths: [path.join(root, 'src', 'scss')] });
				cssCache.set(file, hit);
			}
			return hit;
		},

		/**
		 * Text of a file under docs-ai/, or null when absent.
		 * @param {string} name
		 */
		docsAi(name) {
			const file = path.join(docsAiDir, name);
			return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
		},

		/** Short git SHA of the working tree HEAD, or 'unknown'. */
		gitSha() {
			return readGitSha(root);
		},

		/** @param {string} file */
		rel(file) {
			return path.relative(root, file).split(path.sep).join('/');
		},
	};
	return ctx;
}
