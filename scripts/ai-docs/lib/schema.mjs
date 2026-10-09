// @ts-check
/**
 * A small structural JSON validator for the committed data files (the block snapshots). It supports the
 * keywords those schemas use — type, required, properties, additionalProperties, items, enum, const,
 * minItems — and returns every violation with its JSON path. No dependency, no code execution.
 */

/** @typedef {{ path: string, message: string }} Violation */

/** @param {unknown} v */
function typeOf(v) {
	if (v === null) return 'null';
	if (Array.isArray(v)) return 'array';
	return typeof v;
}

/**
 * @param {any} schema
 * @param {unknown} value
 * @param {string} [path]
 * @returns {Violation[]}
 */
export function validate(schema, value, path = '$') {
	/** @type {Violation[]} */
	const out = [];
	const actual = typeOf(value);
	if (schema.type !== undefined) {
		const types = Array.isArray(schema.type) ? schema.type : [schema.type];
		const integerOk = actual === 'number' && types.includes('integer') && Number.isInteger(value);
		if (!types.includes(actual) && !integerOk) {
			out.push({ path, message: `expected ${types.join('|')}, got ${actual}` });
			return out;
		}
	}
	if (schema.enum !== undefined && !schema.enum.includes(value)) {
		out.push({ path, message: `expected one of ${schema.enum.join(', ')}` });
	}
	if (schema.const !== undefined && value !== schema.const) {
		out.push({ path, message: `expected ${JSON.stringify(schema.const)}` });
	}
	if (actual === 'object') validateObject(schema, /** @type {Record<string, unknown>} */ (value), path, out);
	if (actual === 'array') validateArray(schema, /** @type {unknown[]} */ (value), path, out);
	return out;
}

/**
 * @param {any} schema
 * @param {Record<string, unknown>} value
 * @param {string} path
 * @param {Violation[]} out
 */
function validateObject(schema, value, path, out) {
	for (const key of schema.required ?? []) {
		if (!(key in value)) out.push({ path: `${path}.${key}`, message: 'required' });
	}
	const props = schema.properties ?? {};
	for (const [key, v] of Object.entries(value)) {
		const sub = `${path}.${key}`;
		if (props[key] !== undefined) out.push(...validate(props[key], v, sub));
		else if (typeof schema.additionalProperties === 'object')
			out.push(...validate(schema.additionalProperties, v, sub));
		else if (schema.additionalProperties === false) out.push({ path: sub, message: 'unexpected property' });
	}
}

/**
 * @param {any} schema
 * @param {unknown[]} value
 * @param {string} path
 * @param {Violation[]} out
 */
function validateArray(schema, value, path, out) {
	if (schema.minItems !== undefined && value.length < schema.minItems) {
		out.push({ path, message: `expected at least ${schema.minItems} items` });
	}
	if (schema.items !== undefined) value.forEach((v, i) => out.push(...validate(schema.items, v, `${path}[${i}]`)));
}
