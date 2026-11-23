import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType, lightTextClass } from './_helpers/lowcode';
import { colorBoard, labeledBoard } from './_helpers/showcase';

/**
 * Badge — low-code input parameters from the library OML wired as Storybook controls.
 * Class mappings come from src/scss/04-patterns/05-numbers/_badge.scss.
 *
 *   Number   → text content of the badge span
 *   Color    → background-{value} (or background-{value}-lightest when IsLight=true)
 *   Size     → badge-small | badge-medium (no class = default size)
 *   Shape    → border-radius-none | border-radius-soft | border-radius-rounded | border-radius-circle
 *   IsLight  → appends -lightest to the background class (`transparent` has no variant)
 */
const meta: Meta = { title: 'Patterns/Numbers/Badge' };
export default meta;

type BadgeArgs = {
	number: number;
	color: string;
	size: string;
	shape: string;
	isLight: boolean;
	extendedClass: string;
};

const SIZE_OPTIONS = ['', 'small', 'medium'];
const SHAPE_OPTIONS = ['none', 'soft', 'rounded', 'circle'];

function badgeMarkup({ number, color, size, shape, isLight, extendedClass }: BadgeArgs): string {
	const bgClass = backgroundClass(color, isLight);
	const textClass = isLight ? lightTextClass(color) : '';
	const shapeClass = shape ? `border-radius-${shape}` : '';
	const sizeClass = size ? `badge-${size}` : '';
	return `<div class="${cls('badge', sizeClass, shapeClass, bgClass, textClass, 'OSInline', extendedClass)}"><span class="OSFillParent">${number}</span></div>`;
}

const baseArgs: BadgeArgs = {
	number: 3,
	color: 'primary',
	size: 'medium',
	shape: 'rounded',
	isLight: false,
	extendedClass: '',
};

export const Playground: StoryObj<BadgeArgs> = {
	args: { ...baseArgs },
	argTypes: {
		number: {
			name: 'Number',
			control: { type: 'number', min: 0, step: 1 },
			description: 'Number to be displayed.',
		},
		color: {
			name: 'Color',
			control: 'select',
			options: COLOR_OPTIONS,
			description: 'Background color of the Block.',
		},
		size: {
			name: 'Size',
			control: 'select',
			options: SIZE_OPTIONS,
			description: 'Set the size of the Badge (small / medium).',
		},
		shape: {
			name: 'Shape',
			control: 'select',
			options: SHAPE_OPTIONS,
			description: 'Set the shape of the Badge (border-radius variant).',
		},
		isLight: {
			name: 'IsLight',
			control: 'boolean',
			description: 'Use the lightest color version for the background and the darker color version for text.',
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(badgeMarkup(args)),
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

/** The docs examples pair each colour family with its `IsLight` counterpart. */
const DOC_COLORS = ['primary', 'green', 'orange', 'red'] as const;

export const BasicUsage: StoryObj = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Studio defaults — <code>Number</code> 3, <code>Color</code> Primary, <code>Shape</code> Rounded and no <code>Size</code> (the compact 20px pill).',
			},
		},
	},
	render: () => renderStatic(badgeMarkup({ ...baseArgs, size: '' })),
};

export const LightStyle: StoryObj = {
	tags: ['docs-example'],
	name: 'Light style',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Solid colour above, <code>IsLight</code> True below: the background switches to the <code>-lightest</code> tint and the text to the darker tone of the same family.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				DOC_COLORS.map((color) => ({
					label: color,
					html: `<div style="display:flex;gap:8px;align-items:center;">${badgeMarkup({ ...baseArgs, size: '', color })}${badgeMarkup({ ...baseArgs, size: '', color, isLight: true })}</div>`,
				})),
				{ direction: 'row' }
			).outerHTML
		),
};

/** Default (compact), small and medium sizes side by side. */
export const Sizes: StoryObj = {
	tags: ['docs-example'],
	name: 'Sizes',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'The three <code>Size</code> values: empty (default, 20px), Small (<code>.badge-small</code>, 16px) and Medium (<code>.badge-medium</code>, 28px).',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				SIZE_OPTIONS.map((size) => ({ label: size || 'default', html: badgeMarkup({ ...baseArgs, size }) })),
				{ direction: 'row' }
			).outerHTML
		),
};

/** The four border-radius shapes at the same size and color. */
export const Shapes: StoryObj = {
	tags: ['docs-example'],
	name: 'Shapes',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>Shape</code> Sharp, SoftRounded and Rounded map to <code>border-radius-none</code>, <code>-soft</code> and <code>-rounded</code>; the last cell adds <code>border-radius-circle</code> through <code>ExtendedClass</code>.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				SHAPE_OPTIONS.map((shape) => ({ label: shape, html: badgeMarkup({ ...baseArgs, shape }) })),
				{ direction: 'row' }
			).outerHTML
		),
};

/** Every Color swatch as a solid and an IsLight badge. */
export const Colors: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () => renderStatic(colorBoard((color, isLight) => badgeMarkup({ ...baseArgs, color, isLight })).outerHTML),
};
