import assert from 'node:assert/strict';
import { test } from 'node:test';

import { extractTemplates, measureHtml, measureStory, scanTags } from '../lib/markup.mjs';

test('measureHtml counts nesting depth, elements and class names', () => {
	const r = measureHtml('<div><div class="a b"><span>x</span></div><img src="x"/><input></div>');
	assert.equal(r.depth, 3);
	assert.equal(r.elements, 5);
	assert.equal(r.distinctElements, 5);
	assert.deepEqual(r.classes, ['a', 'b']);
});

test('measureHtml collapses repeated sibling structures into distinct element signatures', () => {
	const r = measureHtml(
		'<ul class="list"><li class="item"><span>a</span></li><li class="item"><span>b</span></li><li class="item"><span>c</span></li></ul>'
	);
	assert.equal(r.elements, 7);
	assert.equal(r.distinctElements, 3, 'ul.list, li.item and span');
	assert.equal(r.depth, 3);
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

test('scanTags reads tags without regular expressions and skips stray angle brackets', () => {
	const tags = scanTags('a < b <div class="x"><br/></div> <3 <span>');
	assert.deepEqual(
		tags.map((t) => `${t.closing ? '/' : ''}${t.tag}`),
		['div', 'br', '/div', 'span']
	);
	assert.equal(tags[0].attrs, ' class="x"');
});
