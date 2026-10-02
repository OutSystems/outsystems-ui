// @ts-check
/**
 * TypeScript compiler-API helpers shared by the evals.
 *
 * The library is written as ambient namespaces compiled into one AMD file, so a single
 * `ts.Program` over `src/scripts` sees every symbol; there are no ES imports to resolve.
 */
import path from 'node:path';

import ts from 'typescript';

/**
 * Compiler options + file list from the repository tsconfig.
 * @param {string} root
 */
function loadRepoConfig(root) {
	const configPath = path.join(root, 'tsconfig.json');
	const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);
	if (error) throw new Error(ts.flattenDiagnosticMessageText(error.messageText, '\n'));
	return ts.parseJsonConfigFileContent(config, ts.sys, root);
}

/**
 * Program over the repository sources. Never emits.
 * @param {string} root
 * @param {ts.CompilerOptions} [extraOptions]
 * @returns {ts.Program}
 */
export function createProgram(root, extraOptions = {}) {
	const parsed = loadRepoConfig(root);
	/** @type {ts.CompilerOptions} */
	const options = { ...parsed.options, ...extraOptions, noEmit: true, declaration: false };
	delete options.outFile;
	return ts.createProgram({ rootNames: parsed.fileNames, options });
}

/**
 * In-memory program for tests and fixtures.
 * @param {Record<string, string>} sources fileName → text
 * @param {ts.CompilerOptions} [options]
 * @returns {ts.Program}
 */
export function createProgramFromSources(sources, options = {}) {
	/** @type {ts.CompilerOptions} */
	const compilerOptions = {
		target: ts.ScriptTarget.ES2017,
		module: ts.ModuleKind.AMD,
		lib: ['lib.es2019.d.ts', 'lib.dom.d.ts'],
		types: [],
		noEmit: true,
		...options,
	};
	const files = new Map(Object.entries(sources));
	const host = ts.createCompilerHost(compilerOptions, true);
	const baseGetSourceFile = host.getSourceFile.bind(host);
	const baseFileExists = host.fileExists.bind(host);
	const baseReadFile = host.readFile.bind(host);
	host.getSourceFile = (fileName, languageVersion, onError) =>
		files.has(fileName)
			? ts.createSourceFile(fileName, /** @type {string} */ (files.get(fileName)), languageVersion, true)
			: baseGetSourceFile(fileName, languageVersion, onError);
	host.fileExists = (f) => files.has(f) || baseFileExists(f);
	host.readFile = (f) => (files.has(f) ? files.get(f) : baseReadFile(f));
	host.writeFile = () => {};
	return ts.createProgram({ rootNames: [...files.keys()], options: compilerOptions, host });
}

/**
 * Resolve a source file of the program by absolute or program-relative path.
 * @param {ts.Program} program
 * @param {string} file
 * @returns {ts.SourceFile|undefined}
 */
export function getSourceFile(program, file) {
	return program.getSourceFile(file) ?? program.getSourceFile(file.split(path.sep).join('/'));
}

/**
 * Depth-first visit of every node under `node`.
 * @param {ts.Node} node
 * @param {(n: ts.Node) => void} visit
 */
function walkNodes(node, visit) {
	visit(node);
	ts.forEachChild(node, (child) => walkNodes(child, visit));
}

/** @param {ts.Node} node */
function hasExportModifier(node) {
	return (ts.getCombinedModifierFlags(/** @type {ts.Declaration} */ (node)) & ts.ModifierFlags.Export) !== 0;
}

/**
 * @typedef {object} JsDocInfo
 * @property {string} description
 * @property {string[]} params  names carried by `@param` tags
 * @property {Record<string, string>} paramDescriptions  text of each `@param` tag, by parameter name
 * @property {string|null} returns  text of the `@returns` (or `@return`) tag; null without one, '' when bare
 * @property {string[]} tags    tag names (`param`, `returns`, `deprecated`, …)
 */

/**
 * Closest JSDoc block attached to a node, or null.
 * @param {ts.Node} node
 * @returns {JsDocInfo|null}
 */
