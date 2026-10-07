// @ts-check
/**
 * The row universe: every composable OML block (category `component`) with the pattern and/or stylesheet it
 * drives, then every registry component no block links to (category `platform`). The metrics keep scoring
 * their own objects; the runner, the data set and the page are built over these rows.
 */
import { normalizeKind } from './kinds.mjs';
import { blockRuntimeOf } from './registry.mjs';
import { composableBlocks, flattenBlocks } from '../model/lib/snapshot.mjs';

/** @typedef {'component'|'platform'} Category */
/**
 * @typedef {object} Row
 * @property {string} id        `Flow/Name` (with ` (PLATFORM)` when several snapshots) or the registry name
 * @property {string} name      block name, or the registry name
 * @property {string|null} flow
 * @property {Category} category
 * @property {import('./kinds.mjs').Kind} kind
 * @property {{ pattern: string|null, style: string|null }} runtime
 * @property {string} platform  snapshot platform, '' for a platform style
 */

export const CATEGORIES = /** @type {const} */ (['component', 'platform']);
/** @type {Record<Category, string>} */
export const CATEGORY_LABEL = { component: 'components (OML blocks)', platform: 'platform & layout styles' };

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/**
 * @param {import('../model/lib/snapshot.mjs').Snapshot[]} snapshots
 * @param {import('./registry.mjs').Registry} registry
 * @param {{ patterns: { name: string }[], cssComponents: { name: string, kind: string }[] }} inventory
 * @returns {Row[]}
 */
export function buildUniverse(snapshots, registry, inventory) {
	const { rows, linked } = blockRows(snapshots, registry);
	return [...rows, ...platformRows(inventory, linked)];
}

/**
 * The block rows (category `component`) and the names of the patterns and stylesheets they drive.
 * @param {import('../model/lib/snapshot.mjs').Snapshot[]} snapshots
 * @param {import('./registry.mjs').Registry} registry
 */
function blockRows(snapshots, registry) {
	/** @type {Row[]} */
	const rows = [];
	/** @type {Set<string>} */
	const linked = new Set();
	for (const b of composableBlocks(flattenBlocks(snapshots))) {
		const runtime = blockRuntimeOf(registry, b.flow, b.name);
		if (runtime.pattern) linked.add(runtime.pattern);
		if (runtime.style) linked.add(runtime.style);
		const styleKind = runtime.style ? normalizeKind(registry.components[runtime.style]?.kind) : null;
		rows.push({
			id: b.label,
			name: b.name,
			flow: b.flow,
			category: 'component',
			kind: runtime.pattern ? 'pattern' : (styleKind ?? 'block'),
			runtime,
			platform: b.platform,
		});
	}
	rows.sort((a, b) => byCodePoint(a.id, b.id));
	return { rows, linked };
}

/**
 * The platform rows: every pattern and stylesheet of the inventory no block links to.
 * @param {{ patterns: { name: string }[], cssComponents: { name: string, kind: string }[] }} inventory
 * @param {Set<string>} linked
 */
function platformRows(inventory, linked) {
	/** @type {Row[]} */
	const rows = [];
	for (const p of inventory.patterns) {
		if (linked.has(p.name)) continue;
		rows.push({
			id: p.name,
			name: p.name,
			flow: null,
			category: 'platform',
			kind: 'pattern',
			runtime: { pattern: p.name, style: null },
			platform: '',
		});
	}
	for (const c of inventory.cssComponents) {
		if (linked.has(c.name)) continue;
		rows.push({
			id: c.name,
			name: c.name,
			flow: null,
			category: 'platform',
			kind: normalizeKind(c.kind) ?? 'component',
			runtime: { pattern: null, style: c.name },
			platform: '',
		});
	}
	rows.sort((a, b) => byCodePoint(a.id, b.id));
	return rows;
}

/**
 * @param {Row[]} rows
 * @returns {{ byId: Map<string, Row>, byRuntime: Map<string, Row[]> }}
 */
export function rowIndex(rows) {
	/** @type {Map<string, Row>} */
	const byId = new Map();
	/** @type {Map<string, Row[]>} */
	const byRuntime = new Map();
	const add = (/** @type {string|null} */ key, /** @type {Row} */ row) => {
		if (!key) return;
		const list = byRuntime.get(key) ?? [];
		list.push(row);
		byRuntime.set(key, list);
	};
	for (const r of rows) {
		byId.set(r.id, r);
		add(r.runtime.pattern, r);
		add(r.runtime.style, r);
	}
	return { byId, byRuntime };
}

/**
 * The rows an eval's per-component entry named `name` belongs to: the block row with that id, else every row
 * whose runtime is that pattern or stylesheet (a platform style's own id is its runtime name). Empty when the
 * universe does not know the name.
 * @param {{ byId: Map<string, Row>, byRuntime: Map<string, Row[]> }} index
 * @param {string} name
 */
export function rowsForResult(index, name) {
	const own = index.byId.get(name);
	if (own && own.category === 'component') return [own];
	const viaRuntime = [...(index.byRuntime.get(name) ?? [])];
	viaRuntime.sort((a, b) => byCodePoint(a.id, b.id));
	if (viaRuntime.length) return viaRuntime;
	return own ? [own] : [];
}
