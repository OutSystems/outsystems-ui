import type { Meta, StoryObj } from '@storybook/html-vite';
import { addons } from 'storybook/preview-api';
import {
	CH_OVERRIDES_CHANGED,
	CH_RESET,
	THEME_ROLE_GROUPS,
	THEME_ROLE_NAMES,
	themeOverrideCount,
	type Role,
} from './_helpers/theme-roles';

/**
 * Theme Editor — tweak the framework's themeable **role globals** live and export CSS.
 *
 * Unlike the design-tokens repo editor (which edits `--token-*` primitives), this one
 * edits the Tier-3 theme-layer roles declared on `:root` in
 * `src/scss/01-foundations/_root.scss` — the `--color-*` and `--border-radius-*` contract
 * a theme is allowed to override (see `.claude/rules/scss.md` §13). Layout plumbing
 * (`--size-*`, `--layer-*`, safe-areas) is intentionally NOT exposed — it isn't theme.
 *
 * How it works (no build step / no generated data):
 *  • Defaults are resolved at runtime by probing the computed value of `var(--role)` on a
 *    throwaway element, so the editor always reflects the real shipped values.
 *  • `:root` inline custom properties are the single source of truth — edits call
 *    `document.documentElement.style.setProperty(--role, value)`, re-skinning every story.
 *  • A change broadcasts its count on the Storybook channel, so the toolbar "Reset theme"
 *    button appears on every story while any override is active. Reset (here or from the
 *    toolbar) removes the inline overrides.
 *  • Export emits a `:root { … }` block of ONLY the roles you changed — paste into a theme.
 */

const ROOT = (): HTMLElement => document.documentElement;
const getChannel = () => addons.getChannel();

// ─── value resolution helpers ────────────────────────────────────────────────

function rgbToHex(rgb: string): string | null {
	const m = rgb.match(/^rgba?\(([^)]+)\)/);
	if (!m) return null;
	const [r, g, b] = m[1].split(',').map((n) => parseFloat(n));
	if ([r, g, b].some(Number.isNaN)) return null;
	const h = (n: number) => Math.round(n).toString(16).padStart(2, '0');
	return `#${h(r)}${h(g)}${h(b)}`;
}

function currentOverride(name: string): string {
	return ROOT().style.getPropertyValue(name);
}
function isChanged(name: string): boolean {
	return currentOverride(name) !== '';
}

/** Resolve a role's value by probing computed style, ignoring any current inline override. */
function resolveDefault(role: Role): string {
	const root = ROOT();
	const override = root.style.getPropertyValue(role.name);
	if (override) root.style.removeProperty(role.name);

	const probe = document.createElement('div');
	probe.style.position = 'absolute';
	probe.style.visibility = 'hidden';
	probe.style.pointerEvents = 'none';
	document.body.appendChild(probe);

	let resolved = '';
	if (role.type === 'color') {
		probe.style.color = `var(${role.name})`;
		resolved = rgbToHex(getComputedStyle(probe).color) ?? '';
	} else {
		// border-radius var may be unset (e.g. --border-radius-default) → treat 0px as "unset".
		probe.style.borderTopLeftRadius = `var(${role.name})`;
		const v = getComputedStyle(probe).borderTopLeftRadius;
		resolved = role.name === '--border-radius-default' && v === '0px' ? '' : v;
	}

	document.body.removeChild(probe);
	if (override) root.style.setProperty(role.name, override);
	return resolved;
}

function applyOverride(name: string, value: string): void {
	ROOT().style.setProperty(name, value);
}
function clearOverride(name: string): void {
	ROOT().style.removeProperty(name);
}
function emitState(): void {
	try {
		getChannel().emit(CH_OVERRIDES_CHANGED, themeOverrideCount());
	} catch {
		/* channel not ready */
	}
}

function buildCss(): string {
	const names = THEME_ROLE_NAMES.filter(isChanged);
	if (names.length === 0) return '/* No overrides yet — tweak a value to populate this. */';
	return `:root {\n${names.map((n) => `\t${n}: ${currentOverride(n).trim()};`).join('\n')}\n}`;
}

// ─── DOM building ──────────────────────────────────────────────────────────────

