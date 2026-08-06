/**
 * Shared helpers for mirroring OutSystemsUI low-code input parameters as Storybook
 * controls on the CSS-only (renderStatic) patterns.
 *
 * - Param names / types / defaults / descriptions are taken from the library OML
 *   (the block's `InputParameters`).
 * - The value→CSS-class mapping comes from each pattern's SCSS in
 *   src/scss/04-patterns/** (the actual styling contract).
 *
 * Use `cls(...)` to assemble a className from conditional parts, and the shared
 * argTypes below so a given low-code param renders identically across stories.
 */

/** Join class-name parts, dropping falsey ones. `cls('card', x && 'padding-none', extra)`. */
export const cls = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(' ');

/**
 * `Color` / `BackgroundColor` low-code enum → `background-{value}` utility class.
 * Subset of the OUI palette (the full Color static entity is large); '' = none.
 */
export const COLOR_OPTIONS = [
	'',
	'primary',
	'secondary',
	'success',
	'warning',
	'error',
	'info',
	'neutral-0',
	'blue',
	'green',
	'grape',
	'cyan',
];

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
];

/**
 * The FULL `Color` static entity → `background-{value}` utility class: brand,
 * transparent, semantic, neutral-0..10, and the 12-family extended palette in
 * all 7 shades (lightest → darkest). '' = none. Note: IsLight is only
 * meaningful for base colors — combining it with a shade variant (e.g.
 * `red-dark`) yields a class with no CSS rule, mirroring platform behavior.
 */
export const COLOR_OPTIONS_FULL = [
	'',
	'primary',
	'secondary',
	'transparent',
	'error',
	'warning',
	'success',
	'info',
	...Array.from({ length: 11 }, (_, i) => `neutral-${i}`),
	...PALETTE_FAMILIES.flatMap((family) => `${family}`)
];

/** Shared `ExtendedClass` control — present on essentially every OUI block. */
export const extendedClassArgType = {
	name: 'ExtendedClass',
	control: 'text',
	description: 'Add custom style classes to the Pattern (space-separated CSS class names).',
} as const;

/** Shared `UsePadding` control (Card, Section, …). */
export const usePaddingArgType = {
	name: 'UsePadding',
	control: 'boolean',
	description: 'When true, content has padding.',
} as const;
