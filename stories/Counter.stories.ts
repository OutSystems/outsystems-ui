import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

/**
 * Counter — shipped: `.counter.card.background-{color}.text-neutral-0` > `.center-align.flex-direction-{row|column}` > value + label + icon.
 *
 * Controls mirror the low-code input parameters of the `Counter` block:
 *   BackgroundColor → `background-{value}` utility class on the root (+ `text-neutral-0` for contrast)
 *   IsVertical      → `flex-direction-column` (True) vs `flex-direction-row` (False) on `.center-align`
 *   Height          → inline style `height:{n}px` on the root
 *   ExtendedClass   → extra classes on the root
 * Class mappings from src/scss/04-patterns/05-numbers/_counter.scss.
 */
const meta: Meta = { title: 'Patterns/Numbers/Counter' };
export default meta;

type CounterArgs = { backgroundColor: string; isVertical: boolean; height: number; extendedClass: string };

export const Default: StoryObj<CounterArgs> = {
	args: { backgroundColor: 'primary', isVertical: false, height: 150, extendedClass: '' },
	argTypes: {
		backgroundColor: {
			name: 'BackgroundColor',
			control: 'select',
			options: COLOR_OPTIONS,
			description: 'Background color of the Block. Maps to `background-{value}` utility class on the root.',
		},
		isVertical: {
			name: 'IsVertical',
			control: 'boolean',
			description: 'When True, content is displayed vertically (column). Maps to `flex-direction-column` on `.center-align`; False maps to `flex-direction-row`.',
		},
		height: {
			name: 'Height',
			control: { type: 'number', min: 50, step: 10 },
			description: 'Height of the block in pixels. Applied as inline style `height:{n}px`.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ backgroundColor, isVertical, height, extendedClass }) =>
		renderStatic(`
			<div class="${cls('counter', 'card', backgroundColor && `background-${backgroundColor}`, backgroundColor && 'text-neutral-0', extendedClass)}" style="max-width:240px;height:${height}px;">
				<div class="${cls('center-align', isVertical ? 'flex-direction-column' : 'flex-direction-row')}" style="gap:12px;">
					<div class="font-size-display text-neutral-0">26</div>
					<div>Completed requests</div>
					<div><i class="icon fa fa-check fa-3x"></i></div>
				</div>
			</div>`),
};