const STYLE = `
.osui-theme-editor { --te-fg:#242424; --te-muted:#626262; --te-line:#e0e0e0; --te-bg:#fff; --te-chip:#f3f3f3;
	font: 13px/1.5 'Inter', system-ui, sans-serif; color: var(--te-fg); display: grid; gap: 16px;
	box-sizing: border-box; height: 100vh; overflow-y: auto; padding: 16px; align-content: start; }
.osui-theme-editor * { box-sizing: border-box; }
.te-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.te-toolbar h1 { font-size: 18px; font-weight: 700; margin: 0; flex: 1; }
.te-btn { font: inherit; font-weight: 600; cursor: pointer; border: 1px solid var(--te-line); background: var(--te-bg);
	border-radius: 8px; padding: 7px 12px; color: var(--te-fg); }
.te-btn:hover { background: var(--te-chip); }
.te-btn--primary { background: #105cef; border-color: #105cef; color: #fff; }
.te-btn--primary:hover { background: #0f54da; }
.te-feedback { color: var(--te-muted); font-weight: 600; }
.te-layout { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(280px,1fr); gap: 16px; align-items: start; }
@media (max-width: 900px) { .te-layout { grid-template-columns: 1fr; } }
.te-controls { display: grid; gap: 8px; }
.te-group { border: 1px solid var(--te-line); border-radius: 10px; background: var(--te-bg); overflow: hidden; }
.te-group > summary { cursor: pointer; list-style: none; padding: 12px 14px; font-weight: 700;
	display: flex; align-items: center; gap: 8px; }
.te-group > summary::-webkit-details-marker { display: none; }
.te-group > summary::before { content: '›'; transition: transform .15s ease; color: var(--te-muted); font-size: 16px; }
.te-group[open] > summary::before { transform: rotate(90deg); }
.te-group__blurb { color: var(--te-muted); font-weight: 400; font-size: 12px; }
.te-rows { display: grid; gap: 2px; padding: 0 14px 12px; }
.te-row { display: grid; grid-template-columns: 1fr auto; gap: 8px 12px; align-items: center; padding: 6px 0;
	border-top: 1px solid var(--te-line); }
.te-row__meta { display: grid; gap: 3px; min-width: 0; }
.te-row__label { font-weight: 600; }
.te-row code { font-size: 11px; color: var(--te-muted); background: var(--te-chip); padding: 1px 6px; border-radius: 5px;
	justify-self: start; }
.te-row__controls { display: flex; align-items: center; gap: 6px; }
.te-row input[type=color] { width: 30px; height: 30px; padding: 0; border: 1px solid var(--te-line); border-radius: 6px;
	background: none; cursor: pointer; }
.te-row input[type=text] { font: inherit; width: 116px; border: 1px solid var(--te-line); border-radius: 6px;
	padding: 5px 8px; color: var(--te-fg); }
.te-row__reset { border: 0; background: none; cursor: pointer; color: var(--te-muted); font-size: 15px; padding: 2px 4px;
	visibility: hidden; line-height: 1; }
.te-row--changed .te-row__reset { visibility: visible; }
.te-row--changed .te-row__label::after { content: '•'; color: #105cef; margin-left: 6px; }
.te-side { display: grid; gap: 16px; position: sticky; top: 8px; }
.te-preview { border: 1px solid var(--te-line); border-radius: 10px; padding: 16px; display: grid; gap: 12px;
	background: var(--color-background-body); }
.te-preview__row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.te-swatches { display: flex; gap: 6px; flex-wrap: wrap; }
.te-swatch { width: 26px; height: 26px; border-radius: 6px; border: 1px solid rgba(0,0,0,.12); }
.te-output > summary { cursor: pointer; list-style: none; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.te-output > summary::-webkit-details-marker { display: none; }
.te-output > summary::before { content: '›'; transition: transform .15s ease; color: var(--te-muted); }
.te-output[open] > summary::before { transform: rotate(90deg); }
.te-output { border: 1px solid var(--te-line); border-radius: 10px; padding: 12px 14px; background: var(--te-bg); }
.te-output pre { background: #1e1e1e; color: #e6e6e6; border-radius: 8px; padding: 12px; overflow: auto; margin: 10px 0 0;
	font: 12px/1.5 ui-monospace, monospace; max-height: 320px; }
`;

function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	props: Partial<HTMLElementTagNameMap[K]> = {},
	...kids: (Node | string)[]
): HTMLElementTagNameMap[K] {
	const node = document.createElement(tag);
	Object.assign(node, props);
	kids.forEach((k) => node.append(k));
	return node;
}

