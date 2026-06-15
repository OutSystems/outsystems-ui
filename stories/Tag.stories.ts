import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

/**
 * Tag — low-code input parameters from the library OML wired as Storybook controls.
 * Class mappings come from src/scss/04-patterns/02-content/_tag.scss.
 *
 *   Color    → background-{value} (or background-{value}-light(est) when IsLight=true)
 *   Size     → tag-small | tag-medium (no class = default compact size)
 *   Shape    → border-radius-none | border-radius-soft | border-radius-rounded | border-radius-circle
 *   IsLight  → appends -lightest for palette colors; -light for semantic colors (success/warning/error/info)
 */
const meta: Meta = { title: 'Patterns/Content/Tag' };
export default meta;

/**
 * Semantic status colors only have a `-light` variant in the compiled CSS;
 * all palette colors (primary, secondary, blue, green, …) have `-lightest`.
 */
const SEMANTIC_LIGHT_COLORS = new Set(['success', 'warning', 'error', 'info']);
function lightBgSuffix(color: string): string {
	return SEMANTIC_LIGHT_COLORS.has(color) ? '-light' : '-lightest';
}

type TagArgs = {
	color: string;
	size: string;
	shape: string;
	isLight: boolean;
	extendedClass: string;
};

const SIZE_OPTIONS = ['', 'small', 'medium'];
const SHAPE_OPTIONS = ['none', 'soft', 'rounded', 'circle'];

export const Default: StoryObj<TagArgs> = {
	args: {
		color: 'primary',
		size: 'medium',
		shape: 'rounded',
		isLight: false,
		extendedClass: '',
	},
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
	render: ({ color, size, shape, isLight, extendedClass }) => {
		const bgClass = color ? `background-${color}${isLight ? lightBgSuffix(color) : ''}` : '';
		// IsLight pairs the light background with the color's darker text variant
		// (semantic colors only expose `text-{color}`, palette/brand use `-darker`).
		const textClass =
			color && isLight ? `text-${color}${SEMANTIC_LIGHT_COLORS.has(color) ? '' : '-darker'}` : '';
		const shapeClass = shape ? `border-radius-${shape}` : '';
		const sizeClass = size ? `tag-${size}` : '';
		return renderStatic(
			`<div class="${cls('tag', sizeClass, shapeClass, bgClass, textClass, 'OSInline', extendedClass)}">Label</div>`
		);
	},
};
