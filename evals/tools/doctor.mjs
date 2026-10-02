#!/usr/bin/env node
// @ts-check
/**
 * Component doctor: where the tree and the registry (`evals/components.json`) disagree, and what a
 * new component needs before the evals can measure it.
 *
 *   node evals/tools/doctor.mjs [--fix] [--markdown]
 *
 * Lists components the inventory discovers that the registry does not classify (with an entry derived
 * from their code, so the defaults the evals would apply silently become visible), registry entries whose
 * component is gone, invalid roles, kind mismatches, and components without a Storybook story. `--fix`
 * appends the derived entries (flagged `derived: true`, to be reviewed) and drops the stale ones.
 * `--markdown` prints the section the PR comment carries. Exit code 1 while the registry disagrees with
 * the tree and `--fix` was not given.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from '../lib/context.mjs';
import { blockRuntimeOf, loadRegistry, REGISTRY_FILE, validateRegistry } from '../lib/registry.mjs';
import { composableBlocks, flattenBlocks } from '../model/lib/snapshot.mjs';

/** Code signals a derived entry is read from: plain substrings, no regular expressions over source. */
const SIGNALS = {
	overlay: ['FocusTrap', 'focusTrap', 'Feature.Balloon', 'Keycodes.Escape', 'isOpen'],
	composite: ['Keycodes.ArrowDown', 'Keycodes.ArrowUp', 'Keycodes.ArrowLeft', 'Keycodes.ArrowRight'],
	feedback: ['AriaLive', 'aria-live', 'RoleAlert', 'RoleStatus', 'Progressbar', 'AriaBusy', 'aria-busy'],
	interactive: ['Keycodes', 'click', 'focus(', 'FocusTrap'],
	cssInteractive: [':hover', ':focus', '.is-active', '[disabled]', ':disabled'],
	cssLoading: ['is-loading', 'skeleton', 'spinner'],
	cssValidating: ['not-valid', 'is-invalid', 'has-error'],
};

/**
 * @param {string} text
 * @param {readonly string[]} needles
 */
function has(text, needles) {
	for (const n of needles) if (text.includes(n)) return true;
	return false;
}

/**
 * A registry entry derived from what the code shows: the defaults the evals would otherwise apply
 * silently, made explicit and flagged for review.
 * @param {{ kind: import('../lib/kinds.mjs').Kind, name: string, providerDirs?: string[], text?: string, css?: string }} c
 * @returns {import('../lib/registry.mjs').Entry}
 */
export function suggestEntry({ kind, name, providerDirs = [], text = '', css = '' }) {
	// a utility family or helper class has classes, not states: its kind is the whole classification
	if (kind === 'utility') return { kind, derived: true };
	if (kind !== 'pattern') return suggestStyledEntry(kind, css);
	if (name.endsWith('Events')) return { kind: 'pattern', roles: ['no-dom'], derived: true };
	const roles = [];
	if (providerDirs.length) roles.push('provider');
	if (has(text, SIGNALS.overlay)) roles.push('overlay');
	if (has(text, SIGNALS.composite)) roles.push('composite');
	if (has(text, SIGNALS.feedback)) roles.push('feedback');
	if (roles.length === 0 && !has(text, SIGNALS.interactive)) roles.push('non-interactive');
	return roles.length ? { kind: 'pattern', roles, derived: true } : { kind: 'pattern', derived: true };
}

/**
 * The entry of a CSS-only component or layout partial: the states its compiled CSS styles.
 * @param {import('../lib/kinds.mjs').Kind} kind
 * @param {string} css
 * @returns {import('../lib/registry.mjs').Entry}
 */
function suggestStyledEntry(kind, css) {
	/** @type {import('../lib/registry.mjs').Entry} */
	const e = { kind };
	if (has(css, SIGNALS.cssInteractive)) e.interactive = true;
	if (has(css, SIGNALS.cssLoading)) e.loading = true;
	if (has(css, SIGNALS.cssValidating)) e.validating = true;
	e.derived = true;
	return e;
}

/**
 * Block links the snapshot suggests: a pattern without a `block` entry whose `<Name>API` a block's
 * JavaScript calls, and public blocks whose API calls name no pattern (missing or renamed pattern).
 * @param {string[]} patterns pattern names of the inventory
 * @param {{ components: Record<string, any> }} registry
 * @param {{ key: string, flow: string, name: string, public: boolean, patternHints: { apiCalls: string[] } }[]} blocks
 */