export function getJsDoc(node) {
	const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
	if (docs.length === 0) return null;
	const doc = docs[docs.length - 1];
	const description = (ts.getTextOfJSDocComment(doc.comment) ?? '').trim();
	const tags = (doc.tags ?? []).map((t) => t.tagName.text);
	/** @type {Record<string, string>} */
	const paramDescriptions = {};
	for (const t of (doc.tags ?? []).filter(ts.isJSDocParameterTag)) {
		paramDescriptions[t.name.getText()] = (ts.getTextOfJSDocComment(t.comment) ?? '').trim();
	}
	const returnTag = (doc.tags ?? []).find((t) => ts.isJSDocReturnTag(t));
	const returns = returnTag ? (ts.getTextOfJSDocComment(returnTag.comment) ?? '').trim() : null;
	return { description, params: Object.keys(paramDescriptions), paramDescriptions, returns, tags };
}

/**
 * The `@defaultValue` a property documents, as source text, or null.
 * @param {ts.Node} node
 */
function documentedDefault(node) {
	const tag = ts.getJSDocTags(node).find((t) => t.tagName.text === 'defaultValue');
	if (!tag) return null;
	const text = (ts.getTextOfJSDocComment(tag.comment) ?? '').trim();
	return text.length ? text : null;
}

/**
 * @typedef {object} ExportedFunction
 * @property {string} name
 * @property {string} file
 * @property {{ name: string, type: string|null }[]} params
 * @property {string|null} returnType
 * @property {boolean} hasReturnType
 * @property {JsDocInfo|null} jsDoc
 * @property {Set<string>} calls          names of functions/methods invoked in the body
 * @property {string[]} stringLiterals    string literal values found in the body
 * @property {ts.FunctionDeclaration} node
 */

/**
 * Exported function declarations of a source file (namespace members included).
 * @param {ts.SourceFile|undefined} sf
 * @returns {ExportedFunction[]}
 */
export function getExportedFunctions(sf) {
	if (!sf) return [];
	/** @type {ExportedFunction[]} */
	const out = [];
	walkNodes(sf, (n) => {
		if (!ts.isFunctionDeclaration(n) || !n.name || !hasExportModifier(n)) return;
		/** @type {Set<string>} */
		const calls = new Set();
		/** @type {string[]} */
		const stringLiterals = [];
		if (n.body) {
			walkNodes(n.body, (b) => {
				if (ts.isCallExpression(b)) {
					const callee = b.expression;
					if (ts.isIdentifier(callee)) calls.add(callee.text);
					else if (ts.isPropertyAccessExpression(callee)) calls.add(callee.name.text);
				}
				if (ts.isStringLiteral(b) || ts.isNoSubstitutionTemplateLiteral(b)) stringLiterals.push(b.text);
			});
		}
		out.push({
			name: n.name.text,
			file: sf.fileName,
			params: n.parameters.map((p) => ({ name: p.name.getText(sf), type: p.type ? p.type.getText(sf) : null })),
			returnType: n.type ? n.type.getText(sf) : null,
			hasReturnType: n.type !== undefined,
			jsDoc: getJsDoc(n),
			calls,
			stringLiterals,
			node: n,
		});
	});
	return out;
}

/**
 * Every class declaration in the program's own (non-declaration) files, keyed by name.
 * @param {ts.Program} program
 * @returns {Map<string, ts.ClassDeclaration[]>}
 */
function indexClasses(program) {
	/** @type {Map<string, ts.ClassDeclaration[]>} */
	const index = new Map();
	for (const sf of program.getSourceFiles()) {
		if (sf.isDeclarationFile) continue;
		walkNodes(sf, (n) => {
			if (ts.isClassDeclaration(n) && n.name) {
				const list = index.get(n.name.text) ?? [];
				list.push(n);
				index.set(n.name.text, list);
			}
		});
	}
	return index;
}

/**
 * Name of the class a declaration extends, if any (type arguments and namespace paths stripped).
 * @param {ts.ClassDeclaration} cls
 * @returns {string|null}
 */
