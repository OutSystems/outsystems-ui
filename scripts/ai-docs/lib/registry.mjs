// @ts-check
/**
 * The component registry (`scripts/ai-docs/registry.json`): the inventory discovers components, this file
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

const aiDocsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REGISTRY_FILE = insideDir(aiDocsDir, 'registry.json');


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
	return { components: { ...raw.components } };
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

