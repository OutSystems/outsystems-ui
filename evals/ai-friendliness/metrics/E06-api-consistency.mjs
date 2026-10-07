// @ts-check
import { expectationsFor } from '../../lib/expectations.mjs';
import { mean, round1 } from '../../lib/score.mjs';
import { list, rowsOf, toDoHint } from '../../lib/present.mjs';

const CANONICAL = [
	{ label: 'Create', test: /^Create$/ },
	{ label: 'Initialize', test: /^Initialize$/ },
	{ label: 'Dispose', test: /^Dispose$/ },
	{ label: 'ChangeProperty', test: /^ChangeProperty$/ },
	{ label: 'RegisterCallback', test: /^RegisterCallback$/ },
	{ label: 'Get<Name>ById', test: /^Get\w+ById$/ },
	{ label: 'GetAll<Name>', test: /^GetAll\w+$/ },
];
const ENVELOPE_EXEMPT = /^(Create|Initialize|Get\w+ById|GetAll\w+)$/;
const CAMEL = /^[a-z][A-Za-z0-9]*$/;
const INLINE_CODE = /^OSUI-(API|GEN)-/;

/**
 * @param {{ presence: number, envelope: number, params: number, codes: number }} raw
 */
export function scoreComponent({ presence, envelope, params, codes }) {
	return 100 * (0.4 * presence + 0.3 * envelope + 0.2 * params + 0.1 * codes);
}

export default {
	id: 'E06',
	name: 'Public API Shape Consistency',
	criterion: 'Snippet Predictability',
	formula:
		'100 · (0.4·canonical members present/7 + 0.3·non-lifecycle functions returning the CreateApiResponse envelope + 0.2·camelCase parameters + 0.1·no inline error-code literals)',
	movable: true,
	present: {
		scope: 'Per pattern: canonical API members present, functions returning the response envelope, camelCase parameters. CSS-only components have no API.',
		heatmap: true,
		appliesTo: ['pattern'],
		/** @param {any} row */
		cell(row) {
			const todo = [];
			if (row.missing?.length) todo.push(`add canonical members: ${list(row.missing)}`);
			if (row.unwrapped?.length)
				todo.push(`return the response envelope from: ${list(row.unwrapped)} (behaviour change, see B-3)`);
			if (row.nonCamelParams?.length) todo.push(`camelCase parameters: ${list(row.nonCamelParams)}`);
			if (row.inlineCodes?.length) todo.push(`replace inline error codes: ${list(row.inlineCodes)}`);
			return {
				s: row.score,
				h: `${row.functions} API functions.${toDoHint(todo, ' Matches the canonical shape.')}`,
			};
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			const unwrapped = rowsOf(m).flatMap((r) =>
				(r.unwrapped ?? []).map((/** @type {string} */ f) => `${r.name}.${f}`)
			);
			return [
				unwrapped.length
					? `${unwrapped.length} functions return void instead of the response envelope: ${list(unwrapped, 6)}. Wrapping them changes error propagation (B-3).`
					: 'Every eligible function returns the response envelope.',
				`${raw.missingTotal} missing canonical members, ${raw.nonCamelTotal} non-camelCase parameters.`,
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const perComponent = ctx.inventory.patterns.map((p) => {
			const fns = expectationsFor(ctx, p).apiFunctions;
			const names = fns.map((f) => f.name);
			const missing = CANONICAL.filter((c) => !names.some((n) => c.test.test(n))).map((c) => c.label);
			const eligible = fns.filter((f) => !ENVELOPE_EXEMPT.test(f.name));
			const unwrapped = eligible.filter((f) => !f.calls.has('CreateApiResponse')).map((f) => f.name);
			const params = fns.flatMap((f) => f.params.map((x) => `${f.name}(${x.name})`));
			const nonCamel = fns.flatMap((f) =>
				f.params.filter((x) => !CAMEL.test(x.name)).map((x) => `${f.name}(${x.name})`)
			);
			const inlineCodes = fns.flatMap((f) => f.stringLiterals.filter((s) => INLINE_CODE.test(s)));
			const raw = {
				presence: (CANONICAL.length - missing.length) / CANONICAL.length,
				envelope: eligible.length ? (eligible.length - unwrapped.length) / eligible.length : 1,
				params: params.length ? (params.length - nonCamel.length) / params.length : 1,
				codes: inlineCodes.length ? 0 : 1,
			};
			return {
				name: p.name,
				functions: fns.length,
				missing,
				unwrapped,
				nonCamelParams: nonCamel,
				inlineCodes,
				score: round1(scoreComponent(raw)),
			};
		});
		const missingTotal = perComponent.reduce((s, c) => s + c.missing.length, 0);
		const unwrappedTotal = perComponent.reduce((s, c) => s + c.unwrapped.length, 0);
		const nonCamelTotal = perComponent.reduce((s, c) => s + c.nonCamelParams.length, 0);
		return {
			score: mean(perComponent.map((c) => c.score)) ?? 0,
			summary: `${missingTotal} missing canonical members, ${unwrappedTotal} functions without envelope, ${nonCamelTotal} non-camelCase params`,
			raw: {
				missingTotal,
				unwrappedTotal,
				nonCamelTotal,
				functions: perComponent.reduce((s, c) => s + c.functions, 0),
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured: [],
		};
	},
};