function extendsName(cls) {
	for (const clause of cls.heritageClauses ?? []) {
		if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue;
		const expr = clause.types[0]?.expression;
		if (!expr) return null;
		if (ts.isIdentifier(expr)) return expr.text;
		if (ts.isPropertyAccessExpression(expr)) return expr.name.text;
		return expr.getText().split('.').pop() ?? null;
	}
	return null;
}

/**
 * Inheritance chain from a class to its root: `['Leaf', 'Mid', 'Base']`.
 * @param {ts.Program} program
 * @param {string} className
 * @returns {string[]}
 */
export function getClassChain(program, className) {
	const index = indexClasses(program);
	/** @type {string[]} */
	const chain = [];
	let current = className;
	const seen = new Set();
	while (current && !seen.has(current)) {
		seen.add(current);
		chain.push(current);
		const decl = index.get(current)?.[0];
		if (!decl) break;
		current = extendsName(decl) ?? '';
	}
	return chain;
}

/**
 * @typedef {object} ClassInfo
 * @property {string} name
 * @property {string} file
 * @property {boolean} isAbstract
 * @property {string[]} chain
 * @property {string[]} implementsNames
 */

/**
 * Classes declared in the given files with their inheritance chains.
 * @param {ts.Program} program
 * @param {string[]} files
 * @returns {ClassInfo[]}
 */
export function getClassesInFiles(program, files) {
	/** @type {ClassInfo[]} */
	const out = [];
	for (const file of files) {
		const sf = getSourceFile(program, file);
		if (!sf) continue;
		walkNodes(sf, (n) => {
			if (!ts.isClassDeclaration(n) || !n.name) return;
			const isAbstract = (ts.getCombinedModifierFlags(n) & ts.ModifierFlags.Abstract) !== 0;
			const implementsNames = (n.heritageClauses ?? [])
				.filter((c) => c.token === ts.SyntaxKind.ImplementsKeyword)
				.flatMap((c) => c.types.map((t) => t.expression.getText(sf).split('.').pop() ?? ''));
			out.push({
				name: n.name.text,
				file,
				isAbstract,
				chain: getClassChain(program, n.name.text),
				implementsNames,
			});
		});
	}
	return out;
}

/**
 * @typedef {'boolean'|'number'|'string'|'enum'|'array'|'object'|'function'|'union'|'unknown'|'any'|'untyped'} PropKind
 */

/** Kind implied by a keyword or simple type node. */
const KEYWORD_KINDS = new Map([
	[ts.SyntaxKind.BooleanKeyword, 'boolean'],
	[ts.SyntaxKind.NumberKeyword, 'number'],
	[ts.SyntaxKind.StringKeyword, 'string'],
	[ts.SyntaxKind.UnknownKeyword, 'unknown'],
	[ts.SyntaxKind.AnyKeyword, 'any'],
	[ts.SyntaxKind.ArrayType, 'array'],
	[ts.SyntaxKind.FunctionType, 'function'],
	[ts.SyntaxKind.TypeLiteral, 'object'],
	[ts.SyntaxKind.LiteralType, 'enum'],
]);

/**
 * Kind inferred from an initializer when a property has no type annotation.
 * @param {ts.Expression|undefined} initializer
 * @returns {PropKind}
 */
function kindFromInitializer(initializer) {
	if (!initializer) return 'untyped';
	if (initializer.kind === ts.SyntaxKind.TrueKeyword || initializer.kind === ts.SyntaxKind.FalseKeyword)
		return 'boolean';
	if (ts.isNumericLiteral(initializer)) return 'number';
	if (ts.isStringLiteral(initializer) || ts.isTemplateLiteral(initializer)) return 'string';
	if (ts.isArrayLiteralExpression(initializer)) return 'array';
	if (ts.isObjectLiteralExpression(initializer)) return 'object';
	return 'untyped';
}

/**
 * Kind of a union type node: `| undefined`/`| null` are ignored, all-literal unions are enums.
 * @param {ts.UnionTypeNode} typeNode
 * @param {ts.TypeChecker} checker
 * @returns {PropKind}
 */
