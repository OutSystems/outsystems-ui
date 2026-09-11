import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Scrollable Area — CSS-only. Contract from
 * src/scss/04-patterns/03-interaction/_scrollable-area.scss:
 *
 *   .scrollable-area-content                 root; sized by --scrollable-area-height / -width
 *   .vertical-scroll | .horizontal-scroll | .none   scroll direction (none hides scrollbars)
 *   .compact                                 slim auto-hiding scrollbars
 */

const DIRECTION_OPTIONS = ['vertical-scroll', 'horizontal-scroll', 'none'] as const;
type Direction = (typeof DIRECTION_OPTIONS)[number];

interface ScrollableAreaArgs {
	direction: Direction;
	compact: boolean;
	height: string;
	extendedClass: string;
}

const meta: Meta<ScrollableAreaArgs> = {
	title: 'Patterns/Interaction/ScrollableArea',
	argTypes: {
		direction: {
			name: 'ScrollDirection',
			control: 'inline-radio',
			options: DIRECTION_OPTIONS,
			description: '`none` keeps the area scrollable but hides the scrollbars.',
		},
		compact: { name: 'UseCompactScrollbar', control: 'boolean' },
		height: { name: 'Height', control: 'text' },
		extendedClass: extendedClassArgType,
	},
	args: { direction: 'vertical-scroll', compact: true, height: '200px', extendedClass: '' },
};
export default meta;

type Story = StoryObj<ScrollableAreaArgs>;

export const Default: Story = {
	render: ({ direction, compact, height, extendedClass }) => {
		const horizontal = direction === 'horizontal-scroll';
		const items = Array.from({ length: 12 }, (_, i) => {
			const style = horizontal ? 'min-width: 160px;' : '';
			return `<div class="card" style="padding: 12px 16px; margin: 4px; ${style}">Item ${i + 1}</div>`;
		}).join('');
		return renderStatic(`
			<div
				class="${cls('scrollable-area-content', direction, compact && 'compact', extendedClass)}"
				style="--scrollable-area-height: ${height}; max-width: 360px; ${horizontal ? 'display: flex;' : ''}"
			>
				${items}
			</div>`);
	},
};
