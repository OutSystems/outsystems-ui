// @ts-check
/**
 * M03 · Block Parameter Precision. Can an agent fill a block's parameters without guessing? Described
 * parameters and types that are not free Text or Object (`ExtendedClass` is Text on purpose). Every optional
 * parameter has a default: the OML's, else the platform's for its data type (lib/defaults.mjs), so defaults are
 * reported, not scored. Moves with the OML (descriptions, static-entity types), so the per-block table names
 * what to change there.
 */
import { list } from '../../lib/present.mjs';
import { mean, round1 } from '../../lib/score.mjs';
import { blockTable } from '../lib/manifest.mjs';
import { withPlatformDefault } from '../lib/defaults.mjs';
import { flattenBlocks, isComposable, isFreeText, NO_SNAPSHOT, notComposableReason } from '../lib/snapshot.mjs';

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));
/** Lowest score first, then by label; sorts in place and returns the same array. @template {{ score: number, label: string }} T @param {T[]} rows */
function sortedByScore(rows) {
	rows.sort((a, b) => a.score - b.score || byCodePoint(a.label, b.label));
	return rows;
}

/** @param {{ params: number, described: number, precise: number }} r */
export function scorePrecision({ params, described, precise }) {
	if (params === 0) return 0;
	return round1(60 * (described / params) + 40 * (precise / params));
}

/** @param {{ inputParameters: import('../lib/snapshot.mjs').Param[] }} block */
export function measureBlock(block) {
	const ps = block.inputParameters.map((p) => withPlatformDefault(p));
	const optional = ps.filter((p) => !p.mandatory);
	return {
		params: ps.length,
		described: ps.filter((p) => p.description.trim().length > 0).length,
		optional: optional.length,
		defaulted: optional.filter((p) => p.default !== null).length,
		platformDefaulted: optional.filter((p) => p.defaultSource === 'platform').map((p) => p.name),
		precise: ps.filter((p) => !isFreeText(p)).length,
		freeText: ps.filter((p) => isFreeText(p)).map((p) => p.name),
		undescribed: ps.filter((p) => p.description.trim().length === 0).map((p) => p.name),
	};
}

/** How many parameters fall short, by kind of gap, or "nothing". @param {any} row */
export function missingOf(row) {
	const parts = [];
	if (row.undescribed.length) parts.push(`${row.undescribed.length} undescribed`);
	if (row.freeText.length) parts.push(`${row.freeText.length} free Text`);
	return parts.length ? parts.join(', ') : 'nothing';
}

/** The OML edits, naming the parameters. @param {any} row */
export function doOf(row) {
	const todo = [];
	if (row.undescribed.length) todo.push(`describe ${list(row.undescribed, 4)}`);
	if (row.freeText.length) todo.push(`type ${list(row.freeText, 4)} as a static entity, structure or number`);
	return todo.length ? `In the OML: ${todo.join('; ')}` : '';
}

/** The heatmap cell text of one block. @param {any} row */
function cellText(row) {
	const missing = missingOf(row);
	const todo = doOf(row);
	return [missing === 'nothing' ? 'complete' : `Missing: ${missing}.`, todo ? `Do: ${todo}.` : '']
		.filter(Boolean)
		.join(' ');
}

const LEAD =
	'100 = every parameter described and typed as a static entity, structure or number rather than free Text (ExtendedClass is Text on purpose). Optional parameters without an OML default take the platform default of their data type.';

export default {
	id: 'M03',
	name: 'Block Parameter Precision',
	criterion: 'Typed contracts at the block boundary',
	formula:
		'per composable block with parameters: 60·(params with a description) + 40·(params whose type is not free Text or Object, ExtendedClass excluded); mean over blocks. Optional params without an OML default take the platform default of their type and are not scored.',
	movable: true,
	present: {
		scope: 'Per composable OML block: how far an agent can fill its parameters from the signature alone. Blocks without parameters and non-composable blocks are not applicable.',
		heatmap: true,
		appliesTo: ['block'],
		/** @param {any} row */
		cell(row) {
			return { s: row.score, h: cellText(row) };
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			const worst = (m.perComponent ?? []).slice(0, 6).map((/** @type {any} */ r) => `${r.label} ${r.score}`);
			return [
				`${raw.described}/${raw.params} parameters described, ${raw.freeText} free-Text or Object; ${raw.platformDefaulted}/${raw.optional} optional ones take the platform default.`,
				worst.length ? `Lowest: ${list(worst, 6)}.` : 'No block measured.',
				'This eval moves with the OutSystems UI OML (next Forge release), not with this repository; the table is the request list. Defaults are settled by the platform and not requested.',
			];
		},
		/** @param {any} m */
		extra(m) {
			const rows = (m.perComponent ?? []).map((/** @type {any} */ r) => ({
				label: r.label,
				score: r.score,
				missing: missingOf(r),
				do: doOf(r),
			}));
			return { blocksM03: blockTable('M03 · parameter precision per block', LEAD, rows) };
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const snapshots = ctx.modelSnapshots();
		const rows = flattenBlocks(snapshots);
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string, hint?: string }[]} */
		const notApplicable = [];
		const totals = { params: 0, described: 0, optional: 0, defaulted: 0, platformDefaulted: 0, freeText: 0 };
		for (const b of rows) {
			if (!isComposable(b)) {
				notApplicable.push({ name: b.label, reason: notComposableReason(b) });
				continue;
			}
			const m = measureBlock(b);
			if (m.params === 0) {
				notApplicable.push({ name: b.label, reason: 'no input parameters' });
				continue;
			}
			totals.params += m.params;
			totals.described += m.described;
			totals.optional += m.optional;
			totals.defaulted += m.defaulted;
			totals.platformDefaulted += m.platformDefaulted.length;
			totals.freeText += m.freeText.length;
			perComponent.push({ name: b.label, label: b.label, key: b.key, ...m, score: scorePrecision(m) });
		}
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary:
				snapshots.length === 0
					? NO_SNAPSHOT
					: `${totals.described}/${totals.params} params described, ${totals.freeText} free-Text, ${totals.platformDefaulted}/${totals.optional} optional on the platform default across ${perComponent.length} blocks`,
			raw: totals,
			perComponent: sortedByScore(perComponent),
			unmeasured: [],
			notApplicable,
		};
	},
};