function kindFromUnion(typeNode, checker) {
	const isNullish = (/** @type {ts.TypeNode} */ t) =>
		t.kind === ts.SyntaxKind.UndefinedKeyword ||
		(ts.isLiteralTypeNode(t) && t.literal.kind === ts.SyntaxKind.NullKeyword);
	const members = typeNode.types.filter((t) => !isNullish(t));
	if (members.length === 1) return classifyType(members[0], undefined, checker);
	return members.every((t) => ts.isLiteralTypeNode(t)) ? 'enum' : 'union';
}

/**
 * Kind of a type reference, resolved through the checker (enums and literal unions → `enum`).
 * @param {ts.TypeReferenceNode} typeNode
 * @param {ts.TypeChecker} checker
 * @returns {PropKind}
 */
function kindFromReference(typeNode, checker) {
	if (typeNode.typeName.getText() === 'Array') return 'array';
	const type = checker.getTypeAtLocation(typeNode);
	const isEnumLike = (type.flags & ts.TypeFlags.EnumLike) !== 0;
	const isLiteralUnion =
		type.isUnion() && type.types.every((t) => t.isLiteral() || (t.flags & ts.TypeFlags.EnumLiteral) !== 0);
	if (isEnumLike || isLiteralUnion) return 'enum';
	if (type.flags & ts.TypeFlags.Any) return 'any';
	if (type.flags & ts.TypeFlags.Unknown) return 'unknown';
	return 'object';
}

/**
 * @param {ts.TypeNode|undefined} typeNode
 * @param {ts.Expression|undefined} initializer
 * @param {ts.TypeChecker} checker
 * @returns {PropKind}
 */
function classifyType(typeNode, initializer, checker) {
	if (!typeNode) return kindFromInitializer(initializer);
	const keyword = KEYWORD_KINDS.get(typeNode.kind);
	if (keyword) return /** @type {PropKind} */ (keyword);
	if (ts.isUnionTypeNode(typeNode)) return kindFromUnion(typeNode, checker);
	if (ts.isTypeReferenceNode(typeNode)) return kindFromReference(typeNode, checker);
	return 'object';
}

/**
 * @typedef {object} ConfigProp
 * @property {string} name
 * @property {string} className
 * @property {string} file
 * @property {string|null} typeText
 * @property {PropKind} kind
 * @property {boolean} hasDoc
 * @property {string} docText       comment text preceding the declaration ('' when undocumented)
 * @property {string|null} validated  `boolean` | `string` | `number` | `inRange` | `date` | `time` | …
 * @property {string|null} defaultText
 * @property {string[]} allowed        source text of allowed values (validateInRange)
 * @property {string|null} allowedFrom `Object.values(X)` source when allowed values come from an enum
 */

/**
 * Validation info per property name, read from `validateDefault` switch cases.
 * @param {ts.ClassDeclaration} cls
 * @param {ts.SourceFile} sf
 * @returns {Map<string, { validated: string, defaultText: string|null, allowed: string[], allowedFrom: string|null }>}
 */
