import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType, lightTextClass } from './_helpers/lowcode';

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';
const CARD_IMG = '/assets/placeholder-card.svg';

function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((w) => w[0] ?? '')
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

function avatarMarkup(
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

const meta: Meta = {
	title: 'Patterns/Content/UserAvatar',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const Initials: Story = {
	name: 'Initials',
	parameters: { layout: 'padded' },
	render: () => renderStatic(avatarMarkup('John Doe', '', 'primary', 'medium', 'rounded', false)),
};

export const WithImage: Story = {
	name: 'With image',
	parameters: { layout: 'padded' },
	render: () => renderStatic(avatarMarkup('Jane Doe', CARD_IMG, 'primary', 'medium', 'circle', false)),
};

export const LightStyle: Story = {
	name: 'Light style',
	parameters: { layout: 'padded' },
	render: () => renderStatic(avatarMarkup('Alex Kim', '', 'primary', 'medium', 'rounded', true)),
};

type UserAvatarArgs = {
	name: string;
	image: string;
	color: string;
	size: string;
	shape: string;
	isLight: boolean;
	extendedClass: string;
};

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
		name: { name: 'Name', control: 'text' },
		image: { name: 'Image', control: 'text' },
		color: { name: 'Color', control: 'select', options: COLOR_OPTIONS },
		size: { name: 'Size', control: 'select', options: ['', 'small', 'medium'] },
		shape: { name: 'Shape', control: 'select', options: ['none', 'soft', 'rounded', 'circle'] },
		isLight: { name: 'IsLight', control: 'boolean' },
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(avatarMarkup(args.name, args.image, args.color, args.size, args.shape, args.isLight, args.extendedClass)),
};
