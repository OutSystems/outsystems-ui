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
 * Extended palette families — the 12 `$osui-colors-extended` keys in
 * src/scss/00-abstract/_setup-global-vars.scss, in Color static-entity order.
 */
export const PALETTE_COLOR_OPTIONS = [
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

/** Neutral ramp — `$osui-colors-neutral` keys, emitted as `background-neutral-{n}`. */
export const NEUTRAL_COLOR_OPTIONS = Array.from({ length: 11 }, (_, i) => `neutral-${i}`);

/**
 * `Color` / `BackgroundColor` low-code enum → `background-{value}` utility class.
 * These are exactly the records of the OUI `Color` static entity: Primary, Secondary,
 * the 12 palette families, Transparent, Neutral0–Neutral10. The semantic roles
 * (success / warning / error / info) exist as `background-*` classes but are NOT Color
 * records, so they are deliberately absent. '' = no class, i.e. the pattern's own default.
 */
export const COLOR_OPTIONS = [
	'',
	'primary',
	'secondary',
	...PALETTE_COLOR_OPTIONS,
	'transparent',
	...NEUTRAL_COLOR_OPTIONS,
];

/**
 * `Space` low-code enum → the `-{value}` suffix of the space utility classes
 * (`padding-top-base`, `margin-l`, …). Mirrors `$osui-sizes` in
 * src/scss/00-abstract/_setup-global-vars.scss.
 */
export const SPACE_OPTIONS = ['none', 'xs', 's', 'base', 'm', 'l', 'xl', 'xxl'];

/** Color records with no lighter/darker variants — they render as-is whatever IsLight says. */
const COLORS_WITHOUT_VARIANTS = new Set(['transparent']);

/** Neutrals whose `text-*` class has no `-darker` twin (the ramp only emits it above 4). */
const NEUTRALS_WITHOUT_DARKER = new Set(['neutral-0', 'neutral-1', 'neutral-2', 'neutral-3', 'neutral-4']);

/**
 * `Color` (+ optional `IsLight`) → `background-*` utility class.
 * IsLight selects the `-lightest` variant, which every record has except `transparent`.
 */
export const backgroundClass = (color: string, isLight = false): string => {
	if (!color) {
		return '';
	}
	return isLight && !COLORS_WITHOUT_VARIANTS.has(color) ? `background-${color}-lightest` : `background-${color}`;
};

/**
 * Text colour that pairs with a `-lightest` background (Tag, UserAvatar): the `-darker`
 * variant where one exists, the plain `text-*` class for neutral-0…4, nothing for
 * `transparent`.
 */
export const lightTextClass = (color: string): string => {
	if (!color || COLORS_WITHOUT_VARIANTS.has(color)) {
		return '';
	}
	return NEUTRALS_WITHOUT_DARKER.has(color) ? `text-${color}` : `text-${color}-darker`;
};

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
