// @ts-check
/**
 * Shared, lazily-built context handed to the docs generators: inventory, TypeScript program,
 * compiled-CSS cache, token counter and the agent-docs directory.
 */
import fs from 'node:fs';
import path from 'node:path';

import { insideDir } from './paths.mjs';

import { buildInventory } from './inventory.mjs';
import { compileScss } from './scss.mjs';
import { countFilesTokens, countFileTokens, countTokens, tokenizerName } from './tokens.mjs';
import { createProgram } from './ts.mjs';
import { loadSnapshots } from './snapshot.mjs';

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

		/** The repository's TypeScript program, compiled once with the repository tsconfig. */
		get program() {
			if (!program) program = createProgram(root);
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

		/** The block snapshots under scripts/ai-docs/snapshot (empty when none); tests inject their own. */
		modelSnapshots() {
			return loadSnapshots(insideDir(root, 'scripts', 'ai-docs', 'snapshot'));
		},


		/** @param {string} file */
		rel(file) {
			return path.relative(root, file).split(path.sep).join('/');
		},
	};
	return ctx;
}
