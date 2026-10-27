import type { Meta, StoryObj } from '@storybook/html-vite';
import { basicCardMarkup, composedCardMarkup } from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { extendedClassArgType, usePaddingArgType } from './_helpers/lowcode';

/**
 * Card — simple bordered surface. Class mappings from `src/scss/04-patterns/02-content/_card.scss`.
 */

const meta: Meta = {
	title: 'Patterns/Content/Card',
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
				story: 'Default Card with padding — set <code>UsePadding</code> to False to remove inner spacing.',
			},
		},
	},
	render: () => renderStatic(basicCardMarkup()),
};

type CardArgs = { usePadding: boolean; extendedClass: string };

export const Basic: StoryObj<CardArgs> = {
	args: { usePadding: true, extendedClass: '' },
	argTypes: { usePadding: usePaddingArgType, extendedClass: extendedClassArgType },
	render: ({ usePadding, extendedClass }) => renderStatic(basicCardMarkup(usePadding, extendedClass)),
};

export const CardComposition: Story = {
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
