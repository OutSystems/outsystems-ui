// @ts-check
/**
 * Loads a single ambient-namespace TypeScript source file so its exported functions can be
 * unit-tested without the browser or the full AMD bundle.
 *
 * `namespace OSFramework.OSUI.Helper { export function X() {} }` transpiles to an IIFE that
 * extends a root object named `OSFramework`. The transpiled code is evaluated as a function body
 * in the host realm (so `JSON`, `Error` and object prototypes are the test's own), receiving
 * fresh root objects for the namespaces the file declares plus anything passed in `globals`.
 */
import fs from 'node:fs';

import ts from 'typescript';

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
	for (const m of source.matchAll(/^\s*namespace\s+([A-Za-z_$][\w$]*)/gm)) {
		if (!(m[1] in context)) context[m[1]] = {};
	}
	const names = Object.keys(context);
	// `var OSFramework;` inside the body re-declares the parameter without resetting it, so the
	// IIFE populates the object we pass in.
	// eslint-disable-next-line no-new-func
	new Function(...names, outputText)(...names.map((n) => context[n]));
	return context;
}
