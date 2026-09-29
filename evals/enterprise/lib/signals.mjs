// @ts-check
/**
 * Shared, statically observable signals for the enterprise-readiness evals.
 *
 * Every signal is a plain substring test over source text or compiled CSS (no regular expressions
 * over untrusted input, no code execution), read through the eval context so paths stay confined
 * to the repository and reads are cached.
 */
import path from 'node:path';

import { walk } from '../../ai-friendliness/lib/inventory.mjs';
import { insideDir } from '../../ai-friendliness/lib/paths.mjs';

/** Patterns whose behaviour is delegated to a provider library (flatpickr, noUiSlider, VirtualSelect, Splide). */
export const PROVIDER_PATTERNS = new Set([
	'Carousel',
	'DatePicker',
	'Dropdown',
	'MonthPicker',
	'RangeSlider',
	'TimePicker',
]);

/** Patterns that render no interactive control of their own. */
export const NON_INTERACTIVE_PATTERNS = new Set([
	'AnimatedLabel',
	'Gallery',
	'InlineSvg',
	'Progress',
	'SectionIndex',
	'SwipeEvents',
	'TouchEvents',
	'Video',
]);

/** Patterns that open a layer and must manage focus and dismissal. */
export const OVERLAY_PATTERNS = new Set([
	'BottomSheet',
	'Dropdown',
	'DropdownServerSideItem',
	'Notification',
	'OverflowMenu',
	'Sidebar',
	'Submenu',
	'Tooltip',
]);

/** Composite widgets whose keyboard model needs arrow keys. */
export const COMPOSITE_PATTERNS = new Set([
	'Carousel',
	'DatePicker',
	'MonthPicker',
	'RangeSlider',
	'Rating',
	'Tabs',
	'TabsHeaderItem',
	'TimePicker',
]);

/** Parent and child patterns that implement one keyboard model together (roving focus lives on the parent). */
export const PATTERN_FAMILIES = {
	Accordion: ['AccordionItem'],
	AccordionItem: ['Accordion'],
	SectionIndex: ['SectionIndexItem'],
	SectionIndexItem: ['SectionIndex'],
	Tabs: ['TabsContentItem', 'TabsHeaderItem'],
	TabsContentItem: ['Tabs'],
	TabsHeaderItem: ['Tabs'],
	Wizard: ['WizardItem'],
	WizardItem: ['Wizard'],
};

/** Shared runtime features, by the name a pattern references and the directory that implements them. */
export const SHARED_FEATURES = { Balloon: ['src', 'scripts', 'OSFramework', 'OSUI', 'Feature', 'Balloon'] };

/**
 * Text of the code a pattern shares its behaviour with: its family members and the shared features
 * it references. Keyboard handling found there counts for the pattern.
 * @param {import('../../ai-friendliness/lib/context.mjs').EvalContext} ctx
 * @param {import('../../ai-friendliness/lib/inventory.mjs').Pattern} p
 * @param {string} ownText the pattern's own TypeScript
 */
export function sharedText(ctx, p, ownText) {
	const parts = [];
	for (const name of PATTERN_FAMILIES[/** @type {keyof typeof PATTERN_FAMILIES} */ (p.name)] ?? []) {
		const member = ctx.inventory.patterns.find((x) => x.name === name);
		if (member) parts.push(patternText(ctx, member));
	}
	for (const [feature, segments] of Object.entries(SHARED_FEATURES)) {
		if (!ownText.includes(feature)) continue;
		for (const file of walk(insideDir(ctx.root, ...segments)))
			if (file.endsWith('.ts')) parts.push(ctx.readText(file));
	}
	return parts.join('\n');
}

/** Patterns that give feedback and should announce it. */
export const FEEDBACK_PATTERNS = new Set(['ButtonLoading', 'Notification', 'Progress', 'Search']);

/** The theme's foundations: rules that hold for every component (motion guard, focus ring). */
export const THEME_RESETS = ['src', 'scss', '01-foundations', '_resets.scss'];

/**
 * Theme-level guards a component inherits without rules of its own.
 * @param {import('../../ai-friendliness/lib/context.mjs').EvalContext} ctx
 */
