// @ts-check
/**
 * The component registry (`evals/components.json`): the inventory discovers components, this file
 * classifies them. Every eval that needs to know what a component *is* (a provider wrapper, an overlay,
 * a host-styled partial, a component with a loading state, a utility family, …) reads it from here, so
 * a new component is classified in one place, and a test fails when the registry and the inventory
 * disagree. A component's `kind` is its tier (lib/kinds.mjs); the directory gives the default and the
 * registry may override it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from './paths.mjs';
import { normalizeKind } from './kinds.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REGISTRY_FILE = insideDir(evalsDir, 'components.json');

/** Roles a pattern can carry. */
export const ROLES = ['provider', 'overlay', 'composite', 'feedback', 'non-interactive', 'no-dom'];

/**
 * @typedef {object} Entry
 * @property {import('./kinds.mjs').Kind} kind tier: pattern | component | layout | utility (`css` read as component)
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
 * @property {BlockLink[]} [block]    the OML block(s) a pattern drives, with the parameter and event maps (M02)
 *
 * @typedef {{ flow: string, name: string, paramMap?: Record<string, string>, platformOnly?: string[], eventMap?: Record<string, string>, derived?: boolean }} BlockLink
 *
 * @typedef {{ components: Record<string, Entry> }} Registry
 */

/**
 * The registry as a `{ components }` object; kinds are kept as written, for `validateRegistry` to report
 * the unknown ones.
 * @param {{ components?: Record<string, any> }} raw
 * @returns {Registry}
 */
export function normalizeRegistry(raw) {
	return { components: { ...(raw.components ?? {}) } };
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
 * @param {import('./kinds.mjs').Kind} fallback
 * @returns {import('./kinds.mjs').Kind}
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

/**
 * Whether a block has a parameter named `key`: a plain parameter name, or `Structure.Attribute` for an
 * attribute of a structure-typed parameter (the structure must be in the snapshot).
 * @param {{ inputParameters: { name: string, typeKind: string, typeRef: string|null }[] }} block
 * @param {string} key
 * @param {Record<string, { attributes: { name: string }[] }>} structures
 */
export function blockHasParameter(block, key, structures) {
	const dot = key.indexOf('.');
	if (dot === -1) return block.inputParameters.some((p) => p.name === key);
	const head = key.slice(0, dot);
	const tail = key.slice(dot + 1);
	const param = block.inputParameters.find((p) => p.name === head && p.typeKind === 'structure');
	if (!param || !param.typeRef) return false;
	const structure = structures[param.typeRef];
	return Boolean(structure && structure.attributes.some((a) => a.name === tail));
}

/**
 * Where the `block` links of the registry disagree with the snapshot and the patterns: an unknown block,
 * parameter, config prop or event. Empty when every link resolves.
 * @param {Registry} reg
 * @param {Map<string, { inputParameters: { name: string, typeKind: string, typeRef: string|null }[], events: { name: string }[] }>} blocksByKey
 * @param {Map<string, string[]>} propsByPattern config prop names per pattern
 * @param {Map<string, string[]>} eventsByPattern runtime event names per pattern
 * @param {Record<string, { attributes: { name: string }[] }>} structures
 * @returns {{ pattern: string, message: string }[]}
 */
export function validateBlockLinks(reg, blocksByKey, propsByPattern, eventsByPattern, structures) {
	/** @type {{ pattern: string, message: string }[]} */
	const out = [];
	for (const [pattern, entry] of Object.entries(reg.components)) {
		for (const link of entry.block ?? []) {
			const key = `${link.flow}/${link.name}`;
			const block = blocksByKey.get(key);
			const messages = block
				? [
						...paramMapErrors(link, key, block, propsByPattern.get(pattern) ?? [], structures),
						...platformOnlyErrors(link, key, block, structures),
						...eventMapErrors(link, key, block, eventsByPattern.get(pattern) ?? []),
					]
				: [`block ${key} is not in the snapshot`];
			for (const message of messages) out.push({ pattern, message: `${pattern}: ${message}` });
		}
	}
	return out;
}

/**
 * @param {BlockLink} link
 * @param {string} key
 * @param {{ inputParameters: { name: string, typeKind: string, typeRef: string|null }[] }} block
 * @param {string[]} props
 * @param {Record<string, { attributes: { name: string }[] }>} structures
 */
function paramMapErrors(link, key, block, props, structures) {
	const out = [];
	for (const [param, prop] of Object.entries(link.paramMap ?? {})) {
		if (!blockHasParameter(block, param, structures)) out.push(`block ${key} has no parameter "${param}"`);
		else if (!props.includes(prop)) out.push(`pattern has no config prop "${prop}" (paramMap ${param})`);
	}
	return out;
}

/**
 * @param {BlockLink} link
 * @param {string} key
 * @param {{ inputParameters: { name: string, typeKind: string, typeRef: string|null }[] }} block
 * @param {Record<string, { attributes: { name: string }[] }>} structures
 */
function platformOnlyErrors(link, key, block, structures) {
	return (link.platformOnly ?? [])
		.filter((param) => !blockHasParameter(block, param, structures))
		.map((param) => `block ${key} has no parameter "${param}" (platformOnly)`);
}

/**
 * @param {BlockLink} link
 * @param {string} key
 * @param {{ events: { name: string }[] }} block
 * @param {string[]} events
 */
function eventMapErrors(link, key, block, events) {
	const out = [];
	for (const [blockEvent, runtimeEvent] of Object.entries(link.eventMap ?? {})) {
		if (!block.events.some((e) => e.name === blockEvent)) out.push(`block ${key} has no event "${blockEvent}"`);
		else if (!events.includes(runtimeEvent))
			out.push(`pattern has no event "${runtimeEvent}" (eventMap ${blockEvent})`);
	}
	return out;
}
