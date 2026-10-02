// @ts-check
import { expectationsFor } from '../../lib/expectations.mjs';
import { clamp01, mean, round1 } from '../../lib/score.mjs';
import { list, rowsOf, toDoHint } from '../../lib/present.mjs';

const FREE_PROPS = 8;
const PROPS_TO_ZERO = 12;
const PRECISE_KINDS = new Set(['boolean', 'number', 'enum', 'array', 'object', 'function', 'union']);
/** `Enum.IconType.Caret`, `GlobalEnum.Direction.Right`, `Providers.OSUI.X.Enum.Mode.Single`, … */
const ENUM_MEMBER = /(^|\.)(Global)?Enum\.[A-Z]\w*\.[A-Z]\w*$/;

/**
 * A `string` prop is a *stringly-typed enum* when the source validates it against a fixed set
 * (`validateInRange`) or defaults it to an enum member: the type says "any string" while only a
 * handful of values are valid, which is exactly what an agent cannot see.
 * @param {import('../../lib/ts.mjs').ConfigProp} prop
 */
export function isStringlyTypedEnum(prop) {
	if (prop.kind !== 'string') return false;
	return prop.validated === 'inRange' || ENUM_MEMBER.test(prop.defaultText ?? '');
}

/**
 * @param {import('../../lib/ts.mjs').ConfigProp} prop
 */
function isPrecise(prop) {
	if (PRECISE_KINDS.has(prop.kind)) return true;
	return prop.kind === 'string' && !isStringlyTypedEnum(prop);
}

/**
 * @param {{ n: number, precise: number }} raw
 */
export function scoreComponent({ n, precise }) {
	const size = clamp01(1 - Math.max(0, n - FREE_PROPS) / PROPS_TO_ZERO);
	const type = n === 0 ? 1 : precise / n;
	return 100 * (0.4 * size + 0.6 * type);
}

export default {
	id: 'E02',
	name: 'Prop Surface & Typing Precision',
	criterion: 'Schema & Metadata · Anatomy',
	formula: `100 · (0.4·clamp(1 − max(0, props − ${FREE_PROPS})/${PROPS_TO_ZERO}) + 0.6·precise/props); precise = boolean | number | enum/union | typed object/array | free string; a string validated with validateInRange or defaulted to an enum member is a stringly-typed enum (imprecise)`,
	movable: true,
	present: {
		scope: 'Per pattern: how many config props it has and how many are precisely typed. CSS-only components have no props.',
		heatmap: true,
		appliesTo: ['pattern'],
		/** @param {any} row */
		cell(row) {
			const parts = [`${row.precise} of ${row.n} props precise`];
			if (row.n > FREE_PROPS) parts.push(`${row.n - FREE_PROPS} props over the free allowance of ${FREE_PROPS}`);
			const todo = [];
			if (row.stringlyTypedEnums?.length)
				todo.push(
					`type as enums: ${list(row.stringlyTypedEnums.map((/** @type {string} */ s) => s.split(' (')[0]))}`
				);
			if (row.untyped?.length) todo.push(`give a type to: ${list(row.untyped)}`);
			return { s: row.score, h: `${parts.join('; ')}.${toDoHint(todo)}` };
		},
		/** @param {any} m */
		advice(m) {
			const rows = rowsOf(m);
			const stringly = rows.flatMap((r) =>
				(r.stringlyTypedEnums ?? []).map((/** @type {string} */ s) => `${r.name}.${s.split(' (')[0]}`)
			);
			const big = rows.filter((r) => r.n > FREE_PROPS).map((r) => `${r.name} (${r.n})`);
			return [
				stringly.length
					? `${stringly.length} stringly-typed enums remain: ${list(stringly, 7)}. Turning them into validated enum types changes runtime fallback behaviour (B-9).`
					: 'No stringly-typed enums remain.',
				big.length
					? `Patterns over the free allowance of ${FREE_PROPS} props: ${list(big, 6)}; splitting or grouping props is a public-contract change.`
					: 'No pattern exceeds the prop allowance.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const perComponent = ctx.inventory.patterns.map((p) => {
			const props = expectationsFor(ctx, p).props;
			const imprecise = props.filter((x) => !isPrecise(x));
			const raw = { n: props.length, precise: props.length - imprecise.length };
			return {
				name: p.name,
				...raw,
				stringlyTypedEnums: imprecise
					.filter((x) => x.kind === 'string')
					.map((x) => `${x.name} (default ${x.defaultText ?? '?'})`),
				untyped: imprecise.filter((x) => x.kind !== 'string').map((x) => `${x.name}: ${x.kind}`),
				score: round1(scoreComponent(raw)),
			};
		});
		const totalProps = perComponent.reduce((s, c) => s + c.n, 0);
		const totalPrecise = perComponent.reduce((s, c) => s + c.precise, 0);
		const stringly = perComponent.reduce((s, c) => s + c.stringlyTypedEnums.length, 0);
		const untyped = perComponent.reduce((s, c) => s + c.untyped.length, 0);
		return {
			score: mean(perComponent.map((c) => c.score)) ?? 0,
			summary: `${totalProps} props, ${round1((totalPrecise / Math.max(1, totalProps)) * 100)}% precise; ${stringly} stringly-typed enums, ${untyped} unknown/untyped`,
			raw: {
				totalProps,
				meanProps: round1(totalProps / Math.max(1, perComponent.length)),
				preciseRatio: round1(totalPrecise / Math.max(1, totalProps)),
				stringlyTypedEnums: stringly,
				untypedOrUnknown: untyped,
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured: [],
		};
	},
};
