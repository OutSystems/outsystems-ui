import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validate } from '../lib/schema.mjs';

const schema = {
	type: 'object',
	required: ['version', 'blocks'],
	properties: {
		version: { const: 1 },
		kind: { enum: ['ODC', 'O11'] },
		blocks: {
			type: 'object',
			additionalProperties: {
				type: 'object',
				required: ['flow'],
				properties: {
					flow: { type: 'string' },
					tags: { type: 'array', minItems: 1, items: { type: 'string' } },
				},
				additionalProperties: false,
			},
		},
	},
};

test('validate accepts a conforming document', () => {
	assert.deepEqual(validate(schema, { version: 1, kind: 'ODC', blocks: { 'A/B': { flow: 'A', tags: ['x'] } } }), []);
});

test('validate reports every violation with its JSON path', () => {
	const v = validate(schema, { version: 2, kind: 'Web', blocks: { 'A/B': { tags: [], extra: 1 } } });
	assert.deepEqual(
		v.map((x) => x.path).sort((a, b) => (a < b ? -1 : Number(a > b))),
		['$.blocks.A/B.extra', '$.blocks.A/B.flow', '$.blocks.A/B.tags', '$.kind', '$.version']
	);
	assert.ok(v.some((x) => x.message === 'required'));
	assert.ok(v.some((x) => x.message === 'unexpected property'));
});

test('validate treats integers as numbers and null as its own type', () => {
	assert.deepEqual(validate({ type: 'integer' }, 3), []);
	assert.equal(validate({ type: 'integer' }, 3.5).length, 1);
	assert.deepEqual(validate({ type: ['string', 'null'] }, null), []);
	assert.equal(validate({ type: 'string' }, null)[0].message, 'expected string, got null');
});
