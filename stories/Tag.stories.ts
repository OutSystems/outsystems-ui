import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType, lightTextClass } from './_helpers/lowcode';
import { colorBoard, labeledBoard } from './_helpers/showcase';

/**
 * Tag — low-code input parameters from the library OML wired as Storybook controls.
 * Class mappings come from src/scss/04-patterns/02-content/_tag.scss.
 *
 *   Color    → background-{value} (or background-{value}-lightest when IsLight=true)
 *   Size     → tag-small | tag-medium (no class = default compact size)
 *   Shape    → border-radius-none | border-radius-soft | border-radius-rounded | border-radius-circle
 *   IsLight  → appends -lightest to the background class (`transparent` has no variant)
 *
 * The pattern SCSS now owns the IsLight text colors (per-family text tokens per the
 * Figma spec); the text-{color} classes below are kept only for platform markup parity.
 */
// ─── Docs-page demos (ported from the docs stories) ─────────────────────────

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';

function tagMarkupDoc(
	color: string,
	size: string,
	shape: string,
	isLight: boolean,
	label: string,
	extendedClass = ''
): string {
	const bgClass = backgroundClass(color, isLight);
	const textClass = isLight ? lightTextClass(color) : '';
	const shapeClass = shape ? `border-radius-${shape}` : '';
	const sizeClass = size ? `tag-${size}` : '';
	return `<div class="${cls('tag', sizeClass, shapeClass, bgClass, textClass, 'OSInline', extendedClass)}">${label}</div>`;
}

type Story = StoryObj;

const meta: Meta = { title: 'Patterns/Content/Tag' };
export default meta;

type TagArgs = {
	color: string;
	size: string;
	shape: string;
	isLight: boolean;
	extendedClass: string;
};

const SIZE_OPTIONS = ['', 'small', 'medium'];
const SHAPE_OPTIONS = ['none', 'soft', 'rounded', 'circle'];

function tagMarkup({ color, size, shape, isLight, extendedClass }: TagArgs): string {
	const bgClass = backgroundClass(color, isLight);
	const textClass = isLight ? lightTextClass(color) : '';
	const shapeClass = shape ? `border-radius-${shape}` : '';
	const sizeClass = size ? `tag-${size}` : '';
	return `<div class="${cls('tag', sizeClass, shapeClass, bgClass, textClass, 'OSInline', extendedClass)}">Label</div>`;
}

const baseArgs: TagArgs = { color: 'primary', size: 'medium', shape: 'rounded', isLight: false, extendedClass: '' };

export const Playground: StoryObj<TagArgs> = {
	args: { ...baseArgs },
	argTypes: {
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
			description: 'Set the size of the Tag (small / medium).',
		},
		shape: {
			name: 'Shape',
			control: 'select',
			options: SHAPE_OPTIONS,
			description: 'Set the shape of the Tag (border-radius variant).',
		},
		isLight: {
			name: 'IsLight',
			control: 'boolean',
			description: 'Use the lightest color version for the background and the darker color version for text.',
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(tagMarkup(args)),
};

export const DefaultStyle: Story = {
	tags: ['docs-example'],
	name: 'Default style',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(`<div style="${DEMO_WRAP}">${tagMarkupDoc('primary', 'medium', 'rounded', false, 'Label')}</div>`),
};

export const LightStyle: Story = {
	tags: ['docs-example'],
	name: 'Light style',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(`<div style="${DEMO_WRAP}">${tagMarkupDoc('primary', 'medium', 'rounded', true, 'Label')}</div>`),
};

export const ColourVariants: Story = {
	tags: ['docs-example'],
	name: 'Colour variants',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(
			`<div style="${DEMO_WRAP}display:flex;flex-wrap:wrap;gap:8px;max-width:480px;">${[
				'primary',
				'success',
				'warning',
				'error',
				'info',
			]
				.map((c) => tagMarkupDoc(c, 'medium', 'rounded', false, c))
				.join('')}</div>`
		),
};

/** Every Color swatch as a solid and an IsLight tag. */
export const Colors: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () => renderStatic(colorBoard((color, isLight) => tagMarkup({ ...baseArgs, color, isLight })).outerHTML),
};

/** Default (compact), small and medium sizes side by side. */
export const Sizes: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				SIZE_OPTIONS.map((size) => ({ label: size || 'default', html: tagMarkup({ ...baseArgs, size }) })),
				{ direction: 'row' }
			).outerHTML
		),
};

/** The four border-radius shapes at the same size and color. */
export const Shapes: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				SHAPE_OPTIONS.map((shape) => ({ label: shape, html: tagMarkup({ ...baseArgs, shape }) })),
				{ direction: 'row' }
			).outerHTML
		),
};
