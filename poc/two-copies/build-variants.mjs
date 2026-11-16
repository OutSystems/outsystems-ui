#!/usr/bin/env node
/**
 * Writes every bundle variant the harness and the tests use into ./variants/.
 *
 *   today-<version>.js           from ../../dist/ODC.OutSystemsUI.js, relabelled only
 *   s1-<version>.js              from ../../dist/ODC.OutSystemsUI.js, relabelled and wrapped with the §8.2 prologue
 *   pristine-<version>.js        from ./baseline/ODC.OutSystemsUI.js (a build of the unmodified source), relabelled
 *                                only; written only when that file exists (see README, "Pristine baseline")
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeVariant } from './make-variant.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const VERSIONS = ['3.0.0', '3.2.0', '4.0.0'];
const distBundle = path.resolve(here, '../../dist/ODC.OutSystemsUI.js');
const baselineBundle = path.resolve(here, 'baseline/ODC.OutSystemsUI.js');
const outDir = path.resolve(here, 'variants');

if (!fs.existsSync(distBundle)) {
	console.error(`Missing ${distBundle}. Build it first from the repository root: npm run build:osui --target=odc`);
	process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const dist = fs.readFileSync(distBundle, 'utf8');
const sources = [
	['today', dist, 'today'],
	['s1', dist, 's1'],
];
if (fs.existsSync(baselineBundle)) {
	sources.push(['pristine', fs.readFileSync(baselineBundle, 'utf8'), 'today']);
}

for (const [prefix, source, mode] of sources) {
	for (const version of VERSIONS) {
		fs.writeFileSync(path.join(outDir, `${prefix}-${version}.js`), makeVariant(source, mode, version), 'utf8');
	}
}
console.log(`Wrote ${sources.length * VERSIONS.length} variants to ${outDir}`);
