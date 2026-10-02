// @ts-check
/**
 * M02 · Pattern–Block Crosswalk: is each runtime pattern linked to the OML block(s) that drive it, with its
 * parameters and events mapped to the runtime contract?
 */
import { list, toDoHint } from '../../lib/present.mjs';
import { registry } from '../../lib/registry.mjs';
import { mean, round1 } from '../../lib/score.mjs';
import { linksFor } from '../lib/crosswalk.mjs';
import { flattenBlocks } from '../lib/snapshot.mjs';

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/** @param {{ linked: boolean, params: number, mapped: number, events: number, eventsMapped: number }} r */
export function scoreCrosswalk({ linked, params, mapped, events, eventsMapped }) {
	if (!linked) return 0;
	const p = params === 0 ? 1 : mapped / params;
	const e = events === 0 ? 1 : eventsMapped / events;
	return round1(50 + 30 * p + 20 * e);
}

/**
 * One pattern's coverage over its linked blocks.
 * @param {import('../lib/crosswalk.mjs').Link[]} links
 * @param {Map<string, import('../lib/snapshot.mjs').BlockRow>} byKey
 */
export function coverageOf(links, byKey) {
	/** @type {string[]} */
	const missing = [];
	/** @type {string[]} */
	const unmappedEvents = [];
	const r = { params: 0, mapped: 0, events: 0, eventsMapped: 0, missing, unmappedEvents };
	for (const l of links) {
		const b = byKey.get(l.key);
		if (!b) continue;
		const covered = new Set([...Object.keys(l.paramMap).map((k) => k.split('.')[0]), ...l.platformOnly]);
		for (const param of b.inputParameters) {
			r.params++;
			if (covered.has(param.name)) r.mapped++;
			else missing.push(`${l.name}.${param.name}`);
		}
		for (const e of b.events) {
			r.events++;
			if (l.eventMap[e.name]) r.eventsMapped++;
			else unmappedEvents.push(`${l.name}.${e.name}`);
		}
	}
	return r;
}

export default {
	id: 'M02',
	name: 'Pattern–Block Crosswalk',
	criterion: 'Composition fidelity between the runtime pattern and its OML block',
	formula:
		'per pattern: 50·(linked to ≥ 1 block via evals/components.json or the snapshot hints) + 30·(block params covered by paramMap or platformOnly) + 20·(block events covered by eventMap); patterns no block hints at are not applicable',
	movable: true,
	present: {
		scope: "Per pattern: whether the registry (or the snapshot) links it to its OML block, and how many of that block's parameters and events are mapped to the runtime contract.",
		heatmap: true,
		appliesTo: ['pattern'],
		unmeasuredHint: 'Export a block snapshot into evals/model (see evals/model/README.md).',
		/** @param {any} row */
		cell(row) {
			const todo = [];
			if (!row.linked)
				todo.push('add a block entry to evals/components.json (npm run evals:doctor proposes one)');
			if (row.missing?.length) todo.push(`map or mark platform-only: ${list(row.missing, 5)}`);
			if (row.unmappedEvents?.length) todo.push(`map events: ${list(row.unmappedEvents, 4)}`);
			const head = row.linked ? `Linked to ${list(row.blocks ?? [], 3)} (${row.source}).` : 'No block linked.';
			return { s: row.score, h: `${head}${toDoHint(todo)}` };
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			return [
				`${raw.linked}/${raw.patterns} patterns linked (${raw.fromRegistry} confirmed, ${raw.fromHints} from hints); ${raw.mapped}/${raw.params} block parameters mapped.`,
				'Confirm derived links and fill paramMap in evals/components.json; the registry test resolves every entry against the snapshot.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const snapshots = ctx.modelSnapshots();
		const blocks = flattenBlocks(snapshots);
		const byKey = new Map(blocks.map((b) => [b.key, b]));
		const reg = registry();
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string, hint?: string }[]} */
		const notApplicable = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		const totals = { linked: 0, fromRegistry: 0, fromHints: 0, params: 0, mapped: 0 };
		for (const p of ctx.inventory.patterns) {
			if (snapshots.length === 0) {
				unmeasured.push({ name: p.name, reason: 'no block snapshot' });
				continue;
			}
			const links = linksFor(p.name, reg, blocks);
			if (links.length === 0) {
				notApplicable.push({
					name: p.name,
					reason: 'no OML block drives this pattern',
					hint: 'Item and no-DOM patterns are driven by their parent block.',
				});
				continue;
			}
			const c = coverageOf(links, byKey);
			const source = links[0].source;
			totals.linked++;
			if (source === 'registry') totals.fromRegistry++;
			else totals.fromHints++;
			totals.params += c.params;
			totals.mapped += c.mapped;
			perComponent.push({
				name: p.name,
				linked: true,
				source,
				blocks: links.map((l) => l.key),
				...c,
				score: scoreCrosswalk({
					linked: true,
					params: c.params,
					mapped: c.mapped,
					events: c.events,
					eventsMapped: c.eventsMapped,
				}),
			});
		}
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary: `${totals.linked}/${ctx.inventory.patterns.length} patterns linked (${totals.fromRegistry} confirmed, ${totals.fromHints} hinted); ${totals.mapped}/${totals.params} block params mapped`,
			raw: { ...totals, patterns: ctx.inventory.patterns.length },
			perComponent: perComponent.sort((a, b) => a.score - b.score || byCodePoint(a.name, b.name)),
			unmeasured,
			notApplicable,
		};
	},
};
