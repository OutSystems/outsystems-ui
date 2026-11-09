import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType, lightTextClass } from './_helpers/lowcode';

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

export const Default: StoryObj<BadgeArgs> = {
	args: {
		number: 3,
		color: 'primary',
		size: 'medium',
		shape: 'rounded',
		isLight: false,
		extendedClass: '',
	},
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
	render: ({ number, color, size, shape, isLight, extendedClass }) => {
		const bgClass = backgroundClass(color, isLight);
		const textClass = isLight ? lightTextClass(color) : '';
		const shapeClass = shape ? `border-radius-${shape}` : '';
		const sizeClass = size ? `badge-${size}` : '';
		return renderStatic(
			`<div class="${cls('badge', sizeClass, shapeClass, bgClass, textClass, 'OSInline', extendedClass)}"><span class="OSFillParent">${number}</span></div>`
		);
	},
};
