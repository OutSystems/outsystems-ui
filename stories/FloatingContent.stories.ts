import type { Meta, StoryObj } from '@storybook/html-vite';
import { FLOATING_POSITIONS, floatingContentMarkup, type FloatingPosition } from './_helpers/floating-content-markup';
import { renderStatic } from './_helpers/osui';
import { extendedClassArgType } from './_helpers/lowcode';

const meta: Meta = {
	title: 'Patterns/Content/FloatingContent',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const BottomRight: Story = {
	name: 'Bottom right',
	parameters: { layout: 'padded' },
	render: () => renderStatic(floatingContentMarkup('bottom-right')),
};

export const Center: Story = {
	name: 'Center',
	parameters: { layout: 'padded' },
	render: () => renderStatic(floatingContentMarkup('center')),
};

export const FullWidth: Story = {
	name: 'Full width',
	parameters: { layout: 'padded' },
	render: () => renderStatic(floatingContentMarkup('top', { useMargin: false, fullWidth: true })),
};

type FloatingContentArgs = {
	position: FloatingPosition;
	useMargin: boolean;
	fullWidth: boolean;
	fullHeight: boolean;
	extendedClass: string;
};

export const Default: StoryObj<FloatingContentArgs> = {
	args: { position: 'bottom-right', useMargin: true, fullWidth: false, fullHeight: false, extendedClass: '' },
	argTypes: {
		position: { name: 'Position', control: 'select', options: FLOATING_POSITIONS },
		useMargin: { name: 'UseMargin', control: 'boolean' },
		fullWidth: { name: 'FullWidth', control: 'boolean' },
		fullHeight: { name: 'FullHeight', control: 'boolean' },
		extendedClass: extendedClassArgType,
	},
	render: ({ position, useMargin, fullWidth, fullHeight, extendedClass }) =>
		renderStatic(floatingContentMarkup(position, { useMargin, fullWidth, fullHeight, extendedClass })),
};