/** `CardSectioned` and `card-sectioned` → `card-sectioned`: one key for a block name and a registry name. @param {string} s */
export function normalizedName(s) {
	let out = '';
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		const upper = c !== c.toLowerCase();
		if (upper && i > 0 && out[out.length - 1] !== '-') out += '-';
		out += c.toLowerCase();
	}
	return out;
}

/**
 * @typedef {{ pattern?: string, style?: string, blocks: { flow: string, name: string }[], source: 'api'|'name' }} LinkProposal
 */

/**
 * Block links the snapshot suggests, for entries without a `block` field: by API call (a block's JavaScript
 * calls `<Pattern>API`), then by exact normalised name (`Content/Card` ↔ `card`, `Utilities/SwipeEvents` ↔
 * `SwipeEvents`). Also the blocks whose API calls name no pattern, and the composable blocks left with no
 * runtime at all. Callers pass the composable set.
 * @param {string[]} patterns pattern names of the inventory
 * @param {string[]} styles names of the registry's CSS-only components and layout partials
 * @param {{ components: Record<string, any> }} registry
 * @param {{ key: string, flow: string, name: string, public: boolean, patternHints: { apiCalls: string[] } }[]} blocks
 * @returns {{ proposals: LinkProposal[], orphans: { key: string, apiCalls: string[] }[], unlinked: string[] }}
 */
export function blockHintsFor(patterns, styles, registry, blocks) {
	const unlinkedEntry = (/** @type {string} */ name) => (registry.components[name]?.block ?? []).length === 0;
	const { proposals, orphans } = apiProposals(patterns, blocks, unlinkedEntry);
	const unlinked = nameProposals(patterns, styles, registry, blocks, proposals, unlinkedEntry);
	return { proposals, orphans, unlinked };
}

/**
 * Proposals from the API calls of the blocks' JavaScript, for patterns with no link yet; and the blocks whose
 * API calls name no pattern.
 * @param {string[]} patterns
 * @param {{ key: string, flow: string, name: string, patternHints: { apiCalls: string[] } }[]} blocks
 * @param {(name: string) => boolean} unlinkedEntry
 * @returns {{ proposals: LinkProposal[], orphans: { key: string, apiCalls: string[] }[] }}
 */
function apiProposals(patterns, blocks, unlinkedEntry) {
	const byApi = new Map(patterns.map((p) => [`${p}API`, p]));
	/** @type {Map<string, { flow: string, name: string }[]>} */
	const hinted = new Map();
	/** @type {{ key: string, apiCalls: string[] }[]} */
	const orphans = [];
	for (const b of blocks) {
		const unknown = b.patternHints.apiCalls.filter((api) => !byApi.has(api));
		if (unknown.length) orphans.push({ key: b.key, apiCalls: unknown });
		for (const api of b.patternHints.apiCalls) {
			const pattern = byApi.get(api);
			if (!pattern) continue;
			const found = hinted.get(pattern) ?? [];
			found.push({ flow: b.flow, name: b.name });
			hinted.set(pattern, found);
		}
	}
	const proposals = patterns
		.filter((p) => hinted.has(p) && unlinkedEntry(p))
		.map((p) => ({
			pattern: p,
			blocks: /** @type {{ flow: string, name: string }[]} */ (hinted.get(p)),
			source: /** @type {const} */ ('api'),
		}));
	return { proposals, orphans };
}

/**
 * Proposals by exact normalised name for the blocks with no runtime and no API proposal; appended to
 * `proposals`. Returns the keys of the blocks left unlinked.
 * @param {string[]} patterns
 * @param {string[]} styles
 * @param {{ components: Record<string, any> }} registry
 * @param {{ key: string, flow: string, name: string }[]} blocks
 * @param {LinkProposal[]} proposals
 * @param {(name: string) => boolean} unlinkedEntry
 */
function nameProposals(patterns, styles, registry, blocks, proposals, unlinkedEntry) {
	const proposedBlocks = new Set(proposals.flatMap((p) => p.blocks.map((b) => `${b.flow}/${b.name}`)));
	/** @type {Map<string, { pattern?: string, style?: string }>} */
	const byNorm = new Map();
	for (const p of patterns) byNorm.set(normalizedName(p), { pattern: p });
	for (const s of styles) byNorm.set(normalizedName(s), { style: s });
	/** @type {string[]} */
	const unlinked = [];
	for (const b of blocks) {
		const runtime = blockRuntimeOf(registry, b.flow, b.name);
		if (runtime.pattern || runtime.style || proposedBlocks.has(b.key)) continue;
		const hit = byNorm.get(normalizedName(b.name));
		const entry = hit?.pattern ?? hit?.style;
		if (!hit || !entry || !unlinkedEntry(entry)) {
			unlinked.push(b.key);
			continue;
		}
		const existing = proposals.find((p) => (p.pattern ?? p.style) === entry);
		if (existing) existing.blocks.push({ flow: b.flow, name: b.name });
		else proposals.push({ ...hit, blocks: [{ flow: b.flow, name: b.name }], source: 'name' });
	}
	return unlinked;
}

