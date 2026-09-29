import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../evals/ai-friendliness/lib/context.mjs';
import { buildManifest } from '../scripts/lib/ai-docs.mjs';
import { OUTPUT_FILE, renderPatternTypes } from '../scripts/lib/pattern-types.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = createContext(root);
const source = await renderPatternTypes(ctx, buildManifest(ctx));

test('one namespace block per pattern, typed optional props with descriptions', () => {
	for (const p of ctx.inventory.patterns) assert.match(source, new RegExp(`namespace OutSystems\\.OSUI\\.Patterns\\.${p.name}API \\{`));
	assert.match(source, /MultipleItems\?: boolean;/);
	assert.match(source, /Icon\?: 'Caret' \| 'Custom' \| 'PlusMinus';/);
	assert.match(source, /TabsOrientation\?: 'horizontal' \| 'vertical';/);
	assert.match(source, /\/\*\* Allows several items to be expanded at once[^*]*\*\/\s*MultipleItems\?/);
	assert.match(source, /ExtendedClass\?: string;/);
});

test('types stay inside the public layer: no provider or framework references, callbacks excluded', () => {
	const code = source.replace(/\/\*[\s\S]*?\*\//g, '');
	assert.doesNotMatch(code, /Providers\./);
	assert.doesNotMatch(code, /GlobalEnum\./);
	assert.doesNotMatch(code, /OSFramework\./);
	assert.match(source, /OptionsList\?: unknown\[\];/, 'provider-typed lists degrade to unknown[] with a note');
	assert.doesNotMatch(source, /OnChangeEventCallback\?/, 'internal callback fields are not inputs');
	assert.match(source, /Direction\?: 'ltr' \| 'rtl' \| 'ttb';/, 'enum-member unions resolve to literal values');
});

test('event name unions list the pattern events plus the lifecycle events, with a string escape hatch', () => {
	assert.match(source, /namespace OutSystems\.OSUI\.Patterns\.AccordionItemAPI \{[\s\S]*?export type EventName = 'OnToggle' \| 'Initialized' \| \(string & \{\}\);/);
	assert.match(source, /namespace OutSystems\.OSUI\.Patterns\.CarouselAPI \{[\s\S]*?'OnProviderConfigsApplied'/, 'provider patterns get the provider lifecycle event');
});

test('the committed generated file is fresh', () => {
	const committed = fs.readFileSync(path.join(root, OUTPUT_FILE), 'utf8').replace(/\r\n/g, '\n');
	assert.equal(committed, source.replace(/\r\n/g, '\n'), 'run `npm run types:generate` and commit');
});
