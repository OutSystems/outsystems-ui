/**
 * Generates PatternDocPage scaffolding (MDX + data + recipes) for catalogue
 * entries that do not yet have a --docs story id.
 *
 * Usage: node scripts/generate-pattern-docs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const storiesDir = path.join(repoRoot, 'stories');
const dataDir = path.join(storiesDir, '_helpers/pattern-docs');
const cataloguePath = path.join(storiesDir, '_helpers/PatternCatalogue.tsx');

const catalogueSource = fs.readFileSync(cataloguePath, 'utf8');
const catalogueEntries = [...catalogueSource.matchAll(
	/\{\s*name:\s*'([^']+)',\s*category:\s*'([^']+)',\s*blurb:\s*'([^']+)',\s*id:\s*'([^']+)'(?:,\s*liveId:\s*'([^']+)')?/g
)].map(([, name, category, blurb, id, liveId]) => ({ name, category, blurb, id, liveId }));

const missing = catalogueEntries.filter((e) => !e.id.endsWith('--docs'));

const manifestSource = fs.readFileSync(path.join(storiesDir, '_helpers/css-api-manifest.ts'), 'utf8');
const cssSlugByStoryId = new Map(
	[...manifestSource.matchAll(/slug:\s*'([^']+)',\s*storyId:\s*'([^']+)'/g)].map(([, slug, storyId]) => [storyId, slug])
);

function toFileBase(name) {
	return name
		.replace(/\s+/g, '')
		.replace(/([a-z])([A-Z])/g, '$1$2');
}

function toKebab(name) {
	return name
		.replace(/\s+/g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function toConstPrefix(kebab) {
	return kebab.replace(/-/g, '_').toUpperCase();
}

function toWidgetName(name) {
	if (name.includes(' ')) return name;
	return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function toDisplayName(exportName) {
	return exportName
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

function storyFileFor(name) {
	const base = toFileBase(name);
	const candidate = path.join(storiesDir, `${base}.stories.ts`);
	if (fs.existsSync(candidate)) return candidate;
	throw new Error(`Missing story file for ${name}: ${candidate}`);
}

function parseStoryExports(filePath) {
	const source = fs.readFileSync(filePath, 'utf8');
	const exports = [];
	for (const match of source.matchAll(/export const (\w+):\s*Story(?:Obj)?(?:<[^>]*>)?\s*=\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs)) {
		const exportName = match[1];
		const body = match[2];
		const nameMatch = body.match(/name:\s*'([^']+)'/);
		exports.push({ exportName, title: nameMatch?.[1] ?? toDisplayName(exportName) });
	}
	return exports;
}

function guessSelector(storySource, kebab) {
	const rootClass = storySource.match(/\.(osui-[\w-]+|(?:action-sheet|bottom-bar|badge|counter|wizard)[\w-]*)/);
	if (rootClass) return `.${rootClass[1].split(/[\s,{]/)[0].replace(/^\./, '')}`;
	return `.${kebab}`;
}

function parseArgTypes(storySource) {
	const rows = [];
	const argTypesBlock = storySource.match(/argTypes:\s*\{([\s\S]*?)\n\t\},/);
	if (!argTypesBlock) return rows;

	for (const match of argTypesBlock[1].matchAll(/(\w+):\s*\{[^}]*name:\s*'([^']+)'[^}]*description:\s*'([^']*)'/g)) {
		rows.push({ name: match[2], type: 'Text', description: match[3] || `Maps to the ${match[2]} input parameter.` });
	}
	for (const match of argTypesBlock[1].matchAll(/(\w+):\s*\{[^}]*name:\s*'([^']+)'/g)) {
		if (!rows.some((r) => r.name === match[2])) {
			rows.push({ name: match[2], type: 'Text', description: `Maps to the ${match[2]} input parameter.` });
		}
	}
	if (!rows.some((r) => r.name === 'ExtendedClass')) {
		rows.push({ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' });
	}
	return rows.slice(0, 12);
}

function relatedPatterns(entry, all) {
	const same = all.filter((p) => p.category === entry.category && p.name !== entry.name);
	const picks = [same[0], same[1], all.find((p) => p.category !== entry.category)].filter(Boolean);
	return picks.map((p) => ({
		name: p.name,
		storyId: p.id.endsWith('--docs') ? p.id : p.liveId ?? p.id,
	}));
}

function generateData(entry, storySource, kebab, liveStoryId, cssApiSlug, selector) {
	const constName = `${toConstPrefix(kebab)}_DOC`;
	const displayName = toWidgetName(entry.name);
	const properties = parseArgTypes(storySource);
	const related = relatedPatterns(entry, catalogueEntries);

	return `import type { PatternDocMeta } from './types';

export const ${constName}: PatternDocMeta = {
	name: '${displayName}',
	category: '${entry.category}',
	lede: '${entry.blurb.replace(/'/g, "\\'")}',
	overview:
		'Use ${displayName} when you need ${entry.blurb.replace(/'/g, "\\'").toLowerCase().replace(/\.$/, '')} in your application UI.',
	stylingSelector: '${selector}',
	liveStoryId: '${liveStoryId}',
${cssApiSlug ? `\tcssApiSlug: '${cssApiSlug}',` : ''}
	whenToUse: [
		'When ${entry.blurb.replace(/'/g, "\\'").toLowerCase().replace(/\.$/, '')}.',
		'Inside ${entry.category.toLowerCase()} layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: \`<div class="${selector.replace(/^\./, '')}">
  <!-- Content placeholder -->
</div>\`,
	},
	properties: [
		{
			title: '${displayName}',
			rows: [
${properties.map((r) => `\t\t\t\t{ name: '${r.name}', type: '${r.type}', description: '${r.description.replace(/'/g, "\\'")}' },`).join('\n')}
			],
		},
	],
	accessibility: [
		'Ensure keyboard users can reach and operate interactive elements inside the pattern.',
		'Provide meaningful labels for icons-only controls.',
		'Use the Storybook A11y toolbar to check contrast and focus order on the live demo.',
	],
	related: [
${related.map((r) => `\t\t{ name: '${r.name}', storyId: '${r.storyId}' },`).join('\n')}
	],
};
`;
}

function generateRecipes(entry, exports) {
	const kebab = toKebab(entry.name);
	const constName = `${toConstPrefix(kebab)}_RECIPES`;
	const widgetName = toWidgetName(entry.name);
	const primary = exports[0];

	return `import type { StudioRecipe } from '../studio-recipe';

export const ${constName} = {
	basicUsage: {
		kind: 'widget',
		widgetName: '${widgetName}',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the ${widgetName} block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
`;
}

function generateMdx(entry, exports) {
	const fileBase = toFileBase(entry.name);
	const kebab = toKebab(entry.name);
	const constDoc = `${toConstPrefix(kebab)}_DOC`;
	const constRecipes = `${toConstPrefix(kebab)}_RECIPES`;

	const examples = exports
		.map(
			(s) => `\t\t\t<PdExample title="${s.title}" description="Live example of ${toWidgetName(entry.name)}." implement={<StudioHowTo recipe={${constRecipes}.basicUsage} />}>
\t\t\t\t<Canvas of={${fileBase}Stories.${s.exportName}} />
\t\t\t</PdExample>`
		)
		.join('\n');

	return `import { Canvas, Meta } from '@storybook/addon-docs/blocks';
import * as ${fileBase}Stories from './${fileBase}.stories';
import { ${constRecipes} } from './_helpers/pattern-docs/${kebab}-recipes';
import { ${constDoc} } from './_helpers/pattern-docs/${kebab}-data';
import { PatternDocPage } from './_helpers/pattern-docs/PatternDocPage';
import { PdExample } from './_helpers/pattern-docs/PatternDocShell';
import { StudioHowTo } from './_helpers/pattern-docs/StudioHowTo';

<Meta of={${fileBase}Stories} tags={['!ui-pending']} parameters={{ layout: 'fullscreen', options: { showPanel: true }, docs: { source: { disable: true }, canvas: { sourceState: 'none' } } }} />

<PatternDocPage
	meta={${constDoc}}
	examples={
		<>
${examples}
		</>
	}
/>
`;
}

function updateCatalogue() {
	let source = fs.readFileSync(cataloguePath, 'utf8');
	for (const entry of missing) {
		const fileBase = toFileBase(entry.name);
		const kebab = toKebab(entry.name);
		const docsId = entry.id.replace(/--[^-]+$/, '--docs');
		const oldId = entry.id;
		const pattern = new RegExp(
			`\\{\\s*name:\\s*'${entry.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*category:\\s*'${entry.category}',\\s*blurb:\\s*'${entry.blurb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*id:\\s*'${oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'(?:,\\s*liveId:\\s*'[^']*')?\\s*\\}`
		);
		const replacement = `{ name: '${entry.name}', category: '${entry.category}', blurb: '${entry.blurb}', id: '${docsId}', liveId: '${entry.liveId ?? oldId}' }`;
		source = source.replace(pattern, replacement);
	}
	fs.writeFileSync(cataloguePath, source);
}

const generated = [];

for (const entry of missing) {
	const fileBase = toFileBase(entry.name);
	const kebab = toKebab(entry.name);
	const storyPath = storyFileFor(entry.name);
	const storySource = fs.readFileSync(storyPath, 'utf8');
	const exports = parseStoryExports(storyPath);
	if (!exports.length) {
		console.warn(`Skip ${entry.name}: no story exports found`);
		continue;
	}

	const liveStoryId = entry.liveId ?? entry.id;
	const cssApiSlug = cssSlugByStoryId.get(liveStoryId) ?? cssSlugByStoryId.get(entry.id);
	const selector = guessSelector(storySource, kebab);

	const dataPath = path.join(dataDir, `${kebab}-data.ts`);
	const recipesPath = path.join(dataDir, `${kebab}-recipes.ts`);
	const mdxPath = path.join(storiesDir, `${fileBase}.mdx`);

	fs.writeFileSync(dataPath, generateData(entry, storySource, kebab, liveStoryId, cssApiSlug, selector));
	fs.writeFileSync(recipesPath, generateRecipes(entry, exports));
	fs.writeFileSync(mdxPath, generateMdx(entry, exports));
	generated.push(entry.name);
}

updateCatalogue();

console.log(`Generated docs for ${generated.length} patterns:`);
for (const name of generated) console.log(`  - ${name}`);
