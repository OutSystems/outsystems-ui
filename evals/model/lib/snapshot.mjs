// @ts-check
/**
 * The block snapshots (`evals/model/osui.blocks*.json`): what the OutSystems UI OML declares, exported by
 * osui-blocks-export (see README.md). One file per platform; the metrics read every file and label a block
 * by platform only when more than one file is present.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from '../../lib/paths.mjs';
import { validate } from '../../lib/schema.mjs';

const MODEL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_FILE = insideDir(MODEL_DIR, 'osui.blocks.schema.json');
/** The summary every snapshot-driven eval reports when no snapshot is present. */
export const NO_SNAPSHOT = 'no evals/model/osui.blocks*.json snapshot';

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/**
 * @typedef {{ name: string, type: string, typeKind: string, typeRef: string|null, mandatory: boolean, default: string|null, description: string }} Param
 * @typedef {{ name: string, type: string, description: string }} EventParam
 * @typedef {{ name: string, mandatory: boolean, description: string, parameters: EventParam[] }} BlockEvent
 * @typedef {{ flow: string, name: string, public: boolean, description: string, inputParameters: Param[], placeholders: { name: string, description: string }[], events: BlockEvent[], requiredScripts: string[], patternHints: { apiCalls: string[] } }} Block
 * @typedef {{ identifier: string, label: string, attributes: Record<string, string|null> }} StaticRecord
 * @typedef {{ file?: string, version: number, source: { module: string, platform: string, [k: string]: unknown }, staticEntities: Record<string, { description: string, records: StaticRecord[] }>, structures: Record<string, { description: string, attributes: Param[] }>, blocks: Record<string, Block> }} Snapshot
 * @typedef {Block & { key: string, label: string, platform: string }} BlockRow
 */

/**
 * Every snapshot file of the directory, sorted; the schema is not a snapshot.
 * @param {string} [dir]
 */
export function snapshotFiles(dir = MODEL_DIR) {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((f) => f.startsWith('osui.blocks') && f.endsWith('.json') && !f.endsWith('.schema.json'))
		.sort(byCodePoint)
		.map((f) => insideDir(dir, f));
}

/** @param {string} [dir] @returns {Snapshot[]} */
export function loadSnapshots(dir = MODEL_DIR) {
	return snapshotFiles(dir).map((file) => ({ file, ...JSON.parse(fs.readFileSync(file, 'utf8')) }));
}

/** @type {any} */
let schemaCache;
function schema() {
	schemaCache ??= JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
	return schemaCache;
}

/** @param {object} snapshot */
export function validateSnapshot(snapshot) {
	const { file, ...rest } = /** @type {any} */ (snapshot);
	return validate(schema(), rest);
}

/** @param {{ flow: string, name: string }} block */
export function blockKey(block) {
	return `${block.flow}/${block.name}`;
}

/**
 * The blocks of every snapshot as rows, labelled by platform when more than one snapshot is present.
 * @param {Snapshot[]} snapshots
 * @returns {BlockRow[]}
 */
export function flattenBlocks(snapshots) {
	const several = snapshots.length > 1;
	/** @type {BlockRow[]} */
	const rows = [];
	for (const s of snapshots) {
		for (const key of Object.keys(s.blocks).sort(byCodePoint)) {
			const platform = s.source.platform;
			rows.push({ ...s.blocks[key], key, platform, label: several ? `${key} (${platform})` : key });
		}
	}
	return rows;
}

/** The documentation-only block that is never composed. */
export const LICENSES_KEY = 'Licenses/Licenses';

/**
 * Whether an agent may compose a block: public, not deprecated, not the Licenses block.
 * @param {{ public: boolean, name: string, key: string }} block
 */
export function isComposable(block) {
	return block.public && !block.name.startsWith('DEPRECATED_') && block.key !== LICENSES_KEY;
}

/** @param {BlockRow[]} rows */
export function composableBlocks(rows) {
	return rows.filter(isComposable);
}

/** Why a block is not composable, for a not-applicable entry. @param {{ public: boolean, name: string, key: string }} b */
export function notComposableReason(b) {
	if (!b.public) return 'not public in the module';
	if (b.name.startsWith('DEPRECATED_')) return 'deprecated block';
	return 'documentation-only block';
}

/**
 * Static entities a composable block's parameter references, by name.
 * @param {Snapshot[]} snapshots
 */
export function staticEntitiesReferenced(snapshots) {
	/** @type {Set<string>} */
	const out = new Set();
	for (const s of snapshots) {
		for (const block of composableBlocks(flattenBlocks([s]))) {
			for (const p of block.inputParameters) if (p.typeKind === 'staticEntity' && p.typeRef) out.add(p.typeRef);
		}
	}
	return out;
}

/**
 * A parameter an agent cannot type without guessing: an Object/unknown type or free Text.
 * @param {{ typeKind: string, type: string }} param
 */
export function isFreeText(param) {
	return param.typeKind === 'other' || (param.typeKind === 'basic' && param.type === 'Text');
}
