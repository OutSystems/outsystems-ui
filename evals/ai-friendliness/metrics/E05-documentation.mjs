// @ts-check
import { expectationsFor } from '../../lib/expectations.mjs';
import { round1 } from '../../lib/score.mjs';
import { parseCards } from './E01-context-tokens.mjs';
import { list, pct } from '../../lib/present.mjs';

/**
 * @param {{ jsdocApi: number, jsdocProps: number, agentDocs: number }} raw ratios in [0,1] and a 0–100 tier score
 */
export function scoreGlobal({ jsdocApi, jsdocProps, agentDocs }) {
	return 35 * jsdocApi + 15 * jsdocProps + 0.5 * agentDocs;
}

/**
 * @param {import('../../lib/ts.mjs').ExportedFunction} fn
 */
export function isDocumented(fn) {
	if (!fn.jsDoc || fn.jsDoc.description.length === 0) return false;
	const documented = new Set(fn.jsDoc.params);
	return fn.params.every((p) => documented.has(p.name));
}

export default {
	id: 'E05',
	name: 'Documentation Coverage',
	criterion: 'Agent Documentation (llms.txt tiers) · JSDoc',
	formula:
		'35·(API functions with description + @param per parameter) + 15·(config props with a comment) + 0.5·agentDocs; agentDocs = 25·llms.txt + 25·llms-components coverage + 25·llms-tokens.txt + 25·llms-patterns.txt',
	movable: true,
	present: {
		scope: 'Per pattern: API functions and config props with documentation (cell = documented share). CSS-only components have no API.',
		heatmap: true,
		appliesTo: 'pattern',
		/** @param {any} row */
		cell(row) {
			const total = row.apiTotal + row.propsTotal;
			const done = row.apiDocumented + row.propsDocumented;
			const todo = [
				...(row.undocumentedApi ?? []).map((/** @type {string} */ f) => `${f}()`),
				...(row.undocumentedProps ?? []),
			];
			const documentHint = todo.length ? ` Document: ${list(todo)}.` : '';
			return {
				s: pct(done, total),
				h: `${row.apiDocumented}/${row.apiTotal} API functions and ${row.propsDocumented}/${row.propsTotal} props documented.${documentHint}`,
			};
		},
		/** @param {any} m */
		advice(m) {
			return [
				m.summary,
				'Coverage is complete; the generator reads the same JSDoc, so new functions and props need a comment before docs-ai regenerates.',
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
			const documentedFns = e.apiFunctions.filter(isDocumented);
			const documentedProps = e.props.filter((x) => x.hasDoc);
			apiTotal += e.apiFunctions.length;
			apiDocumented += documentedFns.length;
			propsTotal += e.props.length;
			propsDocumented += documentedProps.length;
			return {
				name: p.name,
				apiDocumented: documentedFns.length,
				apiTotal: e.apiFunctions.length,
				undocumentedApi: e.apiFunctions.filter((f) => !isDocumented(f)).map((f) => f.name),
				propsDocumented: documentedProps.length,
				propsTotal: e.props.length,
				undocumentedProps: e.props.filter((x) => !x.hasDoc).map((x) => x.name),
			};
		});

		const patterns = ctx.inventory.patterns.map((p) => p.name);
		const cards = parseCards(ctx.docsAi('llms-components.txt'));
		const componentsCoverage = patterns.filter((n) => cards.has(n)).length / Math.max(1, patterns.length);
		const tiers = {
			'llms.txt': ctx.docsAi('llms.txt') ? 25 : 0,
			'llms-components.txt': round1(25 * componentsCoverage),
			'llms-tokens.txt': ctx.docsAi('llms-tokens.txt') ? 25 : 0,
			'llms-patterns.txt': ctx.docsAi('llms-patterns.txt') ? 25 : 0,
		};
		const agentDocs = Object.values(tiers).reduce((a, b) => a + b, 0);
		const raw = {
			jsdocApi: apiTotal ? apiDocumented / apiTotal : 1,
			jsdocProps: propsTotal ? propsDocumented / propsTotal : 1,
			agentDocs,
		};
		return {
			score: scoreGlobal(raw),
			summary: `API JSDoc ${apiDocumented}/${apiTotal}, prop comments ${propsDocumented}/${propsTotal}, agent docs ${agentDocs}/100`,
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
