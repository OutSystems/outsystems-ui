#!/usr/bin/env node
// @ts-check
/**
 * Copies docs-ai/ into the TypeDoc output so the agent docs are published at the site root of
 * the documentation deployment (…/llms.txt, …/llms-components.txt, …/osui.components.json).
 * Runs automatically after `npm run docs` (postdocs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs');
if (!fs.existsSync(out)) {
	console.error('docs/ does not exist — run `npm run docs` first.');
	process.exit(1);
}
fs.cpSync(path.join(root, 'docs-ai'), out, { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'docs-ai'))) console.log(`published docs/${f}`);
