// @ts-check
/**
 * Loads a single ambient-namespace TypeScript source file so its exported functions can be
 * unit-tested without the browser or the full AMD bundle.
 *
 * `namespace OSFramework.OSUI.Helper { export function X() {} }` transpiles to an IIFE that
 * extends a root object named `OSFramework`. The transpiled code is wrapped as a CommonJS module
 * exporting a function whose parameters are the namespace roots, written to a temporary file and
 * loaded through `require` — so no string is ever passed to `eval` or `new Function`. Inside the
 * body, `var OSFramework;` re-declares the parameter without resetting it, so the IIFE populates
 * the object we pass in. The source is repository code compiled by TypeScript, never external input.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

import ts from 'typescript';

const require = createRequire(import.meta.url);

/**
 * Namespace root identifiers declared in a source (`namespace Foo.Bar {` → `Foo`).
 * @param {string} source
 */
function namespaceRoots(source) {
	/** @type {Set<string>} */
	const roots = new Set();
	for (const line of source.split('\n')) {
		const trimmed = line.trimStart();
		if (!trimmed.startsWith('namespace ')) continue;
		const name = trimmed.slice('namespace '.length).trimStart();
		const root = name.split(/[.\s{]/)[0];
		if (root) roots.add(root);
	}
	return roots;
}

/**
 * @param {string} file absolute path of the `.ts` source
 * @param {Record<string, unknown>} [globals] extra globals (stubs for other namespaces, `window`, …)
 * @returns {Record<string, any>} the populated namespace roots and globals
 */
export function loadNamespaceFile(file, globals = {}) {
	const source = fs.readFileSync(file, 'utf8');
	const { outputText, diagnostics } = ts.transpileModule(source, {
		compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.None, removeComments: true },
		reportDiagnostics: true,
	});
	if (diagnostics && diagnostics.length) {
		throw new Error(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
	}
	/** @type {Record<string, any>} */
	const context = { ...globals };
	for (const root of namespaceRoots(source)) if (!(root in context)) context[root] = {};
	const names = Object.keys(context);

	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-namespace-'));
	const moduleFile = path.join(dir, `${path.basename(file, '.ts')}.cjs`);
	fs.writeFileSync(moduleFile, `module.exports = function (${names.join(', ')}) {\n${outputText}\n};\n`);
	try {
		require(moduleFile)(...names.map((n) => context[n]));
	} finally {
		fs.rmSync(dir, { recursive: true, force: true });
	}
	return context;
}
