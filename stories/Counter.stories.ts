import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard, SWATCH_COLORS } from './_helpers/showcase';

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

function counterMarkup({ backgroundColor, isVertical, height, extendedClass }: CounterArgs): string {
	return `
		<div class="${cls('counter', 'card', backgroundColor && `background-${backgroundColor}`, backgroundColor && 'text-neutral-0', extendedClass)}" style="max-width:240px;height:${height}px;">
			<div class="${cls('center-align', isVertical ? 'flex-direction-column' : 'flex-direction-row')}" style="gap:12px;">
				<div class="font-size-display text-neutral-0">26</div>
				<div>Completed requests</div>
				<div><i class="icon ph ph-check" style="font-size: 3em;"></i></div>
			</div>
		</div>`;
}

const baseArgs: CounterArgs = { backgroundColor: 'primary', isVertical: false, height: 150, extendedClass: '' };

export const Playground: StoryObj<CounterArgs> = {
	args: { ...baseArgs },
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
			description:
				'When True, content is displayed vertically (column). Maps to `flex-direction-column` on `.center-align`; False maps to `flex-direction-row`.',
		},
		height: {
			name: 'Height',
			control: { type: 'number', min: 50, step: 10 },
			description: 'Height of the block in pixels. Applied as inline style `height:{n}px`.',
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(counterMarkup(args)),
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

export const BasicUsage: StoryObj = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'A Primary tile, 150px tall, with the value, its label and an icon laid out in a row inside the Content placeholder.',
			},
		},
	},
	render: () => renderStatic(counterMarkup({ ...baseArgs })),
};

/** Horizontal (row) next to vertical (column) content layout. */
export const Orientation: StoryObj = {
	tags: ['docs-example'],
	name: 'Orientation',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>IsVertical</code> False spreads the content in a row (<code>flex-direction-row</code>, space-between); True stacks it in a centred column.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{ label: 'horizontal', html: counterMarkup({ ...baseArgs }) },
					{ label: 'vertical', html: counterMarkup({ ...baseArgs, isVertical: true }) },
				],
				{ direction: 'row' }
			).outerHTML
		),
};

export const BackgroundColors: StoryObj = {
	tags: ['docs-example'],
	name: 'Background colors',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>BackgroundColor</code> picks the <code>background-*</code> utility on the root; the text switches to <code>text-neutral-0</code> for contrast.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				['primary', 'green', 'orange'].map((color) => ({
					label: color,
					html: counterMarkup({ ...baseArgs, backgroundColor: color }),
				})),
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};

/** Every BackgroundColor swatch (solid; the Counter has no IsLight parameter). */
export const Colors: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				SWATCH_COLORS.map((color) => ({
					label: color,
					html: counterMarkup({ ...baseArgs, backgroundColor: color }),
				})),
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
