import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType, lightTextClass } from './_helpers/lowcode';
import { colorBoard, labeledBoard } from './_helpers/showcase';

/**
 * UserAvatar — low-code input parameters from the library OML wired as Storybook controls.
 * Class mappings come from src/scss/04-patterns/02-content/_user-avatar.scss.
 *
 *   Name     → used as aria-label and to derive initials (first letters of each word)
 *   Image    → when non-empty, renders an <img> instead of initials text
 *   Color    → background-{value} (or background-{value}-lightest when IsLight=true)
 *   Size     → avatar-small | avatar-medium (no class = default 32px size)
 *   Shape    → border-radius-none | border-radius-soft | border-radius-rounded | border-radius-circle
 *   IsLight  → appends -lightest to the background class (`transparent` has no variant)
 */
// ─── Docs-page demos (ported from the docs stories) ─────────────────────────

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';
const CARD_IMG = '/assets/placeholder-card.svg';

function avatarMarkupDoc(
	name: string,
	image: string,
	color: string,
	size: string,
	shape: string,
	isLight: boolean,
	extendedClass = ''
): string {
	const bgClass = backgroundClass(color, isLight);
	const textClass = isLight ? lightTextClass(color) : '';
	const shapeClass = shape ? `border-radius-${shape}` : '';
	const sizeClass = size ? `avatar-${size}` : '';
	const label = `user initials, ${initials(name)}`;
	const inner = image
		? `<img src="${image}" alt="${name}" />`
		: `<span class="OSFillParent">${initials(name)}</span>`;
	return `<div style="${DEMO_WRAP}"><div class="${cls('avatar', sizeClass, shapeClass, bgClass, textClass, extendedClass)}" role="img" aria-label="${label}">${inner}</div></div>`;
}

type Story = StoryObj;

const meta: Meta = { title: 'Patterns/Content/UserAvatar' };
export default meta;

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

function avatarMarkup({ name, image, color, size, shape, isLight, extendedClass }: UserAvatarArgs): string {
	const bgClass = backgroundClass(color, isLight);
	const textClass = isLight ? lightTextClass(color) : '';
	const shapeClass = shape ? `border-radius-${shape}` : '';
	const sizeClass = size ? `avatar-${size}` : '';
	const label = `user initials, ${initials(name)}`;
	// Image sizing/fit/radius is owned by the pattern SCSS (Type=Image in Figma).
	const inner = image
		? `<img src="${image}" alt="${name}" />`
		: `<span class="OSFillParent">${initials(name)}</span>`;
	return `<div class="${cls('avatar', sizeClass, shapeClass, bgClass, textClass, extendedClass)}" role="img" aria-label="${label}">${inner}</div>`;
}

const baseArgs: UserAvatarArgs = {
	name: 'John Doe',
	image: '',
	color: 'primary',
	size: 'medium',
	shape: 'rounded',
	isLight: false,
	extendedClass: '',
};

// Deterministic placeholder photo (inline SVG) so the Image variant needs no network.
const AVATAR_IMAGE =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#94a3b8"/><circle cx="24" cy="18" r="8" fill="#e2e8f0"/><path d="M8 44c0-9 7-14 16-14s16 5 16 14" fill="#e2e8f0"/></svg>'
	);

export const Playground: StoryObj<UserAvatarArgs> = {
	args: { ...baseArgs },
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
	render: (args) => renderStatic(avatarMarkup(args)),
};

export const Initials: Story = {
	tags: ['docs-example'],
	name: 'Initials',
	parameters: { layout: 'padded' },
	render: () => renderStatic(avatarMarkupDoc('John Doe', '', 'primary', 'medium', 'rounded', false)),
};

export const WithImage: Story = {
	tags: ['docs-example'],
	name: 'With image',
	parameters: { layout: 'padded' },
	render: () => renderStatic(avatarMarkupDoc('Jane Doe', CARD_IMG, 'primary', 'medium', 'circle', false)),
};

export const LightStyle: Story = {
	tags: ['docs-example'],
	name: 'Light style',
	parameters: { layout: 'padded' },
	render: () => renderStatic(avatarMarkupDoc('Alex Kim', '', 'primary', 'medium', 'rounded', true)),
};

/** Every Color swatch as a solid and an IsLight avatar (initials type). */
export const Colors: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () => renderStatic(colorBoard((color, isLight) => avatarMarkup({ ...baseArgs, color, isLight })).outerHTML),
};

/** Default (32px), small and medium sizes side by side. */
export const Sizes: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				SIZE_OPTIONS.map((size) => ({ label: size || 'default', html: avatarMarkup({ ...baseArgs, size }) })),
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
				SHAPE_OPTIONS.map((shape) => ({ label: shape, html: avatarMarkup({ ...baseArgs, shape }) })),
				{ direction: 'row' }
			).outerHTML
		),
};

/** Initials type next to Image type (inline placeholder photo). */
export const Types: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{ label: 'initials', html: avatarMarkup({ ...baseArgs }) },
					{ label: 'image', html: avatarMarkup({ ...baseArgs, image: AVATAR_IMAGE }) },
				],
				{ direction: 'row' }
			).outerHTML
		),
};
