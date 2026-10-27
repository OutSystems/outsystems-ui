import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType, lightTextClass } from './_helpers/lowcode';

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';

function tagMarkup(color: string, size: string, shape: string, isLight: boolean, label: string, extendedClass = ''): string {
	const bgClass = backgroundClass(color, isLight);
	const textClass = isLight ? lightTextClass(color) : '';
	const shapeClass = shape ? `border-radius-${shape}` : '';
	const sizeClass = size ? `tag-${size}` : '';
	return `<div class="${cls('tag', sizeClass, shapeClass, bgClass, textClass, 'OSInline', extendedClass)}">${label}</div>`;
}

const meta: Meta = {
	title: 'Patterns/Content/Tag',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const DefaultStyle: Story = {
	name: 'Default style',
	parameters: { layout: 'padded' },
	render: () => renderStatic(`<div style="${DEMO_WRAP}">${tagMarkup('primary', 'medium', 'rounded', false, 'Label')}</div>`),
};

export const LightStyle: Story = {
	name: 'Light style',
	parameters: { layout: 'padded' },
	render: () => renderStatic(`<div style="${DEMO_WRAP}">${tagMarkup('primary', 'medium', 'rounded', true, 'Label')}</div>`),
};

export const ColourVariants: Story = {
	name: 'Colour variants',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(
			`<div style="${DEMO_WRAP}display:flex;flex-wrap:wrap;gap:8px;max-width:480px;">${['primary', 'success', 'warning', 'error', 'info']
				.map((c) => tagMarkup(c, 'medium', 'rounded', false, c))
				.join('')}</div>`
		),
};

type TagArgs = { color: string; size: string; shape: string; isLight: boolean; extendedClass: string };

export const Default: StoryObj<TagArgs> = {
	args: { color: 'primary', size: 'medium', shape: 'rounded', isLight: false, extendedClass: '' },
	argTypes: {
		color: { name: 'Color', control: 'select', options: COLOR_OPTIONS },
		size: { name: 'Size', control: 'select', options: ['', 'small', 'medium'] },
		shape: { name: 'Shape', control: 'select', options: ['none', 'soft', 'rounded', 'circle'] },
		isLight: { name: 'IsLight', control: 'boolean' },
		extendedClass: extendedClassArgType,
	},
	render: ({ color, size, shape, isLight, extendedClass }) =>
		renderStatic(`<div style="${DEMO_WRAP}">${tagMarkup(color, size, shape, isLight, 'Label', extendedClass)}</div>`),
};