function readValidateDefault(cls, sf) {
	/** @type {Map<string, any>} */
	const out = new Map();
	const method = cls.members.find((m) => ts.isMethodDeclaration(m) && m.name.getText(sf) === 'validateDefault');
	if (!method || !ts.isMethodDeclaration(method) || !method.body) return out;
	walkNodes(method.body, (n) => {
		if (!ts.isSwitchStatement(n)) return;
		/** @type {string[]} */
		let pending = [];
		for (const clause of n.caseBlock.clauses) {
			if (ts.isCaseClause(clause)) {
				const text = clause.expression.getText(sf);
				const name = ts.isStringLiteral(clause.expression)
					? clause.expression.text
					: (text.split('.').pop() ?? text);
				pending.push(name);
			}
			if (clause.statements.length === 0) continue;
			/** @type {any} */
			let info = null;
			walkNodes(clause, (c) => {
				if (info || !ts.isCallExpression(c)) return;
				const m = c.expression.getText(sf).match(/^this\.validate([A-Z]\w*)$/);
				if (!m) return;
				const kind = m[1].charAt(0).toLowerCase() + m[1].slice(1);
				const args = c.arguments.map((a) => a.getText(sf));
				let allowed = args.slice(2);
				let allowedFrom = null;
				if (kind === 'inRange' && allowed.length === 1) {
					const only = c.arguments[2];
					if (ts.isArrayLiteralExpression(only)) allowed = only.elements.map((e) => e.getText(sf));
					else if (/Object\.values\(/.test(allowed[0])) {
						allowedFrom = allowed[0].replace(/^Object\.values\((.*)\)$/, '$1');
						allowed = [];
					}
				}
				info = { validated: kind, defaultText: args[1] ?? null, allowed, allowedFrom };
			});
			for (const name of pending)
				out.set(name, info ?? { validated: 'custom', defaultText: null, allowed: [], allowedFrom: null });
			pending = [];
		}
	});
	return out;
}

/**
 * Public configuration properties declared by the `*Config` classes in the given files.
 * The shared `ExtendedClass` prop and private/static members are excluded; props are
 * de-duplicated by name (first declaration wins, validation info merged).
 * @param {ts.Program} program
 * @param {string[]} configFiles
 * @returns {ConfigProp[]}
 */
export function getConfigProps(program, configFiles) {
	const checker = program.getTypeChecker();
	/** @type {Map<string, ConfigProp>} */
	const props = new Map();
	for (const file of configFiles) {
		const sf = getSourceFile(program, file);
		if (!sf) continue;
		walkNodes(sf, (n) => {
			if (!isPatternConfigClass(n)) return;
			const validation = readValidateDefault(n, sf);
			for (const prop of classConfigProps(n, sf, file, checker, validation)) mergeProp(props, prop);
			// validation cases for inherited props declared in another class of the chain
			for (const [name, v] of validation) {
				const existing = props.get(name);
				if (existing && !existing.validated) Object.assign(existing, v);
			}
		});
	}
	return [...props.values()];
}

/**
 * @param {ts.Node} n
 * @returns {n is ts.ClassDeclaration & { name: ts.Identifier }}
 */
function isPatternConfigClass(n) {
	if (!ts.isClassDeclaration(n) || !n.name) return false;
	return /Config(uration)?$/.test(n.name.text) && !/^Abstract(Provider)?Configuration$/.test(n.name.text);
}

/**
 * Comment text preceding a declaration, with comment syntax and JSDoc tags stripped.
 * @param {ts.SourceFile} sf
 * @param {ts.Node} node
 */
function leadingDocText(sf, node) {
	const comments = ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? [];
	const text = comments
		.map((c) => sf.text.slice(c.pos, c.end))
		.join('\n')
		.replace(/^\s*\/\*\*?|\*\/\s*$/g, '')
		.split('\n')
		.map((l) => l.replace(/^\s*(\*|\/\/)\s?/, '').trim())
		.filter((l) => l && !l.startsWith('@'))
		// an inline tag (`Whether it starts open. @defaultValue false`) is not part of the description
		.map((l) => {
			const tag = l.search(/\s@[A-Za-z]/);
			return tag >= 0 ? l.slice(0, tag) : l;
		})
		.join(' ')
		.trim();
	return { hasDoc: comments.length > 0, docText: text };
}

/**
 * Public, non-static, non-underscore configuration props of one class.
 * @param {ts.ClassDeclaration & { name: ts.Identifier }} cls
 * @param {ts.SourceFile} sf
 * @param {string} file
 * @param {ts.TypeChecker} checker
 * @param {ReturnType<typeof readValidateDefault>} validation
 * @returns {ConfigProp[]}
 */
function classConfigProps(cls, sf, file, checker, validation) {
	/** @type {ConfigProp[]} */
	const out = [];
	for (const m of cls.members) {
		if (!ts.isPropertyDeclaration(m)) continue;
		const flags = ts.getCombinedModifierFlags(m);
		if (flags & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected | ts.ModifierFlags.Static)) continue;
		const name = m.name.getText(sf);
		if (name === 'ExtendedClass' || name.startsWith('_')) continue;
		const v = validation.get(name);
		const { hasDoc, docText } = leadingDocText(sf, m);
		out.push({
			name,
			className: cls.name.text,
			file,
			typeText: m.type ? m.type.getText(sf) : null,
			kind: classifyType(m.type, m.initializer, checker),
			hasDoc,
			docText,
			validated: v?.validated ?? null,
			// the default the code applies (validateDefault, initializer), else the one the comment documents
			defaultText: v?.defaultText ?? (m.initializer ? m.initializer.getText(sf) : null) ?? documentedDefault(m),
			allowed: v?.allowed ?? [],
			allowedFrom: v?.allowedFrom ?? null,
		});
	}
	return out;
}

