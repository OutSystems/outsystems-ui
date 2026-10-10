#!/usr/bin/env node
/**
 * Copies the migration lookup tables from the osui-theme-migration skill into
 * the customer-facing guide. The skill is the source of truth for migration
 * facts; the guide is downstream of it.
 *
 *   source → .claude/skills/osui-theme-migration/references/variable-mapping.md
 *   target → THEME-MIGRATION-GUIDE.md
 *
 * Only marked tables move. `<!-- table:ID -->` in the source pairs with
 * `<!-- generated:ID -->` in the guide; everything outside those markers is
 * hand-written and never read here. The guide addresses a customer in their own
 * app and the skill addresses an agent in this repo, so the prose around each
 * table states the same fact differently on purpose.
 *
 * Run: `npm run docs:migration`             rewrite the guide
 *      `npm run docs:migration -- --check`  report drift, write nothing
 *
 * Why this exists: a wrong value in a mapping table reads exactly like a right
 * one, so hand-maintained copies drift silently. Fix the skill; the guide
 * follows. No dependencies.
 */
/* eslint-env node */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SOURCE_FILE = path.join(
	repoRoot,
	'.claude',
	'skills',
	'osui-theme-migration',
	'references',
	'variable-mapping.md'
);
const GUIDE_FILE = path.join(repoRoot, 'THEME-MIGRATION-GUIDE.md');

const rel = (file) => path.relative(repoRoot, file);

// `.md` is not in .gitattributes' `eol=lf` list, so a Windows checkout can yield
// CRLF. Normalise on read so the patterns below can assume `\n`, and restore the
// file's own convention on write.
const read = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const write = (file, text) => {
	const crlf = fs.readFileSync(file, 'utf8').includes('\r\n');
	fs.writeFileSync(file, crlf ? text.replace(/\n/g, '\r\n') : text);
};

// Markers must own their line. Both documents also *describe* the marker syntax
// in prose, and anchoring is what stops those mentions being read as real
// markers — without it, a lowercase example ID would hijack the real table.
// IDs are `[a-z0-9-]+`, so none of them need regex-escaping when interpolated.
const ID = '[a-z0-9-]+';

const markedBlock = (kind, id) =>
	new RegExp(
		`(?<open>^[ \\t]*<!-- ${kind}:${id} -->\\n)(?<body>[\\s\\S]*?)(?<close>^[ \\t]*<!-- /${kind}:${id} -->)`,
		'm'
	);

const markerIds = (text, kind) =>
	[...text.matchAll(new RegExp(`^[ \\t]*<!-- ${kind}:(${ID}) -->[ \\t]*$`, 'gm'))].map(([, id]) => id);

function fail(message) {
	console.error(message);
	process.exit(1);
}

const duplicatesIn = (ids) => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];

function syncTables(source, guide) {
	const sourceIds = markerIds(source, 'table');
	const guideIds = markerIds(guide, 'generated');

	// `match` and `replace` only ever act on the first occurrence, so a repeated
	// ID would leave the second block permanently stale and unreported.
	for (const [label, ids] of [
		['skill', sourceIds],
		['guide', guideIds],
	]) {
		const repeated = duplicatesIn(ids);
		if (repeated.length) return fail(`The ${label} repeats these marker IDs: ${repeated.join(', ')}`);
	}

	// A marker on only one side is a wiring mistake, not content drift.
	const undefinedInSource = guideIds.filter((id) => !sourceIds.includes(id));
	if (undefinedInSource.length) {
		return fail(`The guide expects tables the skill does not define: ${undefinedInSource.join(', ')}`);
	}

	const stale = [];
	let text = guide;

	for (const id of guideIds) {
		const sourceBlock = source.match(markedBlock('table', id));
		const guideBlock = text.match(markedBlock('generated', id));
		const missing = !sourceBlock ? rel(SOURCE_FILE) : !guideBlock ? path.basename(GUIDE_FILE) : null;
		if (missing) {
			return fail(`"${id}" is missing its opening or closing marker in ${missing}.`);
		}

		const { body: sourceBody } = sourceBlock.groups;
		if (sourceBody === guideBlock.groups.body) continue;

		stale.push(id);
		// Replacer function, not a string: table bodies contain `$` sequences
		// that `String.replace` would otherwise interpret.
		text = text.replace(markedBlock('generated', id), (...args) => {
			const { open, close } = args.at(-1);
			return open + sourceBody + close;
		});
	}

	return { text, stale, total: guideIds.length, unused: sourceIds.filter((id) => !guideIds.includes(id)) };
}

function main() {
	const args = process.argv.slice(2);
	const unknown = args.filter((arg) => arg !== '--check');
	if (unknown.length) fail(`Unknown argument(s): ${unknown.join(', ')}. The only flag is --check.`);

	const checkOnly = args.includes('--check');
	const guideName = path.basename(GUIDE_FILE);
	const { text, stale, total, unused } = syncTables(read(SOURCE_FILE), read(GUIDE_FILE));

	// Reported before the drift check: a guide that has lost its markers has no
	// drift to report, and would otherwise pass as "0 tables in sync".
	if (unused.length) {
		const note = `${guideName} does not consume these skill tables: ${unused.join(', ')}`;
		if (checkOnly)
			fail(`${note}\nRestore the \`<!-- generated:ID -->\` markers, or remove the tables from the skill.`);
		console.log(`Note: ${note}`);
	}

	if (checkOnly) {
		if (stale.length) {
			fail(
				`${guideName} is out of date with the skill: ${stale.join(', ')}\n` +
					`Fix the table in ${rel(SOURCE_FILE)}, then run \`npm run docs:migration\`.`
			);
		}
		console.log(`${total} tables in sync with the skill.`);
	} else if (stale.length) {
		write(GUIDE_FILE, text);
		console.log(`Updated ${stale.length} of ${total} tables in ${guideName}: ${stale.join(', ')}`);
	} else {
		console.log(`${total} tables already in sync; nothing to write.`);
	}
}

main();
