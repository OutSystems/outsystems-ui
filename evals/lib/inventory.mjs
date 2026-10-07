// @ts-check
/**
 * Component inventory for the AI-friendliness evals.
 *
 * A *pattern* is a public UI component with its own `OutSystems/OSUI/Patterns/<Name>API.ts`
 * entry point. Its contract surface spans the framework directory
 * (`OSFramework/OSUI/Pattern/<Name>/`), any provider wrapper directory
 * (`Providers/OSUI/<name>/`, matched case-insensitively), the SCSS partial registered in
 * `gulp/ProjectSpecs/Patterns/<Name>.js`, and the Storybook story that renders it.
 *
 * A *CSS component* is a SCSS partial with no TypeScript behaviour behind it: a CSS-only component
 * (Card, Badge, Tag, the widget styles), a host-styled layout partial, a helper class or a utility
 * family under `05-useful`. Its directory gives it a default kind; the registry may override it
 * (lib/kinds.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';

import { insideDir } from './paths.mjs';
import { registry, kindOf } from './registry.mjs';
import { defaultKindFor } from './kinds.mjs';

/**
 * @typedef {object} Pattern
 * @property {string} name
 * @property {string} apiFile
 * @property {string|null} patternDir
 * @property {string[]} providerDirs
 * @property {string[]} classFiles
 * @property {string[]} configFiles
 * @property {string[]} enumFiles
 * @property {string[]} interfaceFiles
 * @property {string[]} factoryFiles
 * @property {string[]} typingFiles  `.d.ts` files shipped with a provider wrapper
 * @property {string[]} contractFiles api + class + config + enum + interface + factory
 * @property {string|null} scssFile   primary SCSS partial (first registered)
 * @property {string[]} scssFiles     every SCSS partial registered for the pattern
 * @property {string|null} storyFile
 */

/**
 * @typedef {object} CssComponent
 * @property {string} name
 * @property {string} scssFile
 * @property {string|null} storyFile
 * @property {{ host: string, reason: string }|null} host set when the component styles markup owned by
 *   something else (app template blocks, common screens, the runtime); such a component has no markup
 *   contract of its own
 * @property {import('./kinds.mjs').Kind} defaultKind default kind from the directory
 * @property {import('./kinds.mjs').Kind} kind   kind after the registry override (what the evals use)
 * @property {'layout'|'widgets'|'patterns'|'useful'} source top-level directory the partial lives in
 */

/** The component registry: hosts of host-styled partials and story aliases are read from it. */
const REG = registry();

/**
 * @typedef {object} Inventory
 * @property {string} root
 * @property {Pattern[]} patterns
 * @property {CssComponent[]} cssComponents
 * @property {string[]} storyFiles
 */

const SRC = ['src', 'scripts'];
const API_DIR = [...SRC, 'OutSystems', 'OSUI', 'Patterns'];
const PATTERN_DIR = [...SRC, 'OSFramework', 'OSUI', 'Pattern'];
const PROVIDER_DIR = [...SRC, 'Providers', 'OSUI'];
const SPEC_DIR = ['gulp', 'ProjectSpecs', 'Patterns'];
/** @type {[string[], 'layout'|'widgets'|'patterns'|'useful'][]} */
const CSS_COMPONENT_DIRS = [
	[['src', 'scss', '02-layout'], 'layout'],
	[['src', 'scss', '03-widgets'], 'widgets'],
	[['src', 'scss', '04-patterns'], 'patterns'],
	[['src', 'scss', '05-useful'], 'useful'],
];

/** Vendor baselines, Service Studio preview images and provider overrides are not components. */
const CSS_EXCLUDE = /(_lib\.scss$|_ss_preview|[\\/]provider[\\/])/i;

/**
 * Recursively list files under `dir` (sorted, absolute paths). Returns [] for a missing dir.
 * @param {string} dir
 * @returns {string[]}
 */