function buildRow(role: Role, onAnyChange: () => void): { row: HTMLElement; sync: () => void } {
	const def = resolveDefault(role);
	const current = currentOverride(role.name) || def;

	const label = el('div', { className: 'te-row__label', textContent: role.label });
	const chip = el('code', { textContent: role.name });
	const meta = el('div', { className: 'te-row__meta' }, label, chip);

	const text = el('input', { type: 'text', value: current, placeholder: role.note ?? def });
	const controls = el('div', { className: 'te-row__controls' });

	let color: HTMLInputElement | null = null;
	if (role.type === 'color') {
		color = el('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(current) ? current : def || '#000000' });
		controls.append(color);
	}
	controls.append(text);

	const reset = el('button', { className: 'te-row__reset', title: 'Reset to default', textContent: '↺' });
	controls.append(reset);

	const row = el('div', { className: 'te-row' }, meta, controls);

	const markChanged = () => row.classList.toggle('te-row--changed', isChanged(role.name));
	const sync = () => {
		const v = currentOverride(role.name) || def;
		text.value = v;
		if (color && /^#[0-9a-f]{6}$/i.test(v)) color.value = v;
		markChanged();
	};

	if (color) {
		color.addEventListener('input', () => {
			text.value = color!.value;
			applyOverride(role.name, color!.value);
			markChanged();
			onAnyChange();
		});
	}
	text.addEventListener('input', () => {
		const v = text.value.trim();
		if (v === '') clearOverride(role.name);
		else {
			applyOverride(role.name, v);
			if (color && /^#[0-9a-f]{6}$/i.test(v)) color.value = v;
		}
		markChanged();
		onAnyChange();
	});
	reset.addEventListener('click', () => {
		clearOverride(role.name);
		sync();
		onAnyChange();
	});

	markChanged();
	return { row, sync };
}

function buildPreview(): HTMLElement {
	const preview = el('div', { className: 'te-preview' });
	preview.innerHTML = `
		<div style="font-weight:700;color:var(--color-text);">Live preview</div>
		<div class="card" style="display:grid;gap:8px;">
			<div style="font-weight:600;color:var(--color-text);">Card title</div>
			<div style="color:var(--color-text-subtle);">Body text on a surface, inside a bordered card.</div>
		</div>
		<div class="te-preview__row">
			<button class="btn btn-primary" type="button">Primary</button>
			<button class="btn" type="button">Default</button>
		</div>
		<div class="te-preview__row">
			<input class="form-control" data-input type="text" placeholder="Input field" />
		</div>
		<div class="te-swatches">
			${['error', 'warning', 'success', 'info']
				.map((s) => `<span class="te-swatch" title="--color-${s}" style="background:var(--color-${s})"></span>`)
				.join('')}
		</div>`;
	return preview;
}

// Module-level handle so re-renders don't stack channel listeners.
let editorResync: (() => void) | null = null;

function buildEditor(): HTMLElement {
	const wrap = el('div', { className: 'osui-theme-editor' });
	wrap.append(el('style', { textContent: STYLE }));

	const feedback = el('span', { className: 'te-feedback' });
	const outputPre = el('pre');
	const syncers: Array<() => void> = [];

	const refreshOutput = () => {
		outputPre.textContent = buildCss();
	};
	const onAnyChange = () => {
		refreshOutput();
		emitState();
	};
	const resyncAll = () => {
		syncers.forEach((s) => s());
		refreshOutput();
	};

	// Toolbar
	const resetAll = el('button', { className: 'te-btn', textContent: 'Reset all', type: 'button' });
	const copyBtn = el('button', { className: 'te-btn te-btn--primary', textContent: 'Copy CSS', type: 'button' });
	resetAll.addEventListener('click', () => {
		THEME_ROLE_NAMES.forEach(clearOverride);
		resyncAll();
		emitState();
		feedback.textContent = 'Reset.';
		setTimeout(() => (feedback.textContent = ''), 1500);
	});
	copyBtn.addEventListener('click', async () => {
		try {
			await navigator.clipboard.writeText(buildCss());
			feedback.textContent = THEME_ROLE_NAMES.some(isChanged) ? 'Copied!' : 'Copied (no overrides yet).';
		} catch {
			feedback.textContent = 'Copy failed — select the output manually.';
		}
		setTimeout(() => (feedback.textContent = ''), 1800);
	});
	wrap.append(
		el('div', { className: 'te-toolbar' }, el('h1', { textContent: 'Theme Editor' }), feedback, resetAll, copyBtn)
	);

	// Controls
	const controls = el('div', { className: 'te-controls' });
	THEME_ROLE_GROUPS.forEach((group) => {
		const details = el('details', { className: 'te-group' });
		if (['brand', 'status', 'surface'].includes(group.id)) details.open = true;
		const summary = el('summary');
		summary.append(document.createTextNode(group.title));
		if (group.blurb) summary.append(el('span', { className: 'te-group__blurb', textContent: ` — ${group.blurb}` }));
		details.append(summary);

		const rows = el('div', { className: 'te-rows' });
		group.roles.forEach((role) => {
			const { row, sync } = buildRow(role, onAnyChange);
			syncers.push(sync);
			rows.append(row);
		});
		details.append(rows);
		controls.append(details);
	});

	// Output
	const output = el('details', { className: 'te-output' });
	output.append(el('summary', { textContent: 'CSS output (changed roles only)' }), outputPre);
	refreshOutput();

	const side = el('div', { className: 'te-side' }, buildPreview(), output);
	wrap.append(el('div', { className: 'te-layout' }, controls, side));

	// Re-sync the inputs when a reset is triggered elsewhere (the toolbar button).
	// preview.ts clears :root on CH_RESET first, so reading current values here is correct.
	try {
		const ch = getChannel();
		if (editorResync) ch.off(CH_RESET, editorResync);
		editorResync = () => resyncAll();
		ch.on(CH_RESET, editorResync);
	} catch {
		/* channel not ready */
	}

	// Announce current state so the toolbar button reflects it immediately.
	emitState();
	return wrap;
}

const meta: Meta = {
	title: 'Theme Editor',
	tags: ['!ui-pending'],
	// The editor IS the controls — hide Storybook's addon panel, and run fullscreen so the
	// editor owns the viewport (the OUI app shell pins height:100%/overflow:hidden, so the
	// editor scrolls itself rather than getting clipped).
	parameters: { layout: 'fullscreen', options: { showPanel: false } },
};
export default meta;

export const Editor: StoryObj = {
	name: 'Theme Editor',
	render: () => buildEditor(),
};
