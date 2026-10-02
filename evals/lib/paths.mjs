// @ts-check
/**
 * Path confinement for every file the evals and generators touch.
 *
 * All paths the tooling builds start from a base directory the caller controls (the repository
 * root, `docs-ai/`, `results/`, a temp dir) and append segments that come from data: command-line
 * labels, directory listings, spec files, git metadata. `insideDir` normalises the result and
 * refuses anything that resolves outside the base, so no data-derived segment can traverse out.
 */
import path from 'node:path';

/**
 * Resolve `segments` against `base` and assert the result stays within `base`.
 * An absolute segment is accepted only when it already lies under `base`.
 * @param {string} base directory the result must stay within
 * @param {...string} segments relative segments (or one absolute path under `base`)
 * @returns {string} the resolved absolute path
 */
export function insideDir(base, ...segments) {
	const root = path.resolve(base);
	const resolved = path.resolve(root, ...segments);
	if (resolved !== root && !resolved.startsWith(root + path.sep)) {
		throw new RangeError(`Path resolves outside ${root}: ${resolved}`);
	}
	return resolved;
}

/**
 * True when `name` is one plain path segment: no separators, no drive prefix, not `.`/`..`.
 * @param {string} name
 */
export function isSingleSegment(name) {
	if (name === '' || name === '.' || name === '..') return false;
	for (const ch of name) if (ch === '/' || ch === '\\' || ch === ':' || ch === '\0') return false;
	return true;
}

/**
 * True for a fully-qualified git ref name (`refs/<segments>`) whose segments are plain names: no
 * empty, dot-leading, `.`/`..` or separator-bearing components (the subset the reader needs).
 * @param {string} ref
 */
export function isRefName(ref) {
	const parts = ref.split('/');
	if (parts.length < 2 || parts[0] !== 'refs') return false;
	return parts.every((p) => isSingleSegment(p) && !p.startsWith('.') && !/[\s~^:?*[]/.test(p));
}
