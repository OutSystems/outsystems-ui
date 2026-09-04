/**
 * Shared catalog of the framework's themeable **role globals** (the `--color-*` /
 * `--border-radius-*` / `--space-*` theme-layer contract from
 * `src/scss/01-foundations/_root.scss`, see `.claude/rules/scss.md` §13) plus the small
 * runtime helpers the Theme Editor, the preview decorator, and the manager toolbar share.
 *
 * Overrides are applied as inline custom properties on `document.documentElement`, so
 * they re-skin every story. Counting/clearing them lives here so the "Reset theme"
 * toolbar button (manager) and the editor (preview) stay in sync via the channel.
 *
 * The catalog is data, so it is written as `[name, label, note?]` tuples fed through
 * `group()` rather than repeated object literals — the type is carried once per group
 * instead of once per role.
 */

export type RoleType = 'color' | 'length';
export type Role = { name: string; label: string; type: RoleType; note?: string };
export type RoleGroup = { id: string; title: string; blurb?: string; roles: Role[] };

/** `[cssVarName, label, note?]` */
type Entry = readonly [string, string, string?];
type GroupMeta = { id: string; title: string; type: RoleType; blurb?: string };

const group = ({ id, title, type, blurb }: GroupMeta, entries: readonly Entry[]): RoleGroup => ({
	id,
	title,
	...(blurb === undefined ? {} : { blurb }),
	roles: entries.map(([name, label, note]) =>
		note === undefined ? { name, label, type } : { name, label, type, note }
	),
});

const NEUTRAL_STEPS = 11;
const PALETTE_FAMILIES = [
	'red',
	'orange',
	'yellow',
	'lime',
	'green',
	'teal',
	'cyan',
	'blue',
	'indigo',
	'violet',
	'grape',
	'pink',
] as const;
const SPACE_STEPS: readonly Entry[] = [
	['--space-none', 'None'],
	['--space-xs', 'XS'],
	['--space-s', 'S'],
	['--space-base', 'Base'],
	['--space-m', 'M'],
	['--space-l', 'L'],
	['--space-xl', 'XL'],
	['--space-xxl', 'XXL'],
];

const titleCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const THEME_ROLE_GROUPS: RoleGroup[] = [
	group(
		{
			id: 'brand',
			title: 'Brand',
			type: 'color',
			blurb: 'Primary brand colour + its interaction shades, and the secondary accent.',
		},
		[
			['--color-primary', 'Primary'],
			['--color-primary-hover', 'Primary · hover'],
			['--color-primary-selected', 'Primary · selected'],
			['--color-primary-active', 'Primary · active', 'solid pressed state — not an alias of selected'],
			['--color-secondary', 'Secondary'],
		]
	),
	group({ id: 'status', title: 'Status', type: 'color' }, [
		['--color-error', 'Error'],
		['--color-warning', 'Warning'],
		['--color-success', 'Success'],
		['--color-info', 'Info'],
	]),
	group({ id: 'surface', title: 'Surfaces', type: 'color', blurb: 'Page + component backgrounds.' }, [
		['--color-background-body', 'Body'],
		['--color-background-surface', 'Surface (cards, popups…)'],
		['--color-background-header', 'Header'],
		['--color-background-sidemenu', 'Side menu'],
		['--color-background-footer', 'Footer'],
		['--color-background-login', 'Login'],
		['--color-background-input', 'Input'],
		['--color-background-input-disabled', 'Input · disabled'],
	]),
	group({ id: 'text', title: 'Text', type: 'color' }, [
		['--color-text', 'Default'],
		['--color-text-subtle', 'Subtle'],
		['--color-text-subtlest', 'Subtlest'],
		['--color-text-disabled', 'Disabled'],
		['--color-text-inverse', 'Inverse (on bold bg)'],
		['--color-text-light', 'Light (always white)'],
		['--color-text-dark', 'Dark (always near-black)'],
	]),
	group({ id: 'border', title: 'Borders', type: 'color' }, [
		['--color-border', 'Default'],
		['--color-border-subtle', 'Subtle'],
		['--color-border-subtlest', 'Subtlest'],
		['--color-border-input', 'Input'],
		['--color-border-input-hover', 'Input · hover'],
		['--color-border-input-press', 'Input · press'],
		['--color-border-primary', 'Primary (focus rings)'],
	]),
	group(
		{
			id: 'focus',
			title: 'Focus ring',
			type: 'color',
			blurb: 'Read by .has-accessible-features :focus — outer is the wash, inner the solid line on top.',
		},
		[
			['--color-focus-outer', 'Outer (wash)'],
			['--color-focus-inner', 'Inner (line)'],
		]
	),
	group(
		{
			id: 'neutral',
			title: 'Neutrals',
			type: 'color',
			blurb: 'The neutral ramp (also read by the TS colour API).',
		},
		[
			['--color-neutral', 'Neutral'],
			...Array.from({ length: NEUTRAL_STEPS }, (_, i): Entry => [`--color-neutral-${i}`, `Neutral ${i}`]),
		]
	),
	group(
		{
			id: 'palette',
			title: 'Palette',
			type: 'color',
			blurb: 'The 12 extended families. These are Color static-entity records, so the TS colour API resolves them by name — renaming one breaks low-code.',
		},
		PALETTE_FAMILIES.map((c): Entry => [`--color-${c}`, titleCase(c)])
	),
	group(
		{
			id: 'radius',
			title: 'Radius',
			type: 'length',
			blurb: 'The shape vocabulary. Set "All" to re-radius the whole framework with one value.',
		},
		[
			['--border-radius-default', 'All (master override)', 'unset by default'],
			['--border-radius-none', 'None'],
			['--border-radius-soft', 'Soft (controls, flat)'],
			['--border-radius-softer', 'Softer (elevated)'],
			['--border-radius-rounded', 'Rounded (circular)'],
		]
	),
	group(
		{
			id: 'space',
			title: 'Spacing',
			type: 'length',
			blurb: 'The public spacing vocabulary, token-backed onto $token-scale-*. Also read at runtime by Gallery ItemsGap.',
		},
		SPACE_STEPS
	),
];

export const THEME_ROLE_NAMES: string[] = THEME_ROLE_GROUPS.flatMap((g) => g.roles.map((r) => r.name));

// Channel events bridging the editor/preview and the manager toolbar.
export const CH_OVERRIDES_CHANGED = 'osui/theme-overrides-changed'; // preview → manager: { count }
export const CH_RESET = 'osui/theme-reset'; // manager → preview: clear all
export const CH_STATE_REQUEST = 'osui/theme-state-request'; // manager → preview: re-emit count

/** How many themeable roles are currently overridden inline on :root. */
export function themeOverrideCount(): number {
	const root = document.documentElement;
	return THEME_ROLE_NAMES.filter((n) => root.style.getPropertyValue(n) !== '').length;
}

/** Remove every themeable-role inline override from :root. */
export function clearThemeOverrides(): void {
	const root = document.documentElement;
	THEME_ROLE_NAMES.forEach((n) => root.style.removeProperty(n));
}