export function walk(dir) {
	if (!fs.existsSync(dir)) return [];
	/** @type {string[]} */
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
		const full = insideDir(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
}

/**
 * Classify a TypeScript source file of a pattern or provider directory.
 * @param {string} file
 * @returns {'config'|'enum'|'interface'|'factory'|'typing'|'class'|'ignore'}
 */
function classifyTsFile(file) {
	const base = path.basename(file);
	if (!base.endsWith('.ts')) return 'ignore';
	if (base.endsWith('.d.ts')) return 'typing';
	if (base.endsWith('Config.ts')) return 'config';
	if (base.endsWith('Enum.ts')) return 'enum';
	if (base.endsWith('Factory.ts')) return 'factory';
	if (/^I[A-Z][A-Za-z0-9]*\.ts$/.test(base)) return 'interface';
	return 'class';
}

/**
 * Read every `scss` entry (top-level and nested sub-patterns) from a gulp pattern spec.
 * Paths in the spec are relative to `src/scripts` and omit the `_` prefix and extension.
 * @param {string} root
 * @param {string} name
 * @returns {string[]}
 */
function readSpecScss(root, name) {
	const specFile = insideDir(root, ...SPEC_DIR, `${name}.js`);
	if (!fs.existsSync(specFile)) return [];
	// The spec is a CommonJS module, but it is read as text rather than executed: every `"scss": "…"`
	// entry (top-level and nested sub-patterns) is collected, so no repository file is ever `require`d.
	const text = fs.readFileSync(specFile, 'utf8');
	/** @type {string[]} */
	const values = [];
	for (const m of text.matchAll(/"scss"\s*:\s*"([^"]*)"/g)) values.push(m[1]);
	return values
		.filter(Boolean)
		.map((rel) => resolveScssPartial(path.join(root, 'src'), path.join(root, ...SRC), rel))
		.filter(/** @returns {f is string} */ (f) => f !== null);
}

/**
 * `../scss/04-patterns/02-content/accordion/accordion` → `<root>/src/scss/.../_accordion.scss`.
 * The spec-relative path must stay inside `src/`.
 * @param {string} srcDir `<root>/src`, the directory the result is confined to
 * @param {string} baseDir `<root>/src/scripts`, which spec paths are relative to
 * @param {string} rel
 * @returns {string|null}
 */
function resolveScssPartial(srcDir, baseDir, rel) {
	const abs = insideDir(srcDir, path.resolve(baseDir, rel));
	const dir = path.dirname(abs);
	const base = path.basename(abs);
	for (const candidate of [path.join(dir, `_${base}.scss`), path.join(dir, `${base}.scss`)]) {
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}

/** @param {string} s */
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Exact (case-insensitive) story match, else the longest story name that prefixes the
 * component name (AccordionItem → Accordion). Names are normalised to lower-case alnum.
 * @param {string} name
 * @param {Map<string,string>} storiesByNorm normalised story name → file
 * @returns {string|null}
 */
export function matchStory(name, storiesByNorm) {
	const n = norm(name);
	if (storiesByNorm.has(n)) return /** @type {string} */ (storiesByNorm.get(n));
	// a component whose story is filed under the platform widget's name (btn → Button, radio-button → RadioGroup)
	const alias = REG.components[name]?.story;
	if (alias && storiesByNorm.has(alias)) return /** @type {string} */ (storiesByNorm.get(alias));
	let best = null;
	let bestLen = 3; // require at least 4 characters of overlap
	for (const [storyNorm, file] of storiesByNorm) {
		if (n.startsWith(storyNorm) && storyNorm.length > bestLen) {
			best = file;
			bestLen = storyNorm.length;
		}
	}
	return best;
}

/**
 * Build the inventory for a repository root.
 * @param {string} root
 * @returns {Inventory}
 */
export function buildInventory(root) {
	const apiDir = insideDir(root, ...API_DIR);
	const apiFiles = fs
		.readdirSync(apiDir)
		.filter((f) => f.endsWith('API.ts'))
		.sort((a, b) => a.localeCompare(b));

	const storyFiles = walk(path.join(root, 'stories')).filter((f) => f.endsWith('.stories.ts'));
	const storiesByNorm = new Map(storyFiles.map((f) => [norm(path.basename(f).replace(/\.stories\.ts$/, '')), f]));
	const providerDir = insideDir(root, ...PROVIDER_DIR);
	const providerRoots = fs.existsSync(providerDir)
		? fs
				.readdirSync(providerDir, { withFileTypes: true })
				.filter((d) => d.isDirectory())
				.map((d) => insideDir(providerDir, d.name))
		: [];

	/** @type {Pattern[]} */
	const patterns = apiFiles.map((apiBase) => {
		const name = apiBase.replace(/API\.ts$/, '');
		const patternDirCandidate = insideDir(root, ...PATTERN_DIR, name);
		const patternDir = fs.existsSync(patternDirCandidate) ? patternDirCandidate : null;
		const providerDirs = providerRoots.filter((d) => path.basename(d).toLowerCase() === name.toLowerCase());

		const buckets = { class: [], config: [], enum: [], interface: [], factory: [], typing: [] };
		for (const dir of [patternDir, ...providerDirs].filter(Boolean)) {
			for (const file of walk(/** @type {string} */ (dir))) {
				const kind = classifyTsFile(file);
				if (kind !== 'ignore') buckets[kind].push(file);
			}
		}

		const scssFiles = readSpecScss(root, name);
		const apiFile = insideDir(apiDir, apiBase);
		return {
			name,
			apiFile,
			patternDir,
			providerDirs,
			classFiles: buckets.class,
			configFiles: buckets.config,
			enumFiles: buckets.enum,
			interfaceFiles: buckets.interface,
			factoryFiles: buckets.factory,
			typingFiles: buckets.typing,
			contractFiles: [
				apiFile,
				...buckets.class,
				...buckets.config,
				...buckets.enum,
				...buckets.interface,
				...buckets.factory,
			],
			scssFile: scssFiles[0] ?? null,
			scssFiles,
			storyFile: matchStory(name, storiesByNorm),
		};
	});

	const claimedScss = new Set(patterns.flatMap((p) => p.scssFiles));
	/** @type {CssComponent[]} */
	const partials = CSS_COMPONENT_DIRS.flatMap(([segments, source]) =>
		walk(insideDir(root, ...segments)).map((scssFile) => ({ scssFile, source }))
	)
		.filter(({ scssFile: f }) => f.endsWith('.scss') && !CSS_EXCLUDE.test(f) && !claimedScss.has(f))
		.map(({ scssFile, source }) => ({
			scssFile,
			source,
			base: path
				.basename(scssFile)
				.replace(/^_/, '')
				.replace(/\.scss$/, ''),
		}));
	// two partials may share a file name (`_section.scss` under 02-layout and 04-patterns): the one
	// outside 04-patterns takes its directory group as prefix so every component has one name
	const baseCount = new Map();
	for (const p of partials) baseCount.set(p.base, (baseCount.get(p.base) ?? 0) + 1);
	/** @type {CssComponent[]} */
	const cssComponents = partials
		.map(({ scssFile, source, base }) => {
			const name = (baseCount.get(base) ?? 0) > 1 && source !== 'patterns' ? `${source}-${base}` : base;
			const defaultKind = defaultKindFor(scssFile);
			const registryKind = kindOf(REG, name, defaultKind);
			return {
				name,
				scssFile,
				// a utility family has classes, not an anatomy: no story is looked up for it
				storyFile: source === 'useful' ? null : matchStory(name, storiesByNorm),
				host: REG.components[name]?.host ?? null,
				defaultKind,
				kind: registryKind === 'pattern' ? defaultKind : registryKind,
				source,
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));

	return { root, patterns, cssComponents, storyFiles };
}
