#!/usr/bin/env node

/**
 * Generate design tokens from outsystems-design-tokens package
 * Works cross-platform (Windows, macOS, Linux)
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cwd = process.cwd();

// Set environment variables
process.env.dest = resolve(cwd, 'src/scss/tokens/');
process.env.prefix = 'token';
process.env.root = 'true';
process.env.scss = 'true';
process.env.utilities = 'true';
process.env.baseFontSize = '16';
process.env.src = 'node_modules/outsystems-design-tokens/tokens/**/*.json';

try {
  const genPath = pathToFileURL(
    join(cwd, 'node_modules/outsystems-design-tokens/scripts/generate-tokens.js')
  ).href;

  const { generateTokens } = await import(genPath);
  await generateTokens();
} catch (err) {
  console.error('❌ Failed to generate design tokens:', err.message);
  process.exit(1);
}
