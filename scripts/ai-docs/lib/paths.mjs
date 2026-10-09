// @ts-check
/**
 * Path confinement for every file the generators touch.
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
