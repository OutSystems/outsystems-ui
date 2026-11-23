import type { Meta, StoryObj } from '@storybook/html-vite';
import { basicBackgroundCardMarkup, imageBackgroundCardMarkup } from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

/**
 * Card Background — hero tile with an image layer and a colour overlay. Controls mirror
 * the low-code input parameters of the `CardBackground` block (Color, MinHeight,
 * ExtendedClass); class mappings from src/scss/04-patterns/02-content/_card-background.scss.
 */
const meta: Meta = { title: 'Patterns/Content/Card Background' };
export default meta;

type BackgroundArgs = { color: string; minHeight: number; extendedClass: string };

export const Playground: StoryObj<BackgroundArgs> = {
	args: { color: 'primary', minHeight: 200, extendedClass: '' },
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
		renderStatic(`
			<div class="${cls('card-background', extendedClass)}" style="max-width:320px;min-height:${minHeight}px;">
				<div class="card-background-content"><div style="text-align:center;"><span class="heading2 text-neutral-0">Take control with a plan made for you</span></div></div>
				<div class="card-background-image"><div style="width:100%;height:100%;background:linear-gradient(135deg,#3b5bdb,#1098ad);"></div></div>
				<div class="${cls('card-background-color', color && `background-${color}`)}"></div>
			</div>`),
};

type Story = StoryObj;

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Card Background with composed content, a palette colour on the image layer, and a primary overlay.',
			},
		},
	},
	render: () => renderStatic(basicBackgroundCardMarkup()),
};

export const BackgroundImage: Story = {
	tags: ['docs-example'],
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
