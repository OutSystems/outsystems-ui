// @ts-check
/**
 * E05 · Documentation Coverage.
 *
 * What an agent can learn from the comments and the generated agent docs. Per API function, three
 * facets: a description, a text for every parameter, a text for the return value (when it returns
 * one); per config prop, a description. Plus the five agent-docs tiers under docs-ai/.
 */
import { expectationsFor } from '../../lib/expectations.mjs';
import { round1 } from '../../lib/score.mjs';
import { parseCards } from './E01-context-tokens.mjs';
import { list, pct } from '../../lib/present.mjs';

/**
 * @param {{ jsdocApi: number, jsdocProps: number, agentDocs: number }} raw facet means in [0,1] and a 0–100 tier score
 */
export function scoreGlobal({ jsdocApi, jsdocProps, agentDocs }) {
	return 35 * jsdocApi + 15 * jsdocProps + 0.5 * agentDocs;
}

/** Return types that carry nothing to describe. */
const VOID_RETURNS = new Set([null, 'void', 'undefined', 'never']);

/**
 * The documentation facets of one API function: description, a text per parameter and, when it
 * returns something, a text for the return value. `returns` is null when not applicable.
 * @param {import('../../lib/ts.mjs').ExportedFunction} fn
 * @returns {{ description: boolean, params: boolean, returns: boolean|null }}
 */
export function facetsOf(fn) {
	const doc = fn.jsDoc;
	const description = Boolean(doc && doc.description.length > 0);
	const params = fn.params.every((p) => Boolean(doc?.paramDescriptions[p.name]));
	const returns = VOID_RETURNS.has(fn.returnType) ? null : Boolean(doc?.returns);
	return { description, params, returns };
}

/**
 * Share of a function's applicable facets that are documented, in [0,1].
 * @param {import('../../lib/ts.mjs').ExportedFunction} fn
 */
export function docScore(fn) {
	const f = facetsOf(fn);
	const applicable = [f.description, f.params, ...(f.returns === null ? [] : [f.returns])];
	return applicable.filter(Boolean).length / applicable.length;
}

/** Fully documented: every applicable facet present. @param {import('../../lib/ts.mjs').ExportedFunction} fn */
export function isDocumented(fn) {
	return docScore(fn) === 1;
}

/** `Name() [returns, params]`: what a partially documented function still lacks. @param {import('../../lib/ts.mjs').ExportedFunction} fn */
function lacking(fn) {
	const f = facetsOf(fn);
	const missing = [];
	if (!f.description) missing.push('description');
	if (!f.params) missing.push('@param text');
	if (f.returns === false) missing.push('@returns');
	return `${fn.name}() [${missing.join(', ')}]`;
}

export default {
	id: 'E05',
	name: 'Documentation Coverage',
	criterion: 'Agent Documentation (llms.txt tiers) · TSDoc',
	formula:
		'35·mean over API functions of (description, @param text per parameter, @returns text when it returns a value) + 15·(config props with a description) + 0.5·agentDocs; agentDocs = 20·llms.txt + 20·llms-components coverage + 20·llms-tokens.txt + 20·llms-patterns.txt + 20·llms-utilities.txt',
	movable: true,
	present: {
		scope: 'Per pattern: API function facets (description, parameter texts, return text) and config props with a description (cell = documented share). CSS-only components have no API.',
		heatmap: true,
		appliesTo: ['pattern'],
		/** @param {any} row */
		cell(row) {
			const total = row.apiTotal + row.propsTotal;
			const done = row.apiDocumented + row.propsDocumented;
			const todo = [...(row.undocumentedApi ?? []), ...(row.undocumentedProps ?? [])];
			const documentHint = todo.length ? ` Document: ${list(todo)}.` : '';
			return {
				s: pct(done, total),
				h: `${row.apiDocumented}/${row.apiTotal} API function facets and ${row.propsDocumented}/${row.propsTotal} props documented.${documentHint}`,
			};
		},
		/** @param {any} m */
		advice(m) {
			const raw = m.raw ?? {};
			return [
				m.summary,
				raw.jsdocApi < 1
					? 'Add the missing facet to the comment (TSDoc: a description, `@param name text`, `@returns text`); the generator reads the same comments, so the cards improve with them.'
					: 'Coverage is complete; the generator reads the same comments, so new functions and props need a comment before docs-ai regenerates.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		let apiTotal = 0;
		let apiDocumented = 0;
		let propsTotal = 0;
		let propsDocumented = 0;
		const perComponent = ctx.inventory.patterns.map((p) => {
			const e = expectationsFor(ctx, p);
			const scores = e.apiFunctions.map((f) => docScore(f));
			const documentedApi = round1(scores.reduce((a, b) => a + b, 0));
			const documentedProps = e.props.filter((x) => x.hasDoc);
			apiTotal += e.apiFunctions.length;
			apiDocumented += documentedApi;
			propsTotal += e.props.length;
			propsDocumented += documentedProps.length;
			return {
				name: p.name,
				apiDocumented: documentedApi,
				apiTotal: e.apiFunctions.length,
				undocumentedApi: e.apiFunctions.filter((f) => !isDocumented(f)).map((f) => lacking(f)),
				propsDocumented: documentedProps.length,
				propsTotal: e.props.length,
				undocumentedProps: e.props.filter((x) => !x.hasDoc).map((x) => x.name),
			};
		});

		const patterns = ctx.inventory.patterns.map((p) => p.name);
		const cards = parseCards(ctx.docsAi('llms-components.txt'));
		const componentsCoverage = patterns.filter((n) => cards.has(n)).length / Math.max(1, patterns.length);
		const tiers = {
			'llms.txt': ctx.docsAi('llms.txt') ? 20 : 0,
			'llms-components.txt': round1(20 * componentsCoverage),
			'llms-tokens.txt': ctx.docsAi('llms-tokens.txt') ? 20 : 0,
			'llms-patterns.txt': ctx.docsAi('llms-patterns.txt') ? 20 : 0,
			'llms-utilities.txt': ctx.docsAi('llms-utilities.txt') ? 20 : 0,
		};
		const agentDocs = Object.values(tiers).reduce((a, b) => a + b, 0);
		const raw = {
			jsdocApi: apiTotal ? apiDocumented / apiTotal : 1,
			jsdocProps: propsTotal ? propsDocumented / propsTotal : 1,
			agentDocs,
		};
		const fullyDocumented = perComponent.reduce((n, r) => n + (r.apiTotal - r.undocumentedApi.length), 0);
		return {
			score: scoreGlobal(raw),
			summary: `API facets ${round1(apiDocumented)}/${apiTotal} (${fullyDocumented} functions complete), prop descriptions ${propsDocumented}/${propsTotal}, agent docs ${agentDocs}/100`,
			raw: {
				...raw,
				jsdocApi: round1(raw.jsdocApi * 100) / 100,
				jsdocProps: round1(raw.jsdocProps * 100) / 100,
				tiers,
				apiTotal,
				propsTotal,
			},
			perComponent: [...perComponent].sort(
				(a, b) => a.apiDocumented / Math.max(1, a.apiTotal) - b.apiDocumented / Math.max(1, b.apiTotal)
			),
			unmeasured: [],
		};
	},
};
