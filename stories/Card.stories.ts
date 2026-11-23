import type { Meta, StoryObj } from '@storybook/html-vite';
import { basicCardMarkup, composedCardMarkup } from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType, usePaddingArgType } from './_helpers/lowcode';

/**
 * Card — simple bordered surface. Controls mirror the low-code input parameters of
 * the `Card` block (UsePadding, ExtendedClass), wired into the shipped markup; class
 * mappings from src/scss/04-patterns/02-content/_card.scss.
 *
 * Card Sectioned, Card Background and Card Item are separate blocks with their own
 * stories (CardSectioned / CardBackground / CardItem).
 */
const meta: Meta = { title: 'Patterns/Content/Card' };
export default meta;

type CardArgs = { usePadding: boolean; extendedClass: string };

export const Playground: StoryObj<CardArgs> = {
	args: { usePadding: true, extendedClass: '' },
	argTypes: { usePadding: usePaddingArgType, extendedClass: extendedClassArgType },
	render: ({ usePadding, extendedClass }) =>
		renderStatic(
			`<div class="${cls('card', !usePadding && 'padding-none', extendedClass)}" style="max-width:320px;">A simple card surface with border, radius, shadow and padding.</div>`
		),
};

type Story = StoryObj;

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Default Card with padding — set <code>UsePadding</code> to False to remove inner spacing.',
			},
		},
	},
	render: () => renderStatic(basicCardMarkup()),
};

export const CardComposition: Story = {
	tags: ['docs-example'],
	name: 'Card composition',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Compose a richer layout inside a Card — header, highlighted row, summary lines, and a full-width action.',
			},
		},
	},
	render: () => renderStatic(composedCardMarkup()),
};
