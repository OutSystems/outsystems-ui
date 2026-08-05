import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

/**
 * UserAvatar — low-code input parameters from the library OML wired as Storybook controls.
 * Class mappings come from src/scss/04-patterns/02-content/_user-avatar.scss.
 *
 *   Name     → used as aria-label and to derive initials (first letters of each word)
 *   Image    → when non-empty, renders an <img> instead of initials text
 *   Color    → background-{value} (or background-{value}-light(est) when IsLight=true)
 *   Size     → avatar-small | avatar-medium (no class = default 32px size)
 *   Shape    → border-radius-none | border-radius-soft | border-radius-rounded | border-radius-circle
 *   IsLight  → appends -lightest for palette colors; -light for semantic colors (success/warning/error/info)
 */
const meta: Meta = { title: 'Patterns/Content/UserAvatar' };
export default meta;

const SEMANTIC_LIGHT_COLORS = new Set(['success', 'warning', 'error', 'info']);
function lightBgSuffix(color: string): string {
	return SEMANTIC_LIGHT_COLORS.has(color) ? '-light' : '-lightest';
}

type UserAvatarArgs = {
	name: string;
	image: string;
	color: string;
	size: string;
	shape: string;
	isLight: boolean;
	extendedClass: string;
};

const SIZE_OPTIONS = ['', 'small', 'medium'];
const SHAPE_OPTIONS = ['none', 'soft', 'rounded', 'circle'];

/** Derive initials: first letter of each word, up to 2 characters, uppercased. */
function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((w) => w[0] ?? '')
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

export const Default: StoryObj<UserAvatarArgs> = {
	args: {
		name: 'John Doe',
		image: '',
		color: 'primary',
		size: 'medium',
		shape: 'rounded',
		isLight: false,
		extendedClass: '',
	},
	argTypes: {
		name: {
			name: 'Name',
			control: 'text',
			description: 'Name of the user (used for initials and aria-label).',
		},
		image: {
			name: 'Image',
			control: 'text',
			description: 'Image URL of the user. When set, an image is shown instead of initials.',
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
			description: 'Set the size of the Avatar (small / medium).',
		},
		shape: {
			name: 'Shape',
			control: 'select',
			options: SHAPE_OPTIONS,
			description: 'Set the shape of the Avatar (border-radius variant).',
		},
		isLight: {
			name: 'IsLight',
			control: 'boolean',
			description: 'Use the lightest color version for the background and the darker color version for text.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ name, image, color, size, shape, isLight, extendedClass }) => {
		const bgClass = color ? `background-${color}${isLight ? lightBgSuffix(color) : ''}` : '';
		// IsLight pairs the light background with the color's darker text variant
		// (semantic colors only expose `text-{color}`, palette/brand use `-darker`).
		const textSuffix = SEMANTIC_LIGHT_COLORS.has(color) ? '' : '-darker';
		const textClass = color && isLight ? `text-${color}${textSuffix}` : '';
		const shapeClass = shape ? `border-radius-${shape}` : '';
		const sizeClass = size ? `avatar-${size}` : '';
		const label = `user initials, ${initials(name)}`;
		const inner = image
			? `<img src="${image}" alt="${name}" style="width:100%;height:100%;object-fit:cover;" />`
			: `<span class="OSFillParent">${initials(name)}</span>`;
		return renderStatic(
			`<div class="${cls('avatar', sizeClass, shapeClass, bgClass, textClass, extendedClass)}" role="img" aria-label="${label}">${inner}</div>`
		);
	},
};
