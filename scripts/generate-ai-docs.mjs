#!/usr/bin/env node
// @ts-check
/**
 * Regenerates docs-ai/ (component manifest + tiered llms.txt files) from the source.
 *
 *   npm run docs:ai
 *
 * Deterministic: no timestamps, no git metadata — re-running on the same tree yields identical files.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from '../evals/ai-friendliness/lib/context.mjs';
import { writeDocs } from './lib/ai-docs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = createContext(root);
const files = writeDocs(ctx, path.join(root, 'docs-ai'));
for (const f of files) console.log(`wrote ${path.relative(root, f)}`);
