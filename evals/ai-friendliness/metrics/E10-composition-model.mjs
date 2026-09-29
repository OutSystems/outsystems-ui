// @ts-check
import { expectationsFor } from '../lib/expectations.mjs';
import { mean, penalty, round1 } from '../lib/score.mjs';
import { getClassesInFiles, getSourceFile, ts } from '../lib/ts.mjs';

/**
 * @param {{ depth: number, files: number, configShape: number, eventModel: number, moduleFormat: number }} raw
 */
export function scoreComponent({ depth, files, configShape, eventModel, moduleFormat }) {
	return penalty([
		12 * Math.max(0, depth - 1),
		5 * Math.max(0, files - 4),
		15 * (1 - configShape),
		10 * (1 - eventModel),
		15 * (1 - moduleFormat),
	]);
}

export default {
	id: 'E10',
	name: 'Composition Model & Standards Alignment',
	criterion: 'Pre-training Density · Composable Primitives',
	formula:
		'100 − 12·max(0, inheritance depth − 1) − 5·max(0, contract files − 4) − 15·(configs accepted only as JSON string) − 10·(event names typed as string) − 15·(global namespaces instead of ES modules)',
	movable: false,
	/** @param {import('../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const program = ctx.program;
		const perComponent = ctx.inventory.patterns.map((p) => {
			const classes = getClassesInFiles(program, p.classFiles);
			const concrete = classes.filter((c) => !c.isAbstract && c.chain.length > 1);
			const pool = concrete.length ? concrete : classes;
			const deepest = pool.reduce((best, c) => (c.chain.length > (best?.chain.length ?? 0) ? c : best), /** @type {any} */ (null));
			const depth = deepest ? deepest.chain.length - 1 : 0;
			const fns = expectationsFor(ctx, p).apiFunctions;
			const create = fns.find((f) => f.name === 'Create');
			const configsParam = create?.params.find((x) => /config/i.test(x.name));
			// no configs parameter → nothing to type; a typed (non-string) parameter → 1; JSON string only → 0
			let configShape = 1;
			if (configsParam) configShape = configsParam.type && configsParam.type !== 'string' ? 1 : 0;
			const register = fns.find((f) => f.name === 'RegisterCallback');
			const eventParam = register?.params.find((x) => /event/i.test(x.name));
			// no RegisterCallback → nothing to type; a typed (non-string) event name → 1; plain string → 0
			let eventModel = 1;
			if (register) eventModel = eventParam && eventParam.type !== 'string' ? 1 : 0;
			const apiSf = getSourceFile(program, p.apiFile);
			const moduleFormat = apiSf && ts.isExternalModule(apiSf) ? 1 : 0;
			const raw = { depth, files: p.contractFiles.length, configShape, eventModel, moduleFormat };
			return {
				name: p.name,
				...raw,
				chain: deepest ? deepest.chain.join(' → ') : '(no class)',
				score: round1(scoreComponent(raw)),
			};
		});
		return {
			score: mean(perComponent.map((c) => c.score)) ?? 0,
			summary: `mean inheritance depth ${round1(mean(perComponent.map((c) => c.depth)) ?? 0)}, mean ${round1(mean(perComponent.map((c) => c.files)) ?? 0)} contract files; ${perComponent.filter((c) => c.configShape === 0).length} JSON-string-only Create, ${perComponent.filter((c) => c.moduleFormat === 0).length} global-namespace APIs`,
			raw: {
				meanDepth: round1(mean(perComponent.map((c) => c.depth)) ?? 0),
				maxDepth: Math.max(0, ...perComponent.map((c) => c.depth)),
				meanFiles: round1(mean(perComponent.map((c) => c.files)) ?? 0),
				jsonStringConfigs: perComponent.filter((c) => c.configShape === 0).length,
				stringEventNames: perComponent.filter((c) => c.eventModel === 0).length,
				globalNamespaceApis: perComponent.filter((c) => c.moduleFormat === 0).length,
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score),
			unmeasured: [],
		};
	},
};