/** The block-links section of the doctor output: information, never a disagreement. @param {any} r */
export function renderDoctorBlocks(r) {
	const hints = r.blockHints ?? { proposals: [], orphans: [], unlinked: [] };
	const unlinked = hints.unlinked ?? [];
	if (hints.proposals.length === 0 && hints.orphans.length === 0 && unlinked.length === 0) return '';
	const lines = ['### 🧩 Block links', ''];
	for (const p of hints.proposals) {
		const blocks = p.blocks.map((/** @type {any} */ b) => `${b.flow}/${b.name}`).join(', ');
		const how = p.source === 'name' ? 'matches it by name' : "the snapshot's JavaScript calls its API from it";
		lines.push(`- \`${p.pattern ?? p.style}\` has no block link; ${blocks}: ${how}`);
	}
	if (unlinked.length) {
		lines.push(
			`- Unlinked composable blocks (pure OML, or a name the registry does not use): ${unlinked.join(', ')}`
		);
	}
	for (const o of hints.orphans) {
		lines.push(`- block \`${o.key}\` calls ${o.apiCalls.join(', ')}, which no pattern provides`);
	}
	lines.push(
		'',
		'Run `npm run evals:doctor -- --fix` to append single-block proposals as derived links (a pattern link then needs its `paramMap`), then review.'
	);
	return lines.join('\n');
}

/**
 * @param {import('../lib/context.mjs').EvalContext} ctx
 * @param {import('../lib/registry.mjs').Registry} registry
 */
export function diagnose(ctx, registry) {
	const v = validateRegistry(registry, ctx.inventory);
	const unknown = v.unknown.map((u) => {
		if (u.kind === 'pattern') {
			const p = /** @type {any} */ (ctx.inventory.patterns.find((x) => x.name === u.name));
			const text = [...p.contractFiles, ...p.typingFiles]
				.map((/** @type {string} */ f) => ctx.readText(f))
				.join('\n');
			return {
				...u,
				suggested: suggestEntry({ kind: 'pattern', name: u.name, providerDirs: p.providerDirs, text }),
			};
		}
		const c = /** @type {any} */ (ctx.inventory.cssComponents.find((x) => x.name === u.name));
		const kind = /** @type {import('../lib/kinds.mjs').Kind} */ (u.kind);
		return {
			...u,
			suggested: suggestEntry({ kind, name: u.name, css: ctx.compiledCss(c.scssFile).css ?? '' }),
		};
	});
	// utility classes have no anatomy to render: no story is expected of them
	const noStory = [
		...ctx.inventory.patterns.filter((p) => !p.storyFile).map((p) => p.name),
		...ctx.inventory.cssComponents
			.filter((c) => !c.storyFile && !c.host && c.kind !== 'utility')
			.map((c) => c.name),
	];
	const blocks = composableBlocks(flattenBlocks(ctx.modelSnapshots()));
	const blockHints = blockHintsFor(
		ctx.inventory.patterns.map((p) => p.name),
		ctx.inventory.cssComponents.filter((c) => c.kind === 'component' || c.kind === 'layout').map((c) => c.name),
		registry,
		blocks
	);
	return {
		unknown,
		blockHints,
		stale: v.stale,
		badRoles: v.badRoles,
		badKinds: v.badKinds,
		kindMismatch: v.kindMismatch,
		kindOverride: v.kindOverride,
		noStory,
	};
}

/** Whether the registry and the tree disagree in a way that fails the registry test. @param {ReturnType<typeof diagnose>} r */
export function disagrees(r) {
	return r.unknown.length + r.stale.length + r.badRoles.length + r.badKinds.length + r.kindMismatch.length > 0;
}

/**
 * Markdown section for the PR comment; empty when the registry and the tree agree.
 * @param {ReturnType<typeof diagnose>} r
 */
