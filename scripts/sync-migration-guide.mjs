#!/usr/bin/env node
/**
 * Copies the migration lookup tables from the osui-theme-migration skill into
 * the customer-facing guide. The skill is the source of truth for migration
 * facts; the guide is downstream of it (see ADR-0011).
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
 *      `npm run docs:migration -- --check`  report drift, write nothing (CI)
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

// `.md` is not in .gitattributes' `eol=lf` list, so a Windows checkout can yield
// CRLF. Normalise on read so the patterns below can assume `\n`, and restore the
// file's own convention on write.
const read = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const write = (file, text) => {
	const crlf = fs.readFileSync(file, 'utf8').includes('\r\n');
	fs.writeFileSync(file, crlf ? text.replace(/\n/g, '\r\n') : text);
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Matches one marked block, capturing: 1 opening marker, 2 body, 3 closing marker. */
const markedBlock = (kind, id) =>
	new RegExp(`([ \\t]*<!-- ${kind}:${escapeRe(id)} -->\\n)([\\s\\S]*?)([ \\t]*<!-- /${kind}:${escapeRe(id)} -->)`);

const markerIds = (text, kind) =>
	[...text.matchAll(new RegExp(`<!-- ${kind}:([a-z0-9-]+) -->`, 'g'))].map(([, id]) => id);

function fail(message) {
	console.error(message);
	process.exit(1);
}

function syncTables(source, guide) {
	const sourceIds = markerIds(source, 'table');
	const guideIds = markerIds(guide, 'generated');

	// A marker on only one side is a wiring mistake, not content drift.
	const undefinedInSource = guideIds.filter((id) => !sourceIds.includes(id));
	if (undefinedInSource.length) {
		fail(`The guide expects tables the skill does not define: ${undefinedInSource.join(', ')}`);
	}

	const stale = [];
	let text = guide;

	for (const id of guideIds) {
		const sourceBlock = source.match(markedBlock('table', id));
		const guideBlock = text.match(markedBlock('generated', id));
		if (!sourceBlock || !guideBlock) {
			fail(`Markers for "${id}" are malformed — both files need an opening and a closing comment.`);
		}

		const sourceBody = sourceBlock[2];
		if (sourceBody === guideBlock[2]) continue;

		stale.push(id);
		// Replacer function, not a string: table bodies contain `$` sequences
		// that `String.replace` would otherwise interpret.
		text = text.replace(markedBlock('generated', id), (_, open, __, close) => open + sourceBody + close);
	}

	return { text, stale, total: guideIds.length, unused: sourceIds.filter((id) => !guideIds.includes(id)) };
}

function main() {
	const checkOnly = process.argv.includes('--check');
	const { text, stale, total, unused } = syncTables(read(SOURCE_FILE), read(GUIDE_FILE));

	if (checkOnly && stale.length) {
		fail(
			`${path.basename(GUIDE_FILE)} is out of date with the skill: ${stale.join(', ')}\n` +
				`Fix the table in ${path.relative(repoRoot, SOURCE_FILE)}, then run \`npm run docs:migration\`.`
		);
	}

	if (checkOnly) console.log(`${total} tables in sync with the skill.`);
	else if (stale.length) {
		write(GUIDE_FILE, text);
		console.log(`Updated ${stale.length} of ${total} tables: ${stale.join(', ')}`);
	} else console.log(`${total} tables already in sync; nothing to write.`);

	if (unused.length) console.log(`Note: defined in the skill but unused by the guide: ${unused.join(', ')}`);
}

main();
