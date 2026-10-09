// @ts-check
/**
 * The block snapshots (`scripts/ai-docs/snapshot/osui.blocks*.json`): what the OutSystems UI OML declares, exported by
 * osui-blocks-export (see README.md). One file per platform; the metrics read every file and label a block
 * by platform only when more than one file is present.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from './paths.mjs';
import { validate } from './schema.mjs';

const MODEL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'snapshot');
const SCHEMA_FILE = insideDir(MODEL_DIR, 'osui.blocks.schema.json');

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



/** The parameter every block offers for utility classes: Text on purpose, never a typing gap. */
export const EXTENDED_CLASS = 'ExtendedClass';

/**
 * Text parameters that are Text on purpose, by name, with the reason an agent reads in the manifest. A
 * static entity or a number would not express what they carry.
 * @type {Record<string, string>}
 */
/** The Text-on-purpose parameters, by the reason they are Text: names first, so no name reads as a credential. */
const TEXT_REASONS = [
	['CSS utility classes (see llms-utilities.txt)', [EXTENDED_CLASS]],
	['the identifier of another element in the DOM', ['MenuId', 'ScrollToWidgetId', 'WidgetId', 'ItemId']],
	['free text shown as is', ['Title', 'Group', 'Prompt', 'Name', 'Password']],
	['a measure with its unit, such as 120px or 70%', ['Size', 'Height', 'Width']],
	['a text mask', ['DateFormat', 'TimeFormat']],
	['the content of an SVG', ['SVGCode']],
	['a URL', ['ImageURL', 'URL']],
];
export const TEXT_ON_PURPOSE = Object.fromEntries(
	TEXT_REASONS.flatMap(([reason, names]) => names.map((name) => [name, reason]))
);

/**
 * The reason a Text parameter is Text on purpose, or null for any other parameter.
 * @param {{ name?: string, typeKind: string, type: string }} param
 */
export function textOnPurpose(param) {
	if (param.typeKind !== 'basic' || param.type !== 'Text' || !param.name) return null;
	return TEXT_ON_PURPOSE[param.name] ?? null;
}


