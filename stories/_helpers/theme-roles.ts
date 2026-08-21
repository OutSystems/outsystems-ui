/**
 * Shared catalog of the framework's themeable **role globals** (the `--color-*` /
 * `--border-radius-*` theme-layer contract from `src/scss/01-foundations/_root.scss`,
 * see `.claude/rules/scss.md` §13) plus the small runtime helpers the Theme Editor,
 * the preview decorator, and the manager toolbar all share.
 *
 * Overrides are applied as inline custom properties on `document.documentElement`, so
 * they re-skin every story. Counting/clearing them lives here so the "Reset theme"
 * toolbar button (manager) and the editor (preview) stay in sync via the channel.
 */

export type RoleType = 'color' | 'length';
export type Role = { name: string; label: string; type: RoleType; note?: string };
export type RoleGroup = { id: string; title: string; blurb?: string; roles: Role[] };

export const THEME_ROLE_GROUPS: RoleGroup[] = [
	{
		id: 'brand',
		title: 'Brand',
		blurb: 'Primary brand colour + its interaction shades, and the secondary accent.',
		roles: [
			{ name: '--color-primary', label: 'Primary', type: 'color' },
			{ name: '--color-primary-hover', label: 'Primary · hover', type: 'color' },
			{ name: '--color-primary-selected', label: 'Primary · selected', type: 'color' },
			{
				name: '--color-primary-active',
				label: 'Primary · active',
				type: 'color',
				note: 'solid pressed state — not an alias of selected',
			},
			{ name: '--color-secondary', label: 'Secondary', type: 'color' },
		],
	},
	{
		id: 'status',
		title: 'Status',
		roles: [
			{ name: '--color-error', label: 'Error', type: 'color' },
			{ name: '--color-warning', label: 'Warning', type: 'color' },
			{ name: '--color-success', label: 'Success', type: 'color' },
			{ name: '--color-info', label: 'Info', type: 'color' },
		],
	},
	{
		id: 'surface',
		title: 'Surfaces',
		blurb: 'Page + component backgrounds.',
		roles: [
			{ name: '--color-background-body', label: 'Body', type: 'color' },
			{ name: '--color-background-surface', label: 'Surface (cards, popups…)', type: 'color' },
			{ name: '--color-background-header', label: 'Header', type: 'color' },
			{ name: '--color-background-sidemenu', label: 'Side menu', type: 'color' },
			{ name: '--color-background-footer', label: 'Footer', type: 'color' },
			{ name: '--color-background-login', label: 'Login', type: 'color' },
			{ name: '--color-background-input', label: 'Input', type: 'color' },
			{ name: '--color-background-input-disabled', label: 'Input · disabled', type: 'color' },
		],
	},
	{
		id: 'text',
		title: 'Text',
		roles: [
			{ name: '--color-text', label: 'Default', type: 'color' },
			{ name: '--color-text-subtle', label: 'Subtle', type: 'color' },
			{ name: '--color-text-subtlest', label: 'Subtlest', type: 'color' },
			{ name: '--color-text-disabled', label: 'Disabled', type: 'color' },
			{ name: '--color-text-inverse', label: 'Inverse (on bold bg)', type: 'color' },
		],
	},
	{
		id: 'border',
		title: 'Borders',
		roles: [
			{ name: '--color-border', label: 'Default', type: 'color' },
			{ name: '--color-border-subtle', label: 'Subtle', type: 'color' },
			{ name: '--color-border-subtlest', label: 'Subtlest', type: 'color' },
			{ name: '--color-border-input', label: 'Input', type: 'color' },
			{ name: '--color-border-input-hover', label: 'Input · hover', type: 'color' },
			{ name: '--color-border-input-press', label: 'Input · press', type: 'color' },
			{ name: '--color-border-primary', label: 'Primary (focus rings)', type: 'color' },
		],
	},
	{
		id: 'focus',
		title: 'Focus ring',
		blurb: 'Read by .has-accessible-features :focus — outer is the wash, inner the solid line on top.',
		roles: [
			{ name: '--color-focus-outer', label: 'Outer (wash)', type: 'color' },
			{ name: '--color-focus-inner', label: 'Inner (line)', type: 'color' },
		],
	},
	{
		id: 'neutral',
		title: 'Neutrals',
		blurb: 'The neutral ramp (also read by the TS colour API).',
		roles: [
			{ name: '--color-neutral', label: 'Neutral', type: 'color' },
			...Array.from({ length: 11 }, (_, i) => ({
				name: `--color-neutral-${i}`,
				label: `Neutral ${i}`,
				type: 'color' as const,
			})),
		],
	},
	{
		id: 'palette',
		title: 'Palette',
		blurb: 'The 12 extended families. These are Color static-entity records, so the TS colour API resolves them by name — renaming one breaks low-code.',
		roles: [
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
		].map((c) => ({
			name: `--color-${c}`,
			label: c.charAt(0).toUpperCase() + c.slice(1),
			type: 'color' as const,
		})),
	},
	{
		id: 'transparent',
		title: 'Transparent',
		blurb: 'The 26th Color-entity record. Declared so the entity set does not depend on the TS name-lookup fallback.',
		roles: [{ name: '--color-transparent', label: 'Transparent', type: 'color', note: 'keyword, rarely themed' }],
	},
	{
		id: 'radius',
		title: 'Radius',
		blurb: 'The shape vocabulary. Set "All" to re-radius the whole framework with one value.',
		roles: [
			{
				name: '--border-radius-default',
				label: 'All (master override)',
				type: 'length',
				note: 'unset by default',
			},
			{ name: '--border-radius-none', label: 'None', type: 'length' },
			{ name: '--border-radius-soft', label: 'Soft (controls, flat)', type: 'length' },
			{ name: '--border-radius-softer', label: 'Softer (elevated)', type: 'length' },
			{ name: '--border-radius-rounded', label: 'Rounded (circular)', type: 'length' },
		],
	},
	{
		id: 'space',
		title: 'Spacing',
		blurb: 'The public spacing vocabulary, token-backed onto $token-scale-*. Also read at runtime by Gallery ItemsGap.',
		roles: (
			[
				['none', 'None'],
				['xs', 'XS'],
				['s', 'S'],
				['base', 'Base'],
				['m', 'M'],
				['l', 'L'],
				['xl', 'XL'],
				['xxl', 'XXL'],
			] as const
		).map(([k, label]) => ({ name: `--space-${k}`, label, type: 'length' as const })),
	},
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
