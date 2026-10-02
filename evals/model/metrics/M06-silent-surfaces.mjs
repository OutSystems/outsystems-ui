// @ts-check
/**
 * M06 · Silent-Failure Surfaces. Four things the platform ignores without an error when an agent gets them
 * wrong: a CSS class name, a --osui-* knob, an icon name, a static-entity value. Each must be published as a
 * machine-readable allowlist the Model bridge can validate against.
 */
import { insideDir } from '../../lib/paths.mjs';
import { round1 } from '../../lib/score.mjs';
import { manifestClasses, utilityFamilies } from '../../lib/utilities.mjs';
import { staticEntitiesReferenced } from '../lib/snapshot.mjs';

const ICON_PARTIALS = [
	'src/scss/01-foundations/_icon-library-o11.scss',
	'src/scss/01-foundations/_icon-library-odc.scss',
];
const ICON_LIBRARIES = [
	{ key: 'fontawesome4', needle: 'FontAwesome' },
	{ key: 'phosphor', needle: 'Phosphor' },
];

/** @param {string} ch */
const isNameChar = (ch) =>
	(ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === '-' || ch === '_';

/** Distinct `--osui-*` custom properties declared (followed by `:`) in a stylesheet. @param {string} css */
export function knobNamesOf(css) {
	/** @type {Set<string>} */
	const out = new Set();
	let from = 0;
	while ((from = css.indexOf('--osui-', from)) !== -1) {
		let end = from;
		while (end < css.length && isNameChar(css[end])) end++;
		if (css[end] === ':') out.add(css.slice(from, end));
		from = end;
	}
	return [...out].sort((a, b) => (a < b ? -1 : Number(a > b)));
}

/**
 * Whether the tokens document names the knob as a whole word (`--osui-card-padding-inline` does not document
 * `--osui-card-padding`).
 * @param {string} doc
 * @param {string} knob
 */
export function knobDocumented(doc, knob) {
	let from = 0;
	while ((from = doc.indexOf(knob, from)) !== -1) {
		const next = doc[from + knob.length];
		if (next === undefined || !isNameChar(next)) return true;
		from += knob.length;
	}
	return false;
}

/** @param {import('../../lib/context.mjs').EvalContext} ctx */
function declaredIconLibraries(ctx) {
	const text = ICON_PARTIALS.map((f) => ctx.readText(insideDir(ctx.root, ...f.split('/')))).join('\n');
	return ICON_LIBRARIES.filter((l) => text.includes(l.needle)).map((l) => l.key);
}

/** @param {Record<string, { documented: number, total: number }>} surfaces */
export function scoreSurfaces(surfaces) {
	/** @type {Record<string, number>} */
	const parts = {};
	for (const [k, s] of Object.entries(surfaces))
		parts[k] = s.total === 0 ? 25 : round1((25 * s.documented) / s.total);
	return { score: round1(Object.values(parts).reduce((a, b) => a + b, 0)), parts };
}

/** @param {string|null} text @param {(parsed: any) => string[]} pick */
function keysWithContent(text, pick) {
	if (!text) return new Set();
	try {
		return new Set(pick(JSON.parse(text)));
	} catch {
		return new Set();
	}
}

export default {
	id: 'M06',
	name: 'Silent-Failure Surfaces',
	criterion: 'Validation inputs the Model bridge needs for what the platform ignores silently',
	formula:
		'25·(utility classes with declarations in osui.utilities.json / classes) + 25·(--osui-* knobs named in llms-tokens.txt / knobs declared in compiled component CSS) + 25·(icon libraries documented in osui.icons.json / libraries the icon partials declare) + 25·(static entities in osui.enums.json / static entities block parameters reference)',
	movable: true,
	present: {
		scope: 'Whole repository, not per component: the four allowlists an agent needs because a wrong class, knob, icon or enum value renders as nothing without an error.',
		heatmap: false,
		appliesTo: ['pattern', 'component', 'layout'],
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			return Object.entries(raw.surfaces ?? {}).map(
				([k, s]) =>
					`${k}: ${/** @type {any} */ (s).documented}/${/** @type {any} */ (s).total} documented (${raw.parts?.[k]}/25).`
			);
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const families = utilityFamilies(ctx).filter((f) => !f.error);
		const classes = families.flatMap((f) => f.classes.map((c) => c.name));
		const inManifest = manifestClasses(ctx.docsAi('osui.utilities.json'));
		const tokensDoc = ctx.docsAi('llms-tokens.txt') ?? '';
		/** @type {Set<string>} */
		const knobs = new Set();
		const scssFiles = [
			...ctx.inventory.patterns.flatMap((p) => p.scssFiles),
			...ctx.inventory.cssComponents.map((c) => c.scssFile),
		];
		for (const f of scssFiles) for (const k of knobNamesOf(ctx.compiledCss(f).css ?? '')) knobs.add(k);
		const libraries = declaredIconLibraries(ctx);
		const iconsDocumented = keysWithContent(ctx.docsAi('osui.icons.json'), (p) =>
			Object.entries(p)
				.filter(([, v]) => /** @type {any} */ (v.classes ?? []).length > 0)
				.map(([k]) => k)
		);
		const entities = staticEntitiesReferenced(ctx.modelSnapshots());
		const enumsDocumented = keysWithContent(ctx.docsAi('osui.enums.json'), (p) =>
			Object.entries(p)
				.filter(([, v]) => /** @type {any} */ (v.values ?? []).length > 0)
				.map(([k]) => k)
		);
		const surfaces = {
			utilities: { documented: classes.filter((c) => inManifest.has(c)).length, total: classes.length },
			knobs: { documented: [...knobs].filter((k) => knobDocumented(tokensDoc, k)).length, total: knobs.size },
			icons: { documented: libraries.filter((l) => iconsDocumented.has(l)).length, total: libraries.length },
			enums: { documented: [...entities].filter((e) => enumsDocumented.has(e)).length, total: entities.size },
		};
		const { score, parts } = scoreSurfaces(surfaces);
		return {
			score,
			summary: Object.entries(surfaces)
				.map(([k, s]) => `${k} ${s.documented}/${s.total}`)
				.join(', '),
			raw: { surfaces, parts },
			perComponent: [],
			unmeasured: [],
			notApplicable: [],
		};
	},
};
