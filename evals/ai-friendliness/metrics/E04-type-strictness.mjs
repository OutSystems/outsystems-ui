// @ts-check
import { penalty, round1 } from '../lib/score.mjs';
import {
	countAnyKeywords,
	countProgramLines,
	countSuppressions,
	getExportedFunctions,
	implicitAnyDiagnostics,
} from '../lib/ts.mjs';

/**
 * @param {{ implicit: number, explicit: number, suppressions: number, missingReturnRatio: number, kloc: number }} raw
 */
export function scoreGlobal({ implicit, explicit, suppressions, missingReturnRatio, kloc }) {
	const k = Math.max(kloc, 0.001);
	return penalty([
		Math.min(40, (4 * implicit) / k),
		Math.min(20, (10 * explicit) / k),
		Math.min(10, 2.5 * suppressions),
		30 * missingReturnRatio,
	]);
}

export default {
	id: 'E04',
	name: 'Type Strictness',
	criterion: 'Type-Constrained Determinism',
	formula:
		'100 − min(40, 4·implicitAny/KLOC) − min(20, 10·explicitAny/KLOC) − min(10, 2.5·suppressions) − 30·(exported public functions without return type / total)',
	movable: true,
	/** @param {import('../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const program = ctx.program;
		const srcRoot = `${ctx.root}/src/scripts`.replace(/\\/g, '/').toLowerCase();
		const sources = program
			.getSourceFiles()
			.filter((sf) => !sf.isDeclarationFile && sf.fileName.toLowerCase().startsWith(srcRoot));

		const diagnostics = implicitAnyDiagnostics(program);
		/** @type {Map<string, number>} */
		const perFile = new Map();
		for (const d of diagnostics) {
			const file = d.file ? ctx.rel(d.file) : '(unknown)';
			perFile.set(file, (perFile.get(file) ?? 0) + 1);
		}

		let explicit = 0;
		let suppressions = 0;
		for (const sf of sources) {
			explicit += countAnyKeywords(sf);
			suppressions += countSuppressions(sf);
		}

		const publicFns = sources
			.filter((sf) => /\/OutSystems\/OSUI\//i.test(sf.fileName))
			.flatMap((sf) => getExportedFunctions(sf));
		const missingReturn = publicFns.filter((f) => !f.hasReturnType);

		const raw = {
			implicit: diagnostics.length,
			explicit,
			suppressions,
			missingReturnRatio: publicFns.length ? missingReturn.length / publicFns.length : 0,
			kloc: round1(countProgramLines(program) / 1000),
			strictModeEnabled: Boolean(program.getCompilerOptions().strict),
			publicFunctions: publicFns.length,
			missingReturnTypes: missingReturn.length,
		};
		const topFiles = [...perFile.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 15)
			.map(([file, count]) => ({ name: file, implicitAny: count }));
		return {
			score: scoreGlobal(raw),
			summary: `${raw.implicit} implicit-any findings, ${explicit} explicit any, ${suppressions} ts-ignore/expect-error, ${missingReturn.length}/${publicFns.length} public fns without return type (${raw.kloc} KLOC)`,
			raw,
			perComponent: topFiles,
			unmeasured: [],
			details: { missingReturnTypes: missingReturn.map((f) => `${ctx.rel(f.file)}#${f.name}`) },
		};
	},
};
