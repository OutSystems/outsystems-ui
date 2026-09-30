import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
	countAnyKeywords,
	countSuppressions,
	createProgramFromSources,
	getClassChain,
	getConfigProps,
	getEnums,
	getExportedFunctions,
	implicitAnyDiagnostics,
} from '../lib/ts.mjs';

const framework = `
namespace Foo.Bar {
	export enum Kind { A = 'a', B = 'b' }
	export abstract class Base { public ExtendedClass: string; }
	export class Mid extends Base {}
	export class Leaf extends Mid {}
	export class LeafConfig extends Base {
		/** Whether it starts open. */
		public IsOpen: boolean;
		// Where the thing sits
		public Position: string;
		public Mode: Kind;
		public Count;
		public Shape: 'round' | 'square';
		public Items: string[];
		public validateDefault(key: string, value: unknown): unknown {
			switch (key) {
				case 'Position':
					return this.validateInRange(value, 'left', 'left', 'right');
				case 'IsOpen':
					return this.validateBoolean(value as boolean, false);
				default:
					return value;
			}
		}
		protected validateInRange(v: unknown, d: unknown, ...a: unknown[]): unknown { return d; }
		protected validateBoolean(v: boolean, d: boolean): boolean { return d; }
	}
}`;

const utils = `namespace Out.Utils { export function CreateApiResponse(x: unknown): string { return ''; } }`;

const api = `
namespace Out.Api {
	/**
	 * Creates it.
	 *
	 * @param id the id
	 * @param configs json
	 */
	export function Create(id: string, configs: string): Foo.Bar.Leaf { return null; }
	export function Dispose(id: string) {
		return Out.Utils.CreateApiResponse({ errorCode: 'OSUI-API-01', callback: () => {} });
	}
}`;

const program = createProgramFromSources({ 'a.ts': framework, 'b.ts': api, 'u.ts': utils });

test('getEnums reads string-valued enum members from a source file', () => {
	const p = createProgramFromSources({
		'e.ts': `namespace X.Enum {
			export enum CssClass { Pattern = 'osui-x', Open = 'osui-x--is-open' }
			export enum Events { OnToggle = 'OnToggle' }
			export enum Numbers { One = 1 }
		}`,
	});
	const enums = getEnums(p.getSourceFile('e.ts'));
	assert.deepEqual(
		enums.map((e) => e.name),
		['CssClass', 'Events', 'Numbers']
	);
	assert.deepEqual(enums[0].members, { Pattern: 'osui-x', Open: 'osui-x--is-open' });
	assert.deepEqual(enums[2].members, { One: 1 });
});

test('getClassChain follows extends clauses from the concrete class to the root', () => {
	assert.deepEqual(getClassChain(program, 'Leaf'), ['Leaf', 'Mid', 'Base']);
	assert.deepEqual(getClassChain(program, 'Base'), ['Base']);
});

test('getConfigProps classifies public config props and reads validateDefault', () => {
	const props = getConfigProps(program, ['a.ts']);
	const byName = Object.fromEntries(props.map((p) => [p.name, p]));
	assert.ok(!byName.ExtendedClass, 'the shared ExtendedClass prop is excluded');
	assert.equal(byName.IsOpen.kind, 'boolean');
	assert.equal(byName.IsOpen.validated, 'boolean');
	assert.equal(byName.IsOpen.defaultText, 'false');
	assert.equal(byName.IsOpen.hasDoc, true);
	assert.equal(byName.IsOpen.docText, 'Whether it starts open.');
	assert.equal(byName.Position.docText, 'Where the thing sits');
	assert.equal(byName.Mode.docText, '');
	assert.equal(byName.Position.kind, 'string');
	assert.equal(byName.Position.validated, 'inRange');
	assert.deepEqual(byName.Position.allowed, ["'left'", "'right'"]);
	assert.equal(byName.Position.hasDoc, true, 'a // comment on the previous line counts as documentation');
	assert.equal(byName.Mode.kind, 'enum');
	assert.equal(byName.Mode.hasDoc, false);
	assert.equal(byName.Count.kind, 'untyped');
	assert.equal(byName.Shape.kind, 'enum');
	assert.equal(byName.Items.kind, 'array');
});

test('getExportedFunctions reports params, return types, JSDoc, calls and string literals', () => {
	const fns = getExportedFunctions(program.getSourceFile('b.ts'));
	const byName = Object.fromEntries(fns.map((f) => [f.name, f]));
	assert.deepEqual(Object.keys(byName).sort(), ['Create', 'Dispose']);
	assert.deepEqual(
		byName.Create.params.map((p) => p.name),
		['id', 'configs']
	);
	assert.equal(byName.Create.hasReturnType, true);
	assert.equal(byName.Create.returnType, 'Foo.Bar.Leaf');
	assert.equal(byName.Create.jsDoc.description, 'Creates it.');
	assert.deepEqual(byName.Create.jsDoc.params, ['id', 'configs']);
	assert.equal(byName.Dispose.hasReturnType, false);
	assert.equal(byName.Dispose.jsDoc, null);
	assert.ok(byName.Dispose.calls.has('CreateApiResponse'));
	assert.ok(byName.Dispose.stringLiterals.includes('OSUI-API-01'));
});

test('countAnyKeywords and countSuppressions', () => {
	const p = createProgramFromSources({
		'c.ts': 'let x: any; function f(a: any): void {}\n// @ts-ignore\nconst y = 1;\n// @ts-expect-error\nconst z = 2;',
	});
	const sf = p.getSourceFile('c.ts');
	assert.equal(countAnyKeywords(sf), 2);
	assert.equal(countSuppressions(sf), 2);
});

test('implicitAnyDiagnostics surfaces noImplicitAny findings', () => {
	const p = createProgramFromSources({ 'd.ts': 'function f(a) { return a; }' }, { noImplicitAny: true });
	const diags = implicitAnyDiagnostics(p);
	assert.equal(diags.length, 1);
	assert.equal(diags[0].code, 7006);
});
