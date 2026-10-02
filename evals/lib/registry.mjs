// @ts-check
/**
 * The component registry (`evals/components.json`): the inventory discovers components, this file
 * classifies them. Every eval that needs to know what a component *is* (a provider wrapper, an overlay,
 * a host-styled partial, a component with a loading state, a utility family, …) reads it from here, so
 * a new component is classified in one place, and a test fails when the registry and the inventory
 * disagree. A component's `kind` is its source kind (lib/kinds.mjs); the directory gives the default and the
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
 * @property {import('./kinds.mjs').Kind} kind pattern | component | layout | utility
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
 * @property {BlockLink[]} [block]    the OML block(s) this entry drives: a pattern's links carry the parameter and event
 *                                   maps (M02); a CSS-only component's or layout partial's links carry flow and name only
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
 * The kind of a component: the registry's when it names one, else the discovered default.
 * @param {Registry} reg
 * @param {string} name
 * @param {import('./kinds.mjs').Kind} fallback
 * @returns {import('./kinds.mjs').Kind}
 */
export function kindOf(reg, name, fallback) {
	return normalizeKind(reg.components[name]?.kind) ?? fallback;
}

/**
 * The pattern and the stylesheet (CSS-only component or layout partial) whose entries link a block.
 * @param {Registry} reg
 * @param {string} flow
 * @param {string} name
 * @returns {{ pattern: string|null, style: string|null }}
 */
export function blockRuntimeOf(reg, flow, name) {
	/** @type {{ pattern: string|null, style: string|null }} */
	const out = { pattern: null, style: null };
	for (const [entryName, entry] of Object.entries(reg.components)) {
		const linked = (entry.block ?? []).some((l) => l.flow === flow && l.name === name);
		if (!linked) continue;
		const kind = normalizeKind(entry.kind);
		if (kind === 'pattern') out.pattern = entryName;
		else if (kind === 'component' || kind === 'layout') out.style = entryName;
	}
	return out;
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
 * else, or the reverse) and `badKinds` fail the registry test; `kindOverride` (a CSS-only component
 * whose registry kind differs from its directory default) is information: an override is the point.
 * @param {Registry} reg
 * @param {{ patterns: { name: string }[], cssComponents: { name: string, defaultKind?: string }[] }} inventory
 */
export function validateRegistry(reg, inventory) {
	/** @type {{ name: string, kind: string }[]} */
	const unknown = [];
	/** @type {{ name: string, registry: string, inventory: string }[]} */
	const kindMismatch = [];
	/** @type {{ name: string, registry: string, discovered: string }[]} */
	const kindOverride = [];
	/** @type {{ name: string, kind: string }[]} */
	const badKinds = [];
	const seen = new Set();
	const discovered = [
		...inventory.patterns.map((p) => ({ name: p.name, kind: 'pattern' })),
		...inventory.cssComponents.map((c) => ({ name: c.name, kind: c.defaultKind ?? 'component' })),
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
		else if (kind !== d.kind) kindOverride.push({ name: d.name, registry: kind, discovered: d.kind });
	}
	const stale = Object.keys(reg.components).filter((n) => !seen.has(n));
	/** @type {{ name: string, role: string }[]} */
	const badRoles = [];
	for (const [name, e] of Object.entries(reg.components)) {
		for (const role of e.roles ?? []) if (!ROLES.includes(role)) badRoles.push({ name, role });
	}
	return { unknown, stale, badRoles, badKinds, kindMismatch, kindOverride };
}

/**
 * Whether a block has a parameter named `key`: a plain parameter name, or `Structure.Attribute` for an
 * attribute of a structure-typed parameter (the structure must be in the snapshot).
 * @param {{ inputParameters: { name: string, typeKind: string, typeRef: string|null }[] }} block
 * @param {string} key
 * @param {Record<string, { attributes: { name: string }[] }>} structures
 */
function blockHasParameter(block, key, structures) {
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
	/** @type {Map<string, string[]>} */
	const linkedFrom = new Map();
	for (const [name, entry] of Object.entries(reg.components)) {
		const kind = normalizeKind(entry.kind);
		const links = entry.block ?? [];
		if (kind === 'utility' && links.length) {
			out.push({ pattern: name, message: `${name}: a utility family never links a block` });
			continue;
		}
		for (const link of links) {
			const key = `${link.flow}/${link.name}`;
			linkedFrom.set(key, [...(linkedFrom.get(key) ?? []), name]);
			const ctx = { props: propsByPattern.get(name) ?? [], events: eventsByPattern.get(name) ?? [], structures };
			for (const message of linkErrors(name, kind, link, key, blocksByKey.get(key), ctx)) {
				out.push({ pattern: name, message: `${name}: ${message}` });
			}
		}
	}
	for (const [key, names] of linkedFrom) {
		if (names.length > 1) out.push({ pattern: names[0], message: `${key} is linked from ${names.join(' and ')}` });
	}
	return out;
}

/**
 * The errors of one link: a deprecated target, a map on a stylesheet entry, a missing block, then the
 * parameter, platform-only and event checks of a pattern link.
 * @param {string} name entry name
 * @param {import('./kinds.mjs').Kind|null} kind entry kind
 * @param {BlockLink} link
 * @param {string} key
 * @param {{ inputParameters: { name: string, typeKind: string, typeRef: string|null }[], events: { name: string }[] }|undefined} block
 * @param {{ props: string[], events: string[], structures: Record<string, { attributes: { name: string }[] }> }} ctx
 */
function linkErrors(name, kind, link, key, block, ctx) {
	if (link.name.startsWith('DEPRECATED_')) return [`${key}: deprecated blocks are not composable`];
	if (kind === 'component' || kind === 'layout') {
		const map = ['paramMap', 'eventMap', 'platformOnly'].find((f) => f in link);
		if (map) return [`${map} on a CSS-only component`];
	}
	if (!block) return [`block ${key} is not in the snapshot`];
	return [
		...paramMapErrors(link, key, block, ctx.props, ctx.structures),
		...platformOnlyErrors(link, key, block, ctx.structures),
		...eventMapErrors(link, key, block, ctx.events),
	];
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
