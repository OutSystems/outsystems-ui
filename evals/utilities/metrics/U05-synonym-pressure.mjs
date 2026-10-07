// @ts-check
/**
 * U05 · Synonym pressure.
 *
 * Two classes with the same declarations (`bold` and `font-bold`, `hidden` and `display-none`) force an
 * agent to pick one and readers to know both. Measured over plain declarations across every family.
 */
import { list } from '../../lib/present.mjs';
import { round1 } from '../../lib/score.mjs';
import { signatureOf, utilityFamilies } from '../../lib/utilities.mjs';

const APPLIES_TO = ['utility'];

export default {
	id: 'U05',
	name: 'Synonym Pressure',
	criterion: 'One name per effect',
	formula: '100 · (1 − classes whose plain declarations equal another class / classes with plain declarations)',
	movable: true,
	present: {
		scope: 'Per utility family: its classes that duplicate another class (cell = share of unique effects), naming the twins.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the family can be read.',
		/** @param {any} row */
		cell(row) {
			const twins = (row.duplicates ?? []).map((/** @type {any} */ d) => `${d.name} = ${d.sameAs.join(' = ')}`);
			return {
				s: row.score,
				h: twins.length ? `Same declarations: ${list(twins, 4)}.` : 'Every class has its own effect.',
			};
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			return [
				m.summary,
				raw.pairs?.length
					? `Keep both names (removing one is a breaking change) and mark the grammar form as canonical in the docs: ${list(raw.pairs, 6)}.`
					: 'No two utility classes share their declarations.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const families = utilityFamilies(ctx);
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = families
			.filter((f) => f.error)
			.map((f) => ({ name: f.name, reason: `compile error: ${String(f.error).split('\n')[0]}` }));
		/** @type {Map<string, string[]>} */
		const bySignature = new Map();
		for (const f of families) {
			for (const c of f.classes) {
				const sig = signatureOf(c);
				if (sig === null) continue;
				bySignature.set(sig, [...(bySignature.get(sig) ?? []), c.name]);
			}
		}
		/** @type {Map<string, string[]>} */
		const twinsOf = new Map();
		for (const names of bySignature.values()) {
			if (names.length < 2) continue;
			for (const n of names)
				twinsOf.set(
					n,
					names.filter((x) => x !== n)
				);
		}
		let total = 0;
		let duplicated = 0;
		/** @type {any[]} */
		const perComponent = [];
		for (const f of families.filter((x) => !x.error)) {
			const withSig = f.classes.filter((c) => signatureOf(c) !== null);
			const duplicates = withSig
				.filter((c) => twinsOf.has(c.name))
				.map((c) => ({ name: c.name, sameAs: /** @type {string[]} */ (twinsOf.get(c.name)) }));
			total += withSig.length;
			duplicated += duplicates.length;
			perComponent.push({
				name: f.name,
				kind: 'utility',
				total: withSig.length,
				duplicates,
				score: withSig.length ? round1(100 * (1 - duplicates.length / withSig.length)) : 100,
			});
		}
		const pairs = [...bySignature.values()].filter((n) => n.length > 1).map((n) => n.join(' = '));
		return {
			score: round1(total ? 100 * (1 - duplicated / total) : 100),
			summary: `${pairs.length} groups of classes share their declarations (${duplicated} of ${total} classes)`,
			raw: { total, duplicated, pairs },
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured,
			notApplicable: [],
		};
	},
};
