import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';
import { extendedClassArgType } from './_helpers/lowcode';

/**
 * Spinner — controls mirror the low-code input parameters of the `Spinner` block
 * (docs-internal/spinner-pattern-design.md §3.1), ported from the Mobile UI Spinner.
 *   AnimationType :: SpinnerAnimationType Identifier :: Default
 *   Color         :: Text, any color :: "" (theme default)
 *   Size          :: SpinnerSize Identifier :: Xsmall
 *   ExtendedClass :: Text :: ""
 *
 * Runtime contract (src/scripts/OSFramework/OSUI/Pattern/Spinner):
 *  • The root is located by `name=<id>`. The block authors the glyph markup: one
 *    `<svg class="osui-spinner__<type>">` with identical child shapes (dots 3, lines 8, lines-sharp 12,
 *    bubbles 9, circle 8, circular 1, crescent 1); `default` renders both the lines and the circular glyph
 *    and CSS picks one through the platform's `ios` body class. The story template reproduces that markup.
 *  • The pattern only applies `osui-spinner--{type}` and `osui-spinner--{size}`, the inline
 *    `--osui-spinner-color` and `role="progressbar"`. The accessible name (`aria-label`) is a translatable
 *    literal in the block, so the template carries it.
 *  • Geometry (rotation, stagger delays) is CSS `nth-child`, in
 *    src/scss/04-patterns/06-utilities/spinner/_spinner.scss. CSS API: `--osui-spinner-color`,
 *    `--osui-spinner-size`, `--osui-spinner-stroke-width`. Keyframes: src/scss/07-keyframes/_spinner.scss.
 *  • Color: a theme colour name becomes `var(--color-<name>)` and follows dark mode; anything else is used as-is.
 *
 * Chromatic: keep the default first-frame reset. Do not set `pauseAnimationAtEnd` — the last frame
 * of the fade-out and scale-out animations is invisible, which would blank four of the seven types.
 */

const ANIMATION_TYPES = [
	'default',
	'bubbles',
	'circle',
	'circular',
	'crescent',
	'dots',
	'lines',
	'lines-sharp',
] as const;
const SIZES = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;

type AnimationType = (typeof ANIMATION_TYPES)[number];

interface SpinnerArgs {
	animationType: AnimationType;
	color: string;
	size: (typeof SIZES)[number];
	extendedClass: string;
}

// ─── Glyph markup, exactly as authored in the block with HTML Element widgets ───────────────
const RING_RADIUS = 20.48; // 32% of the 64-unit viewBox, as in Mobile UI

const svg = (type: string, viewBox: string, children: string) =>
	`<svg class="osui-spinner__${type}" viewBox="${viewBox}" aria-hidden="true">${children}</svg>`;

const ringCircles = (count: number) =>
	Array.from({ length: count }, (_, i) => {
		const angle = (2 * Math.PI * i) / count;
		const cx = (32 + RING_RADIUS * Math.cos(angle)).toFixed(2);
		const cy = (32 + RING_RADIUS * Math.sin(angle)).toFixed(2);
		return `<circle cx="${cx}" cy="${cy}" r="5"></circle>`;
	}).join('');

const GLYPHS: Record<Exclude<AnimationType, 'default'>, string> = {
	dots: svg(
		'dots',
		'0 0 64 64',
		[52.48, 32, 11.52].map((cx) => `<circle cx="${cx}" cy="32" r="6"></circle>`).join('')
	),
	lines: svg('lines', '0 0 64 64', '<line x1="32" y1="6" x2="32" y2="18"></line>'.repeat(8)),
	'lines-sharp': svg('lines-sharp', '0 0 64 64', '<line x1="32" y1="3" x2="32" y2="15"></line>'.repeat(12)),
	bubbles: svg('bubbles', '0 0 64 64', ringCircles(9)),
	circle: svg('circle', '0 0 64 64', ringCircles(8)),
	circular: svg('circular', '24 24 48 48', '<circle cx="48" cy="48" r="20"></circle>'),
	crescent: svg('crescent', '0 0 64 64', '<circle cx="32" cy="32" r="26"></circle>'),
};

