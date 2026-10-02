import assert from 'node:assert/strict';
import { test } from 'node:test';

import { RUNTIME_ONLY } from '../../lib/producers.mjs';
import M05, { measureDocs, scoreGuidance } from '../metrics/M05-producer-guidance.mjs';

const index = [
	'# OutSystems UI (llms.txt)',
	'## Producers',
	'- OML producers: read llms-blocks.txt.',
	'- Runtime producers: read llms-components.txt.',
	'## Gotchas (read before generating)',
	`1. ${RUNTIME_ONLY} A pattern root element needs \`name="<id>"\`.`,
	'2. Lifecycle: Create → RegisterCallback → Initialize.',
	'3. Styling is token-based.',
	`4. ${RUNTIME_ONLY} Load one card from llms-components.txt per pattern.`,
].join('\r\n');
const components = `## Accordion\r\n${RUNTIME_ONLY} Lifecycle: Create\r\nProps: none\r\nMarkup skeleton (from x): <div>\r\n\r\n## Tabs\r\n${RUNTIME_ONLY} Lifecycle: Create\r\n${RUNTIME_ONLY} Markup skeleton (from y): <section>\r\n`;
const patterns = `### alert\r\nSkeleton (from a): <div>\r\n### badge\r\n${RUNTIME_ONLY} Skeleton (from b): <span>\r\n`;

test('measureDocs prorates each check and reads CRLF text', () => {
	const c = measureDocs({ index, components, patterns, blocks: '# blocks' });
	assert.deepEqual(c, { producers: 20, gotchas: 13.3, cards: 15, patterns: 10, blocksDoc: 20 });
	assert.equal(scoreGuidance(c), 78.3);
});

test('measureDocs is 0 on every check without docs, and 20 for checks with nothing to mark', () => {
	assert.deepEqual(measureDocs({ index: null, components: null, patterns: null, blocks: null }), {
		producers: 0,
		gotchas: 0,
		cards: 0,
		patterns: 0,
		blocksDoc: 0,
	});
	const c = measureDocs({
		index: '# x\n## Gotchas\n1. Styling is token-based.\n',
		components: '## A\nProps: none\n',
		patterns: '### a\nCSS API: --x\n',
		blocks: null,
	});
	assert.deepEqual(c, { producers: 0, gotchas: 20, cards: 20, patterns: 20, blocksDoc: 0 });
});

test('M05 is a whole-docs eval', () => {
	assert.equal(M05.present.heatmap, false);
	const r = M05.compute(/** @type {any} */ ({ docsAi: () => null }));
	assert.equal(r.score, 0);
	assert.deepEqual(r.perComponent, []);
});
