// @ts-check
/**
 * R01 · Enterprise Component Coverage.
 *
 * The requirements list of "UI Enterprise apps requirements" (§2.1, §5), transcribed into
 * `requirements.json`, checked against the inventory and the sources. Requirements owned by other
 * OutSystems products (platform widgets, Data Grid, Charts, Maps) are reported as *delegated* and
 * excluded from the score, so the score measures what this repository offers, not its boundaries.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { walk } from '../../lib/inventory.mjs';
import { insideDir } from '../../lib/paths.mjs';
import { round1 } from '../../lib/score.mjs';
import { list, rowsOf } from '../../lib/present.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REQUIREMENTS_FILE = insideDir(path.resolve(here, '..'), 'requirements.json');

/**
 * @typedef {{ kind: 'pattern'|'css'|'story'|'scss-text'|'ts-text', match: string }} Evidence
 * @typedef {{ id: string, group: string, requirement: string, owner: string, status: 'auto'|'offered'|'partial'|'missing', reason?: string, evidence: Evidence[] }} Requirement
 * @typedef {{ groups: Record<string, number>, requirements: Requirement[], flows: { flow: string, elements: string[] }[] }} RequirementsMap
 */

/** @returns {RequirementsMap} */
export function loadRequirements(file = REQUIREMENTS_FILE) {
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Status values in points. */
const POINTS = { offered: 1, partial: 0.5, missing: 0 };

/**
 * Build the evidence lookups once per run.
 * @param {import('../../lib/context.mjs').EvalContext} ctx
 */
export function evidenceIndex(ctx) {
	const patterns = new Set(ctx.inventory.patterns.map((p) => p.name));
	const css = new Set(ctx.inventory.cssComponents.map((c) => c.name));
	const stories = new Set(ctx.inventory.storyFiles.map((f) => path.basename(f).replace('.stories.ts', '')));
	const scssFiles = walk(insideDir(ctx.root, 'src', 'scss')).filter(
		(f) => f.endsWith('.scss') && !f.includes(`${path.sep}provider${path.sep}`)
	);
	const tsFiles = walk(insideDir(ctx.root, 'src', 'scripts')).filter((f) => f.endsWith('.ts'));
	/** @type {Map<string, boolean>} */
	const textCache = new Map();
	/** @param {string[]} files @param {string} needle */
	const anyFileIncludes = (files, needle) => {
		const key = `${files.length}:${needle}`;
		let hit = textCache.get(key);
		if (hit === undefined) {
			hit = files.some((f) => ctx.readText(f).includes(needle));
			textCache.set(key, hit);
		}
		return hit;
	};
	return {
		/** @param {Evidence} e */
		matches(e) {
			switch (e.kind) {
				case 'pattern':
					return patterns.has(e.match);
				case 'css':
					return css.has(e.match);
				case 'story':
					return stories.has(e.match);
				case 'scss-text':
					return anyFileIncludes(scssFiles, e.match);
				case 'ts-text':
					return anyFileIncludes(tsFiles, e.match);
				default:
					return false;
			}
		},
	};
}

/**
 * Resolve one requirement to its status and the evidence that matched.
 * @param {Requirement} r
 * @param {{ matches(e: Evidence): boolean }} index
 * @returns {{ status: 'offered'|'partial'|'missing', matched: string[], unmatched: string[] }}
 */
export function resolveRequirement(r, index) {
	const matched = r.evidence.filter((e) => index.matches(e)).map((e) => `${e.kind}:${e.match}`);
	const unmatched = r.evidence.filter((e) => !index.matches(e)).map((e) => `${e.kind}:${e.match}`);
	if (r.status !== 'auto') return { status: r.status, matched, unmatched };
	if (r.evidence.length === 0) return { status: 'missing', matched, unmatched };
	if (unmatched.length === 0) return { status: 'offered', matched, unmatched };
	return { status: matched.length ? 'partial' : 'missing', matched, unmatched };
}

/**
 * Weighted coverage over the requirements this repository owns.
 * @param {{ group: string, owner: string, status: 'offered'|'partial'|'missing' }[]} rows
 * @param {Record<string, number>} groups group → weight
 */
export function scoreCoverage(rows, groups) {
	let weighted = 0;
	let weightSum = 0;
	for (const [group, weight] of Object.entries(groups)) {
		const own = rows.filter((r) => r.group === group && r.owner === 'osui');
		if (own.length === 0) continue;
		const points = own.reduce((s, r) => s + POINTS[r.status], 0);
		weighted += weight * (points / own.length);
		weightSum += weight;
	}
	return weightSum ? round1((100 * weighted) / weightSum) : 0;
}

/**
 * A flow of the document is "kit-complete" when every UI element it lists resolves to an offered (or
 * delegated) requirement.
 * @param {{ flow: string, elements: string[] }[]} flows
 * @param {{ id: string, name: string, status: string }[]} rows
 */
export function flowKits(flows, rows) {
	const byId = new Map(rows.map((r) => [r.id, r]));
	return flows.map((f) => {
		const elements = f.elements.map((id) => byId.get(id)).filter((r) => r !== undefined);
		const missing = elements.filter((r) => r.status === 'missing').map((r) => r.name);
		const partial = elements.filter((r) => r.status === 'partial').map((r) => r.name);
		let kit = 'complete';
		if (missing.length) kit = 'incomplete';
		else if (partial.length) kit = 'partial';
		return { flow: f.flow, kit, missing, partial };
	});
}

/** The tiers this eval measures (lib/kinds.mjs); utility classes still count as evidence for a requirement. */
const APPLIES_TO = ['pattern', 'component', 'layout'];

export default {
	id: 'R01',
	name: 'Enterprise Component Coverage',
	criterion: 'Enterprise requirements §2.1 components, §5 comparison',
	formula:
		'100 · Σ_group weight · mean(points) over requirements owned by OutSystems UI; offered = 1, partial = 0.5, missing = 0; requirements owned by the platform, Data Grid, Charts or Maps are reported as delegated and excluded',
	movable: false,
	cls: 'roadmap',
	rules: [{ kind: 'no-decrease', why: 'a removed component or feature is a regression whatever the index does' }],
	present: {
		scope: 'Per requirement of the enterprise UI document, not per component: offered, partial or missing, with delegated rows for other OutSystems products.',
		heatmap: false,
		appliesTo: APPLIES_TO,
		/** @param {any} m */
		advice(m) {
			const rows = rowsOf(m);
			const raw = m.raw ?? {};
			const missing = rows.filter((r) => !r.delegated && r.status === 'missing').map((r) => r.name);
			const partial = rows.filter((r) => !r.delegated && r.status === 'partial').map((r) => r.name);
			const flows = (raw.flows ?? [])
				.filter((/** @type {any} */ f) => f.kit !== 'complete')
				.map((/** @type {any} */ f) => `${f.flow} (${[...f.missing, ...f.partial].join(', ')})`);
			return [
				`Missing (${missing.length}): ${list(missing, 12)}.`,
				`Partial (${partial.length}): ${list(partial, 12)}.`,
				flows.length
					? `Flows not kit-complete: ${flows.join('; ')}.`
					: 'Every flow of the document is kit-complete.',
				'Each missing item is new work (roadmap), not a refactor; delegated rows (Table, Data Grid, Charts, Maps) are reported but not scored.',
			];
		},
		/** The requirement table and the flows, for the dashboard. @param {any} m */
		extra(m) {
			return {
				requirements: rowsOf(m).map((r) => ({
					id: r.id,
					name: r.name,
					group: r.group,
					owner: r.owner,
					status: r.status,
					reason: r.reason,
				})),
				flows: m.raw?.flows ?? [],
			};
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const map = loadRequirements();
		const index = evidenceIndex(ctx);
		const rows = map.requirements.map((r) => {
			const res = resolveRequirement(r, index);
			return {
				name: r.requirement,
				id: r.id,
				group: r.group,
				owner: r.owner,
				delegated: r.owner !== 'osui',
				status: res.status,
				reason: r.reason ?? null,
				matched: res.matched,
				unmatched: res.unmatched,
				score: r.owner === 'osui' ? 100 * POINTS[res.status] : null,
			};
		});
		const own = rows.filter((r) => !r.delegated);
		const count = (/** @type {string} */ s) => own.filter((r) => r.status === s).length;
		const flows = flowKits(map.flows, rows);
		const score = scoreCoverage(rows, map.groups);
		return {
			score,
			summary: `${count('offered')} offered, ${count('partial')} partial, ${count('missing')} missing of ${own.length} requirements owned here; ${rows.length - own.length} delegated; ${flows.filter((f) => f.kit === 'complete').length}/${flows.length} flows kit-complete`,
			raw: {
				owned: own.length,
				offered: count('offered'),
				partial: count('partial'),
				missing: count('missing'),
				delegated: rows.length - own.length,
				groups: map.groups,
				flows,
			},
			perComponent: rows,
			unmeasured: [],
		};
	},
};