const glyphMarkup = (type: AnimationType) => (type === 'default' ? GLYPHS.lines + GLYPHS.circular : GLYPHS[type]);

const blockMarkup = (id: string, type: AnimationType) =>
	`<div ${osuiRoot(id)} class="osui-spinner" aria-label="Loading">${glyphMarkup(type)}</div>`;

const meta: Meta<SpinnerArgs> = {
	title: 'Patterns/Utilities/Spinner',
	args: { animationType: 'default', color: '', size: 'xsmall', extendedClass: '' },
	argTypes: {
		animationType: {
			name: 'AnimationType',
			control: 'select',
			options: ANIMATION_TYPES,
			description: 'Sets the animation. Default follows the platform: lines on iOS, circular everywhere else.',
		},
		color: {
			name: 'Color',
			control: 'text',
			description:
				'Sets the spinner color: any color. A theme color name (primary, error, neutral-7, …) follows the theme; HEX / RGB / HSL / CSS keywords are used as-is. Empty keeps the theme default.',
		},
		size: {
			name: 'Size',
			control: 'select',
			options: SIZES,
			description: 'Sets the spinner size: xsmall 24px, small 32px, medium 40px, large 48px, xlarge 56px.',
		},
		extendedClass: extendedClassArgType,
	},
};
export default meta;

type Story = StoryObj<SpinnerArgs>;

// Maps story args onto the JSON config the block passes to SpinnerAPI.Create
const toConfig = (args: SpinnerArgs) => ({
	AnimationType: args.animationType,
	Color: args.color,
	ExtendedClass: args.extendedClass,
	Size: args.size,
});

// Renders a labelled grid of spinners, each created through the public API
const renderGrid = (cells: Array<{ args: SpinnerArgs; label: string }>) => {
	const items = cells.map((cell) => ({ ...cell, id: uid('spinner') }));
	const template = `
		<div style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-end">
			${items
				.map(
					(item) => `
				<figure style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:0">
					${blockMarkup(item.id, item.args.animationType)}
					<figcaption style="font-size:12px">${item.label}</figcaption>
				</figure>`
				)
				.join('')}
		</div>`;
	return renderPattern(template, (_root, register) =>
		items.forEach((item) => createAndInit('SpinnerAPI', item.id, toConfig(item.args), register))
	);
};

/** One spinner wired to every low-code input. The defaults are the block's defaults. */
export const Default: Story = {
	render: (args) => {
		const id = uid('spinner');
		return renderPattern(blockMarkup(id, args.animationType), (_root, register) =>
			createAndInit('SpinnerAPI', id, toConfig(args), register)
		);
	},
};

/** Every AnimationType side by side. `default` shows what the current platform resolves to. */
export const AllTypes: Story = {
	args: { size: 'medium' },
	render: (args) =>
		renderGrid(
			ANIMATION_TYPES.map((animationType) => ({ args: { ...args, animationType }, label: animationType }))
		),
};

/** The five sizes of the selected AnimationType. */
export const Sizes: Story = {
	args: { animationType: 'lines' },
	render: (args) => renderGrid(SIZES.map((size) => ({ args: { ...args, size }, label: size }))),
};

/**
 * Color resolution: theme colour names become `var(--color-…)` and follow dark mode;
 * HEX and RGB values are used as-is; empty keeps the theme default.
 */
export const Colors: Story = {
	args: { animationType: 'crescent', size: 'large' },
	render: (args) =>
		renderGrid(
			['', 'primary', 'secondary', 'red', 'neutral-7', '#ff6600', 'rgb(16, 104, 235)'].map((color) => ({
				args: { ...args, color },
				label: color || '(theme default)',
			}))
		),
};
