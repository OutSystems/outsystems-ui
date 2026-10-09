// @ts-check
/**
 * The platform's default for a block parameter the OML leaves without one. OutSystems gives every data type a
 * default value (the "Basic data types" table of the reference documentation); an optional parameter that
 * declares none takes it at runtime, so the generated docs can state it without changing the OML.
 */

/** @type {Record<string, string>} */
const BASIC = {
	Boolean: 'False',
	Integer: '0',
	'Long Integer': '0',
	Decimal: '0.0',
	Currency: '0.0',
	Text: '""',
	Email: '""',
	'Phone Number': '""',
	Date: '#1900-01-01#',
	Time: '#00:00:00#',
	'Date Time': '#1900-01-01 00:00:00#',
	'Binary Data': 'empty binary',
};

/**
 * @param {{ type: string, typeKind: string, typeRef: string|null }} param
 * @returns {string}
 */
export function platformDefault(param) {
	if (param.typeKind === 'staticEntity' || param.typeKind === 'identifier') return 'NullIdentifier()';
	if (param.typeKind === 'structure') return `empty ${param.typeRef ?? param.type}`;
	if (param.typeKind === 'list') return 'empty list';
	const basic = BASIC[param.type];
	if (basic) return basic;
	return 'NullObject()';
}

/**
 * The parameter with its default settled: the OML's when it declares one, the platform's when it is optional
 * and declares none, and `defaultSource` saying which. A required parameter has no default.
 * @template {{ type: string, typeKind: string, typeRef: string|null, mandatory: boolean, default: string|null }} T
 * @param {T} param
 * @returns {T & { defaultSource: 'oml'|'platform'|null }}
 */
export function withPlatformDefault(param) {
	if (param.default !== null && param.default !== undefined) return { ...param, defaultSource: 'oml' };
	if (param.mandatory) return { ...param, defaultSource: null };
	return { ...param, default: platformDefault(param), defaultSource: 'platform' };
}