export function themeGuards(ctx) {
	const resets = ctx.readText(insideDir(ctx.root, ...THEME_RESETS));
	return {
		reducedMotion: resets.includes('prefers-reduced-motion'),
		focusRing: resets.includes('.has-accessible-features :focus'),
	};
}

/**
 * @param {string} text
 * @param {readonly string[]} needles
 */
export function includesAny(text, needles) {
	for (const n of needles) if (text.includes(n)) return true;
	return false;
}

/**
 * Concatenated TypeScript source of a pattern: API, classes, configs, enums, interfaces, factories,
 * typings, across the framework and provider directories.
 * @param {import('../../ai-friendliness/lib/context.mjs').EvalContext} ctx
 * @param {import('../../ai-friendliness/lib/inventory.mjs').Pattern} p
 */
export function patternText(ctx, p) {
	const files = [...new Set([...p.contractFiles, ...p.typingFiles])];
	return files.map((f) => ctx.readText(f)).join('\n');
}

/**
 * @typedef {{ name: string, kind: 'pattern'|'css', pattern: import('../../ai-friendliness/lib/inventory.mjs').Pattern|null, scssFiles: string[], storyFile: string|null }} Component
 */

/**
 * Every component the SCSS-based evals look at: each pattern and each CSS-only component.
 * @param {import('../../ai-friendliness/lib/context.mjs').EvalContext} ctx
 * @returns {Component[]}
 */
export function componentUniverse(ctx) {
	/** @type {Component[]} */
	const out = [];
	for (const p of ctx.inventory.patterns) {
		out.push({ name: p.name, kind: 'pattern', pattern: p, scssFiles: p.scssFiles, storyFile: p.storyFile });
	}
	for (const c of ctx.inventory.cssComponents) {
		out.push({ name: c.name, kind: 'css', pattern: null, scssFiles: [c.scssFile], storyFile: c.storyFile });
	}
	return out;
}

/**
 * Compiled CSS of a component (all its partials), or null with the first compile error.
 * @param {import('../../ai-friendliness/lib/context.mjs').EvalContext} ctx
 * @param {Component} c
 * @returns {{ css: string|null, error: string|null }}
 */
export function componentCss(ctx, c) {
	if (c.scssFiles.length === 0) return { css: null, error: 'no SCSS partial' };
	const parts = [];
	for (const f of c.scssFiles) {
		const hit = ctx.compiledCss(f);
		if (hit.css === null)
			return { css: null, error: `compile error in ${path.basename(f)}: ${(hit.error ?? '').split('\n')[0]}` };
		parts.push(hit.css);
	}
	return { css: parts.join('\n'), error: null };
}

/**
 * Names of the `--osui-*` custom properties a CSS text mentions, scanned character by character.
 * @param {string} css
 * @returns {string[]} unique names, e.g. `--osui-accordion-item-padding`
 */
export function osuiVarNames(css) {
	/** @type {Set<string>} */
	const names = new Set();
	let i = css.indexOf('--osui-');
	while (i !== -1) {
		let j = i;
		while (j < css.length && isVarChar(css[j])) j++;
		names.add(css.slice(i, j));
		i = css.indexOf('--osui-', j);
	}
	return [...names].sort((a, b) => a.localeCompare(b));
}

/** @param {string} ch */
function isVarChar(ch) {
	return ch === '-' || ch === '_' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9');
}

/**
 * Mean of the applicable checks of a row as a 0–100 score; null when nothing applies.
 * @param {Record<string, { applicable: boolean, pass: boolean }>} checks
 */
export function scoreChecks(checks) {
	const applicable = Object.values(checks).filter((c) => c.applicable);
	if (applicable.length === 0) return null;
	const passed = applicable.filter((c) => c.pass).length;
	return Math.round((1000 * passed) / applicable.length) / 10;
}

/**
 * Short "passed / failed" summary of a checks record for hints.
 * @param {Record<string, { applicable: boolean, pass: boolean }>} checks
 * @param {Record<string, string>} labels
 */
export function describeChecks(checks, labels) {
	const failed = Object.entries(checks)
		.filter(([, c]) => c.applicable && !c.pass)
		.map(([k]) => labels[k] ?? k);
	const passed = Object.entries(checks)
		.filter(([, c]) => c.applicable && c.pass)
		.map(([k]) => labels[k] ?? k);
	return { failed, passed };
}
