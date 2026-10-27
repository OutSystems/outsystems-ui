import type { Meta, StoryObj } from '@storybook/html-vite';
import { basicBackgroundCardMarkup, imageBackgroundCardMarkup } from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

/**
 * Card Background — hero tile with image and colour overlay. Styles in `_card-background.scss`.
 */

const meta: Meta = {
	title: 'Patterns/Content/Card Background',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: {
		docs: {
			source: { disable: true },
			canvas: { sourceState: 'none' },
		},
	},
};
export default meta;

type Story = StoryObj;

export const BasicUsage: Story = {
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'Card Background with composed content, a palette colour on the image layer, and a primary overlay.',
			},
		},
	},
	render: () => renderStatic(basicBackgroundCardMarkup()),
};

export const BackgroundImage: Story = {
	name: 'Background image',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Card Background with a full-bleed concert photo and red colour overlay.',
			},
		},
	},
	render: () => renderStatic(imageBackgroundCardMarkup()),
};

type BackgroundArgs = { color: string; minHeight: number; extendedClass: string };

export const Playground: StoryObj<BackgroundArgs> = {
	args: { color: 'red', minHeight: 200, extendedClass: '' },
	argTypes: {
		color: {
			name: 'Color',
			control: 'select',
			options: COLOR_OPTIONS,
			description: 'Background color of the Block.',
		},
		minHeight: {
			name: 'MinHeight',
			control: { type: 'number', min: 0, step: 10 },
			description: 'Minimum height of the Card, in pixels.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ color, minHeight, extendedClass }) =>
		renderStatic(imageBackgroundCardMarkup(color, minHeight, extendedClass)),
};
