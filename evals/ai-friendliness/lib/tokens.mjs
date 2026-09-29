// @ts-check
/**
 * LLM token counting. Uses the `o200k_base` BPE as a cross-vendor proxy: absolute counts differ
 * per model family, but relative comparisons between files and between runs hold.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';

import { encode } from 'gpt-tokenizer/encoding/o200k_base';

export const tokenizerName = 'o200k_base';

/** @type {Map<string, { hash: string, tokens: number }>} */
const cache = new Map();

/**
 * @param {string} text
 * @returns {number}
 */
export function countTokens(text) {
	if (text.length === 0) return 0;
	return encode(text).length;
}

/**
 * Token count of a file, cached by path and content hash.
 * @param {string} file
 * @returns {number}
 */
export function countFileTokens(file) {
	const text = fs.readFileSync(file, 'utf8');
	const hash = createHash('sha1').update(text).digest('hex');
	const hit = cache.get(file);
	if (hit && hit.hash === hash) return hit.tokens;
	const tokens = countTokens(text);
	cache.set(file, { hash, tokens });
	return tokens;
}

/**
 * Sum of token counts over several files.
 * @param {string[]} files
 * @returns {number}
 */
export function countFilesTokens(files) {
	return files.reduce((sum, f) => sum + countFileTokens(f), 0);
}
