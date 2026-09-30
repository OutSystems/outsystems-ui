// @ts-check
/**
 * The component registry (`evals/components.json`): the inventory discovers components, this file
 * classifies them. Every eval that needs to know what a component *is* (a provider wrapper, an overlay,
 * a host-styled partial, a component with a loading state, …) reads it from here, so a new component is
 * classified in one place, and a test fails when the registry and the inventory disagree.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from './paths.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REGISTRY_FILE = insideDir(evalsDir, 'components.json');

/** Roles a pattern can carry. */
export const ROLES = ['provider', 'overlay', 'composite', 'feedback', 'non-interactive', 'no-dom'];

/**
 * @typedef {object} Entry
 * @property {'pattern'|'css'} kind
 * @property {string[]} [roles]
 * @property {string} [family]        patterns implementing one keyboard model together share a name
 * @property {{ host: string, reason: string }} [host] CSS component styling markup something else emits
 * @property {string} [story]         normalised story name when it differs from the component name
 * @property {boolean} [interactive]  CSS component operated by the user
 * @property {boolean} [loading]
 * @property {boolean} [validating]
 * @property {boolean} [density]      the enterprise document expects a size or density axis
 * @property {boolean} [derived]      appended by the doctor from code signals; remove after review
 *
 * @typedef {{ components: Record<string, Entry> }} Registry
 */

/**
 * @param {string} [file]
 * @returns {Registry}
 */
export function loadRegistry(file = REGISTRY_FILE) {
	const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
	return { components: raw.components ?? {} };
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
 * Where the registry and the inventory disagree.
 * @param {Registry} reg
 * @param {{ patterns: { name: string }[], cssComponents: { name: string }[] }} inventory
 */
export function validateRegistry(reg, inventory) {
	/** @type {{ name: string, kind: 'pattern'|'css' }[]} */
	const unknown = [];
	/** @type {{ name: string, registry: string, inventory: string }[]} */
	const kindMismatch = [];
	const seen = new Set();
	const discovered = [
		...inventory.patterns.map((p) => ({ name: p.name, kind: /** @type {const} */ ('pattern') })),
		...inventory.cssComponents.map((c) => ({ name: c.name, kind: /** @type {const} */ ('css') })),
	];
	for (const d of discovered) {
		seen.add(d.name);
		const e = reg.components[d.name];
		if (!e) unknown.push(d);
		else if (e.kind !== d.kind) kindMismatch.push({ name: d.name, registry: e.kind, inventory: d.kind });
	}
	const stale = Object.keys(reg.components).filter((n) => !seen.has(n));
	/** @type {{ name: string, role: string }[]} */
	const badRoles = [];
	for (const [name, e] of Object.entries(reg.components)) {
		for (const role of e.roles ?? []) if (!ROLES.includes(role)) badRoles.push({ name, role });
	}
	return { unknown, stale, badRoles, kindMismatch };
}
