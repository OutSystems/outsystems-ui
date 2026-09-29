import assert from 'node:assert/strict';
import { test } from 'node:test';

import { extractTemplates, measureHtml, measureStory } from '../lib/markup.mjs';

test('measureHtml counts nesting depth, elements and class names', () => {
	const r = measureHtml('<div><div class="a b"><span>x</span></div><img src="x"/><input></div>');
	assert.equal(r.depth, 3);
	assert.equal(r.elements, 5);
	assert.deepEqual(r.classes, ['a', 'b']);
});

test('extractTemplates returns HTML template literals and inlines local helper templates', () => {
	const source = `
import { renderPattern } from './_helpers/osui';
function itemMarkup(id: string, title: string): string {
	return \`
		<div id="\${id}" data-block="osui">
			<div name="\${id}" class="osui-accordion-item">
				<div class="osui-accordion-item__title"><span>\${title}</span></div>
				<div class="osui-accordion-item__content"><div>\${title}</div></div>
			</div>
		</div>\`;
}
const notHtml = \`hello \${world}\`;
export const Default = {
	render: (args) => {
		const template = \`
			<div class="osui-accordion">
				\${FAQ.map(([t, b], i) => itemMarkup(itemIds[i], t)).join('')}
			</div>\`;
		return renderPattern(template, () => {});
	},
};`;
	const templates = extractTemplates(source);
	assert.equal(templates.length, 2, 'the helper template and the story template; the non-HTML literal is skipped');
	const composed = templates.find((t) => t.includes('osui-accordion"'));
	assert.match(composed, /osui-accordion-item__title/, 'helper call inside .map() is inlined');
	assert.equal(measureHtml(composed).depth, 5);
});

test('measureStory picks the deepest template of a story source', () => {
	const source = 'const a = `<div><span></span></div>`; const b = `<ul><li><a><i></i></a></li></ul>`;';
	const r = measureStory(source);
	assert.equal(r.depth, 4);
	assert.equal(r.elements, 4);
	assert.equal(r.templates, 2);
});