/**
 * First declaration wins; a later declaration only contributes validation info the first lacked.
 * @param {Map<string, ConfigProp>} props
 * @param {ConfigProp} prop
 */
function mergeProp(props, prop) {
	const existing = props.get(prop.name);
	if (!existing) {
		props.set(prop.name, prop);
		return;
	}
	if (!existing.validated && prop.validated) {
		existing.validated = prop.validated;
		existing.defaultText = prop.defaultText;
		existing.allowed = prop.allowed;
		existing.allowedFrom = prop.allowedFrom;
	}
}

/**
 * @typedef {object} EnumInfo
 * @property {string} name
 * @property {Record<string, string|number>} members
 */

/**
 * Enum declarations of a source file with their literal member values.
 * Members without a literal initializer get their own name as value.
 * @param {ts.SourceFile|undefined} sf
 * @returns {EnumInfo[]}
 */
export function getEnums(sf) {
	if (!sf) return [];
	/** @type {EnumInfo[]} */
	const out = [];
	walkNodes(sf, (n) => {
		if (!ts.isEnumDeclaration(n)) return;
		/** @type {Record<string, string|number>} */
		const members = {};
		for (const m of n.members) {
			const key = m.name.getText(sf);
			const init = m.initializer;
			if (!init) members[key] = key;
			else if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) members[key] = init.text;
			else if (ts.isNumericLiteral(init)) members[key] = Number(init.text);
			else members[key] = init.getText(sf);
		}
		out.push({ name: n.name.text, members });
	});
	return out;
}

/**
 * Explicit `any` type annotations in a source file.
 * @param {ts.SourceFile|undefined} sf
 */
export function countAnyKeywords(sf) {
	if (!sf) return 0;
	let count = 0;
	walkNodes(sf, (n) => {
		if (n.kind === ts.SyntaxKind.AnyKeyword) count++;
	});
	return count;
}

/**
 * `@ts-expect-error` / `@ts-ignore` directives in a source file.
 * @param {ts.SourceFile|undefined} sf
 */
export function countSuppressions(sf) {
	if (!sf) return 0;
	return (sf.text.match(/@ts-(expect-error|ignore)\b/g) ?? []).length;
}

/**
 * `noImplicitAny` findings (diagnostic codes 7000–7099) of a program compiled with that flag.
 * @param {ts.Program} program
 */
export function implicitAnyDiagnostics(program) {
	return ts
		.getPreEmitDiagnostics(program)
		.filter((d) => d.code >= 7000 && d.code < 7100)
		.map((d) => {
			const pos = d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start) : null;
			return {
				code: d.code,
				file: d.file?.fileName ?? null,
				line: pos ? pos.line + 1 : null,
				message: ts.flattenDiagnosticMessageText(d.messageText, ' '),
			};
		});
}

/**
 * Lines of code across the program's non-declaration source files.
 * @param {ts.Program} program
 */
export function countProgramLines(program) {
	let lines = 0;
	for (const sf of program.getSourceFiles()) {
		if (sf.isDeclarationFile) continue;
		lines += sf.getLineStarts().length;
	}
	return lines;
}

export { ts };
