import assert from 'node:assert/strict';
import { test } from 'node:test';

import { platformDefault, withPlatformDefault } from '../lib/defaults.mjs';

const p = (type, typeKind, typeRef = null, extra = {}) => ({
	name: 'P',
	type,
	typeKind,
	typeRef,
	mandatory: false,
	default: null,
	description: '',
	...extra,
});

test('platformDefault follows the OutSystems basic data types', () => {
	assert.equal(platformDefault(p('Boolean', 'basic')), 'False');
	assert.equal(platformDefault(p('Integer', 'basic')), '0');
	assert.equal(platformDefault(p('Long Integer', 'basic')), '0');
	assert.equal(platformDefault(p('Decimal', 'basic')), '0.0');
	assert.equal(platformDefault(p('Currency', 'basic')), '0.0');
	assert.equal(platformDefault(p('Text', 'basic')), '""');
	assert.equal(platformDefault(p('Email', 'basic')), '""');
	assert.equal(platformDefault(p('Phone Number', 'basic')), '""');
	assert.equal(platformDefault(p('Date', 'basic')), '#1900-01-01#');
	assert.equal(platformDefault(p('Time', 'basic')), '#00:00:00#');
	assert.equal(platformDefault(p('Date Time', 'basic')), '#1900-01-01 00:00:00#');
	assert.equal(platformDefault(p('Binary Data', 'other')), 'empty binary');
	assert.equal(platformDefault(p('Size Identifier', 'staticEntity', 'Size')), 'NullIdentifier()');
	assert.equal(platformDefault(p('Product Identifier', 'identifier', 'Product')), 'NullIdentifier()');
	assert.equal(platformDefault(p('CarouselItems', 'structure', 'CarouselItems')), 'empty CarouselItems');
	assert.equal(platformDefault(p('DropdownOption List', 'list', 'DropdownOption')), 'empty list');
	assert.equal(platformDefault(p('Object', 'other')), 'NullObject()');
});

test('withPlatformDefault fills an optional parameter the OML leaves empty and says where the default comes from', () => {
	assert.deepEqual(withPlatformDefault(p('Boolean', 'basic')), {
		...p('Boolean', 'basic'),
		default: 'False',
		defaultSource: 'platform',
	});
	assert.deepEqual(withPlatformDefault(p('Boolean', 'basic', null, { default: 'True' })), {
		...p('Boolean', 'basic', null, { default: 'True' }),
		defaultSource: 'oml',
	});
	const required = p('Text', 'basic', null, { mandatory: true });
	assert.deepEqual(
		withPlatformDefault(required),
		{ ...required, defaultSource: null },
		'a required parameter has no default'
	);
});
