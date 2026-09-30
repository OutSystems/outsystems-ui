// @ts-check
/**
 * The component registry (`evals/components.json`): the inventory discovers components, this file
 * classifies them. Every eval that needs to know what a component *is* (a provider wrapper, an overlay,
 * a host-styled partial, a component with a loading state, a utility family, …) reads it from here, so
 * a new component is classified in one place, and a test fails when the registry and the inventory
 * disagree. A component's `kind` is its tier (lib/tiers.mjs); the directory gives the default and the
 * registry may override it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from './paths.mjs';
import { normalizeKind } from './tiers.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REGISTRY_FILE = insideDir(evalsDir, 'components.json');

/** Roles a pattern can carry. */
export const ROLES = ['provider', 'overlay', 'composite', 'feedback', 'non-interactive', 'no-dom'];

/**
 * @typedef {object} Entry
 * @property {import('./tiers.mjs').Tier} kind tier: pattern | component | layout | utility (`css` read as component)
 * @property {string[]} [roles]
 * @property {string} [family]        patterns implementing one keyboard model together share a name
 * @property {{ host: string, reason: string }} [host] component or layout partial styling markup something else emits
 * @property {string} [story]         normalised story name when it differs from the component name
 * @property {string} [title]         display name of a utility family (`Spacing · margin`)
 * @property {boolean} [interactive]  CSS-only component operated by the user
 * @property {boolean} [loading]
 * @property {boolean} [validating]
 * @property {boolean} [density]      the enterprise document expects a size or density axis
 * @property {boolean} [derived]      appended by the doctor from code signals; remove after review
 *
 * @typedef {{ components: Record<string, Entry> }} Registry
 */

/**
 * The registry with every kind normalised to a tier (`css` → `component`); unknown kinds are kept for
 * `validateRegistry` to report.
 * @param {{ components?: Record<string, any> }} raw
 * @returns {Registry}
 */
export function normalizeRegistry(raw) {
	/** @type {Record<string, Entry>} */
	const components = {};
	for (const [name, e] of Object.entries(raw.components ?? {})) {
		components[name] = { ...e, kind: normalizeKind(e.kind) ?? e.kind };
	}
	return { components };
}

/**
 * @param {string} [file]
 * @returns {Registry}
 */
export function loadRegistry(file = REGISTRY_FILE) {
	return normalizeRegistry(JSON.parse(fs.readFileSync(file, 'utf8')));
}

/** @type {Registry|undefined} */
let cached;
/** The committed registry, read once. */
export function registry() {
	cached ??= loadRegistry();
	return cached;
}

/**
 * @param {Registry} reg
 * @param {string} name
 * @returns {Entry|null}
 */
export function entryOf(reg, name) {
	return reg.components[name] ?? null;
}

/**
 * The tier of a component: the registry's when it names one, else the discovered default.
 * @param {Registry} reg
 * @param {string} name
 * @param {import('./tiers.mjs').Tier} fallback
 * @returns {import('./tiers.mjs').Tier}
 */
export function tierOf(reg, name, fallback) {
	return normalizeKind(reg.components[name]?.kind) ?? fallback;
}

/**
 * @param {Entry|null|undefined} entry
 * @param {string} role
 */
export function hasRole(entry, role) {
	return Boolean(entry?.roles?.includes(role));
}

/**
 * Names of the entries a predicate accepts, in registry order.
 * @param {Registry} reg
 * @param {(entry: Entry, name: string) => boolean} predicate
 * @returns {Set<string>}
 */
export function namesWhere(reg, predicate) {
	/** @type {Set<string>} */
	const out = new Set();
	for (const [name, entry] of Object.entries(reg.components)) if (predicate(entry, name)) out.add(name);
	return out;
}

/**
 * The other patterns of a component's family (empty without a family).
 * @param {Registry} reg
 * @param {string} name
 * @returns {string[]}
 */
export function familyMembers(reg, name) {
	const family = reg.components[name]?.family;
	if (!family) return [];
	return Object.entries(reg.components)
		.filter(([n, e]) => n !== name && e.family === family)
		.map(([n]) => n);
}

/**
 * Where the registry and the inventory disagree. `kindMismatch` (a pattern registered as something
 * else, or the reverse) and `badKinds` fail the registry test; `tierOverride` (a CSS-only component
 * whose registry tier differs from its directory default) is information: an override is the point.
 * @param {Registry} reg
 * @param {{ patterns: { name: string }[], cssComponents: { name: string, tier?: string }[] }} inventory
 */
export function validateRegistry(reg, inventory) {
	/** @type {{ name: string, kind: string }[]} */
	const unknown = [];
	/** @type {{ name: string, registry: string, inventory: string }[]} */
	const kindMismatch = [];
	/** @type {{ name: string, registry: string, discovered: string }[]} */
	const tierOverride = [];
	/** @type {{ name: string, kind: string }[]} */
	const badKinds = [];
	const seen = new Set();
	const discovered = [
		...inventory.patterns.map((p) => ({ name: p.name, kind: 'pattern' })),
		...inventory.cssComponents.map((c) => ({ name: c.name, kind: c.tier ?? 'component' })),
	];
	for (const d of discovered) {
		seen.add(d.name);
		const e = reg.components[d.name];
		if (!e) {
			unknown.push(d);
			continue;
		}
		const kind = normalizeKind(e.kind);
		if (kind === null) badKinds.push({ name: d.name, kind: String(e.kind) });
		else if ((kind === 'pattern') !== (d.kind === 'pattern'))
			kindMismatch.push({ name: d.name, registry: kind, inventory: d.kind });
		else if (kind !== d.kind) tierOverride.push({ name: d.name, registry: kind, discovered: d.kind });
	}
	const stale = Object.keys(reg.components).filter((n) => !seen.has(n));
	/** @type {{ name: string, role: string }[]} */
	const badRoles = [];
	for (const [name, e] of Object.entries(reg.components)) {
		for (const role of e.roles ?? []) if (!ROLES.includes(role)) badRoles.push({ name, role });
	}
	return { unknown, stale, badRoles, badKinds, kindMismatch, tierOverride };
}
