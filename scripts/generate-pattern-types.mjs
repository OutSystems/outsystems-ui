#!/usr/bin/env node
// @ts-check
/**
 * Regenerates src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts from the source.
 *
 *   npm run types:generate
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from '../evals/lib/context.mjs';
import { insideDir } from '../evals/lib/paths.mjs';
import { buildManifest } from './lib/ai-docs.mjs';
import { OUTPUT_FILE, renderPatternTypes } from './lib/pattern-types.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = createContext(root);
fs.writeFileSync(insideDir(root, OUTPUT_FILE), await renderPatternTypes(ctx, buildManifest(ctx)));
console.log(`wrote ${OUTPUT_FILE}`);
