#!/usr/bin/env node
// @ts-check
/**
 * Fails (exit 1) when docs-ai/ is stale: regenerates into a temp directory and compares it with
 * the committed files, without touching the working tree.
 *
 *   npm run docs:ai:check
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from '../evals/ai-friendliness/lib/context.mjs';
import { compareDocs } from './lib/ai-docs-fresh.mjs';
import { writeDocs } from './lib/ai-docs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fresh = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-docs-ai-'));
writeDocs(createContext(root), fresh);
const drift = compareDocs(path.join(root, 'docs-ai'), fresh);
fs.rmSync(fresh, { recursive: true, force: true });
if (drift.length === 0) {
	console.log('docs-ai/ is up to date with the source.');
} else {
	console.error('docs-ai/ is stale — run `npm run docs:ai` and commit the result:');
	for (const d of drift) console.error(`  ${d.status.padEnd(8)} docs-ai/${d.file}`);
	process.exitCode = 1;
}