export function renderDoctor(r) {
	if (!disagrees(r)) return '';
	const lines = ['### 🩺 Component registry', ''];
	if (r.unknown.length) {
		lines.push(
			`${r.unknown.length} component(s) the evals discovered but \`evals/components.json\` does not classify; scored with these derived defaults until reviewed:`,
			''
		);
		for (const u of r.unknown) {
			const { kind, derived, ...rest } = u.suggested;
			lines.push(`- \`${u.name}\` (${kind}): \`${JSON.stringify(rest)}\``);
		}
		lines.push('');
	}
	const code = (/** @type {string} */ s) => `\`${s}\``;
	if (r.stale.length) lines.push(`Entries without a component: ${r.stale.map((n) => code(n)).join(', ')}.`, '');
	if (r.kindMismatch.length) {
		const mismatches = r.kindMismatch.map((k) => `${code(k.name)} is ${k.inventory}, registered as ${k.registry}`);
		lines.push(`Kind mismatches: ${mismatches.join('; ')}.`, '');
	}
	if (r.badRoles.length) {
		const roles = r.badRoles.map((b) => `${code(b.name)} → ${b.role}`);
		lines.push(`Unknown roles: ${roles.join(', ')}.`, '');
	}
	if (r.badKinds.length) {
		const kinds = r.badKinds.map((b) => `${code(b.name)} → ${b.kind}`);
		lines.push(`Unknown kinds (pattern, component, layout, utility): ${kinds.join(', ')}.`, '');
	}
	if (r.noStory.length)
		lines.push(`Without a Storybook story (E07 cannot measure them): ${r.noStory.join(', ')}.`, '');
	lines.push(
		'Run `npm run evals:doctor -- --fix` to append the derived entries (flagged `derived: true`) and drop the stale ones, review them, then commit `evals/components.json`.'
	);
	const blocksSection = renderDoctorBlocks(r);
	return blocksSection ? `${lines.join('\n')}\n\n${blocksSection}` : lines.join('\n');
}

/**
 * The registry with the derived entries appended and the stale ones removed, sorted by name.
 * @param {import('../lib/registry.mjs').Registry} registry
 * @param {ReturnType<typeof diagnose>} r
 * @returns {import('../lib/registry.mjs').Registry}
 */
export function applyFixes(registry, r) {
	/** @type {Record<string, import('../lib/registry.mjs').Entry>} */
	const components = { ...registry.components };
	for (const name of r.stale) delete components[name];
	for (const u of r.unknown) components[u.name] = u.suggested;
	for (const p of r.blockHints?.proposals ?? []) {
		const entry = p.pattern ?? p.style;
		if (p.blocks.length !== 1 || !entry || !components[entry]) continue;
		const link = p.pattern ? { ...p.blocks[0], paramMap: {}, derived: true } : { ...p.blocks[0], derived: true };
		components[entry] = { ...components[entry], block: [link] };
	}
	const sorted = Object.fromEntries(Object.entries(components).sort(([a], [b]) => a.localeCompare(b)));
	return { ...registry, components: sorted };
}

function main() {
	const flags = new Set(process.argv.slice(2));
	const fix = flags.has('--fix');
	const markdown = flags.has('--markdown');
	const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
	const ctx = createContext(root);
	const registry = loadRegistry();
	const r = diagnose(ctx, registry);
	const disagree = disagrees(r);
	if (markdown) {
		process.stdout.write(renderDoctor(r));
		return;
	}
	const proposals = r.blockHints.proposals.filter((p) => p.blocks.length === 1).length;
	if (fix && (disagree || proposals > 0)) {
		const raw = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
		const fixed = applyFixes(registry, r);
		fs.writeFileSync(REGISTRY_FILE, `${JSON.stringify({ ...raw, components: fixed.components }, null, '\t')}\n`);
		process.stdout.write(
			`components.json: ${r.unknown.length} derived entr${r.unknown.length === 1 ? 'y' : 'ies'} appended (review the derived: true flags), ${r.stale.length} stale removed, ${proposals} derived block link(s) added.\n`
		);
		return;
	}
	const noStory = r.noStory.length ? ` Without a story: ${r.noStory.join(', ')}.` : '';
	const body = renderDoctor(r).replace(/^### 🩺 Component registry\n\n/, '');
	const blocksSection = renderDoctorBlocks(r);
	const blocksTail = blocksSection ? `${blocksSection}\n` : '';
	const agreeLine = `components.json classifies every component the inventory discovers (${Object.keys(registry.components).length}).${noStory}\n`;
	process.stdout.write(disagree ? `${body}\n` : agreeLine + blocksTail);
	process.exitCode = disagree ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
