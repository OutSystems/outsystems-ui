import type { Meta, StoryObj } from '@storybook/html-vite';
import { detailItemMarkup, metricDetailItemMarkup } from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Card Item — list row with left, center and right slots. Controls mirror the low-code
 * input parameters of the `CardItem` block (ExtendedClass); class mappings from
 * src/scss/04-patterns/02-content/_card-item.scss.
 */
const meta: Meta = { title: 'Patterns/Content/Card Item' };
export default meta;

type ItemArgs = { extendedClass: string };

export const Playground: StoryObj<ItemArgs> = {
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) =>
		renderStatic(`
			<div class="${cls('card card-detail', extendedClass)}" style="max-width:360px;">
				<div class="card-detail-left"><div class="avatar avatar-small border-radius-rounded background-primary" role="img" aria-label="user initials, JD"><span class="OSFillParent">JD</span></div></div>
				<div class="card-detail-center">
					<div class="card-detail-title">Jane Doe</div>
					<div class="card-detail-text">Product designer</div>
				</div>
				<div class="card-detail-right"><div class="badge border-radius-rounded background-primary OSInline"><span class="OSFillParent">3</span></div></div>
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
				story: 'Card Item row with circular avatar, title, subtitle, and an Active status Tag.',
			},
		},
	},
	render: () => renderStatic(detailItemMarkup()),
};

export const MetricRow: Story = {
	tags: ['docs-example'],
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
