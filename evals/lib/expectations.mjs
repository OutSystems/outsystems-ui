// @ts-check
/**
 * What the *source* declares for a pattern — the ground truth that machine-readable docs are
 * scored against (E01, E03) and that the docs generator emits.
 */
import { getConfigProps, getEnums, getExportedFunctions, getSourceFile } from './ts.mjs';

/** @type {WeakMap<object, Map<string, Expectations>>} */
const cache = new WeakMap();

/**
 * @typedef {object} Expectations
 * @property {import('./ts.mjs').ConfigProp[]} props
 * @property {import('./ts.mjs').ExportedFunction[]} apiFunctions
 * @property {string[]} api            exported API function names
 * @property {string[]} events         values of the pattern's `Events` enum(s)
 * @property {string[]} cssClasses     values of the pattern's `CssClass`/`CssClasses` enum(s)
 * @property {Record<string, string>} cssClassMap  member → value
 * @property {import('./ts.mjs').EnumInfo[]} enums
 */

/**
 * @param {import('./context.mjs').EvalContext} ctx
 * @param {import('./inventory.mjs').Pattern} pattern
 * @returns {Expectations}
 */
export function expectationsFor(ctx, pattern) {
	let perCtx = cache.get(ctx);
	if (!perCtx) {
		perCtx = new Map();
		cache.set(ctx, perCtx);
	}
	const hit = perCtx.get(pattern.name);
	if (hit) return hit;

	const program = ctx.program;
	const props = getConfigProps(program, pattern.configFiles);
	const apiFunctions = getExportedFunctions(getSourceFile(program, pattern.apiFile));
	const enums = pattern.enumFiles.flatMap((f) => getEnums(getSourceFile(program, f)));
	const events = enums
		.filter((e) => e.name === 'Events')
		.flatMap((e) => Object.values(e.members).map(String));
	/** @type {Record<string, string>} */
	const cssClassMap = {};
	for (const e of enums.filter((e) => /^Css(Class|Classes)$/.test(e.name))) {
		for (const [k, v] of Object.entries(e.members)) cssClassMap[k] = String(v);
	}
	const result = {
		props,
		apiFunctions,
		api: apiFunctions.map((f) => f.name),
		events: [...new Set(events)],
		cssClasses: [...new Set(Object.values(cssClassMap))],
		cssClassMap,
		enums,
	};
	perCtx.set(pattern.name, result);
	return result;
}
