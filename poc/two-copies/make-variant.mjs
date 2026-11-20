#!/usr/bin/env node
/**
 * Writes a variant of a compiled OutSystems UI bundle under a different version label.
 *
 *   node make-variant.mjs --mode today|s1 --version 3.2.0 --in ../../dist/ODC.OutSystemsUI.js --out variants/s1-3.2.0.js
 *
 * Modes:
 *   today  Rewrites `Constants.OSUIVersion = '<x>'` to the label. Nothing else: this is the bundle as it ships.
 *   s1     Also wraps the tsc output in the version-guarded prologue of ROU-13176 §8.2 (seed and publish the
 *          three globals, "last loaded revision of a major wins", one slot per major under window.__osLibs.osui.majors).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION_PATTERN = /(Constants\.OSUIVersion = ')[^']*(')/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

/**
 * Parses `--name value` pairs from the command line.
 *
 * @param {string[]} argv Raw arguments after the script name
 * @returns {Record<string, string>} the parsed options
 */
function parseArgs(argv) {
	const options = {};
	for (let i = 0; i < argv.length; i += 2) {
		if (!argv[i].startsWith('--') || argv[i + 1] === undefined) {
			throw new Error(
				`Unexpected argument '${argv[i]}'. Usage: --mode today|s1 --version x.y.z --in <file> --out <file>`
			);
		}
		options[argv[i].slice(2)] = argv[i + 1];
	}
	return options;
}

/**
 * Builds the §8.2 prologue around the tsc output. The tsc output keeps its own `var OSFramework;` lines:
 * inside the wrapper they redeclare the seeded locals without resetting them.
 *
 * @param {string} version The version label the bundle claims
 * @param {string} tscOutput The compiled code, without its leading "use strict" directive
 * @returns {string} the wrapped code
 */
function wrapWithPrologue(version, tscOutput) {
	return `(function () {
	'use strict';
	var VERSION = '${version}';
	var MAJOR = VERSION.split('.')[0];

	var root = (window.__osLibs = window.__osLibs || {});
	var lib = (root.osui = root.osui || { majors: {} });
	var current = lib.majors[MAJOR];
	var otherMajor = Object.keys(lib.majors).some(function (m) {
		return m !== MAJOR;
	});

	// Last loaded wins: only the revision already serving (or another major) is a no-op; any other revision of
	// this major, older or newer, takes over in place and adopts the shared store.
	if (otherMajor || (current && current.version === VERSION)) {
		console.warn(
			'[OutSystems UI] ' +
				VERSION +
				' not applied; ' +
				(current ? current.version : 'another major') +
				' serves this page.'
		);
		return; // never touches the globals or the state
	}
	if (current) {
		console.info('[OutSystems UI] ' + current.version + ' → ' + VERSION); // last loaded wins
	}
	lib.majors[MAJOR] = { version: VERSION, state: current ? current.state : {} };

	// tsc emits \`var OSFramework;\` etc. at its top level. Inside this function those declarations are local,
	// so seed the locals from window first (a later \`var X;\` without initializer keeps the value)...
	var OSFramework = window.OSFramework,
		OutSystems = window.OutSystems,
		Providers = window.Providers;
/* ---- tsc output ---- */
${tscOutput}
/* ---- end of tsc output ---- */
	// ...and publish them back, so the globals stay exactly where customers and the module expect them.
	window.OSFramework = OSFramework;
	window.OutSystems = OutSystems;
	window.Providers = Providers;
})();
`;
}

/**
 * Produces the variant source.
 *
 * @param {string} source The compiled bundle
 * @param {'today'|'s1'} mode Which variant to write
 * @param {string} version The version label
 * @returns {string} the variant source
 */
export function makeVariant(source, mode, version) {
	if (!SEMVER_PATTERN.test(version)) {
		throw new Error(`Version '${version}' is not x.y.z`);
	}
	if (!VERSION_PATTERN.test(source)) {
		throw new Error("Could not find `Constants.OSUIVersion = '...'` in the bundle");
	}
	const relabelled = source.replace(VERSION_PATTERN, `$1${version}$2`);
	if (mode === 'today') {
		return relabelled;
	}
	if (mode !== 's1') {
		throw new Error(`Unknown mode '${mode}' (expected today or s1)`);
	}

	// Keep the license banner first, then move the "use strict" directive into the wrapper (a directive is
	// only honoured as the first statement of a function body).
	const bannerEnd = relabelled.startsWith('/*!') ? relabelled.indexOf('*/') + 2 : 0;
	const banner = relabelled.slice(0, bannerEnd);
	const body = relabelled.slice(bannerEnd).replace(/^\s*"use strict";\s*/, '');

	return `${banner}\n${wrapWithPrologue(version, body)}`;
}

const isCli = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
	const options = parseArgs(process.argv.slice(2));
	for (const required of ['mode', 'version', 'in', 'out']) {
		if (options[required] === undefined) {
			throw new Error(`Missing --${required}`);
		}
	}
	const source = fs.readFileSync(options.in, 'utf8');
	fs.mkdirSync(path.dirname(options.out), { recursive: true });
	fs.writeFileSync(options.out, makeVariant(source, options.mode, options.version), 'utf8');
	console.log(`Wrote ${options.out} (${options.mode}, ${options.version})`);
}
