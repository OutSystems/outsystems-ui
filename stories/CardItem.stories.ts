import type { Meta, StoryObj } from '@storybook/html-vite';
import { detailItemMarkup, metricDetailItemMarkup } from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { extendedClassArgType } from './_helpers/lowcode';

/**
 * Card Item — list row with left, center, and right slots. Styles in `_card-item.scss`.
 */

const meta: Meta = {
	title: 'Patterns/Content/Card Item',
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
				story: 'Card Item row with circular avatar, title, subtitle, and an Active status Tag.',
			},
		},
	},
	render: () => renderStatic(detailItemMarkup()),
};

export const MetricRow: Story = {
	name: 'Metric row',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Card Item with a ticket icon tile, event title, and tickets-sold metric.',
			},
		},
	},
	render: () => renderStatic(metricDetailItemMarkup()),
};

type ItemArgs = { extendedClass: string };

export const Playground: StoryObj<ItemArgs> = {
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) => renderStatic(detailItemMarkup(extendedClass)),
};
