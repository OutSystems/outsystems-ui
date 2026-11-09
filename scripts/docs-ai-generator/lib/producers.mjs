// @ts-check
/**
 * Producer scoping of the agent docs: an OML producer (the Model bridge's OpenUI/HTML/TSX dialects, Service
 * Studio) composes blocks and must not emit pattern markup or lifecycle calls; a runtime producer does. The
 * generator marks runtime-only lines with RUNTIME_ONLY and M05 checks the marks. One place for both.
 */
export const RUNTIME_ONLY = '[runtime-only]';
export const PRODUCERS_HEADING = '## Producers';
/** Substrings that make a llms.txt gotcha runtime-only. */
export const RUNTIME_GOTCHA_NEEDLES = ['name="<id>"', 'Lifecycle:', 'configs', 'envelope', 'Load one card'];
/** Card and pattern-doc lines that describe the runtime contract only. */
const RUNTIME_ONLY_LINE_HEADS = ['Lifecycle:', 'Markup skeleton', 'Skeleton ('];

/** `1. text` or `- text` → `text`, trimmed (CR included). @param {string} line */
export function stripListPrefix(line) {
	const t = line.trim();
	if (t.startsWith('- ')) return t.slice(2);
	let i = 0;
	while (i < t.length && t[i] >= '0' && t[i] <= '9') i++;
	if (i > 0 && t[i] === '.' && t[i + 1] === ' ') return t.slice(i + 2);
	return t;
}

/** @param {string} line */
export function isMarked(line) {
	return stripListPrefix(line).startsWith(RUNTIME_ONLY);
}

/** @param {string} line */
export function isRuntimeOnlyLine(line) {
	let t = stripListPrefix(line);
	if (t.startsWith(RUNTIME_ONLY)) t = t.slice(RUNTIME_ONLY.length).trimStart();
	return RUNTIME_ONLY_LINE_HEADS.some((h) => t.startsWith(h));
}
