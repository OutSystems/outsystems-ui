import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Scrollable Area — CSS-only. Controls mirror the `Interaction/ScrollableArea` block's
 * low-code input parameters; the class mapping comes from
 * src/scss/04-patterns/03-interaction/_scrollable-area.scss:
 *
 *   .scrollable-area-content          root; sized by --scrollable-area-height / -width
 *   .horizontal-scroll                Orientation = Horizontal
 *   .vertical-scroll                  Orientation = Vertical
 *   .compact                          ScrollbarStyle = Compact (slim, hover-revealed)
 *   .none                             ScrollbarStyle = None (scrolls, scrollbar hidden)
 *
 * Orientation and ScrollbarStyle are two independent parameters — `None` is a scrollbar
 * style, not a direction.
 *
 * The horizontal stories deliberately use the plain block markup, with no inline
 * `display: flex` propping the layout up: `.horizontal-scroll` has to put the items on
 * one line by itself (`white-space: nowrap` + inline-block children) or nothing
 * overflows the inline axis and there is nothing to scroll. That regressed once when
 * those declarations were dropped along with `10-deprecated/`, so these stories are the
 * guard — flip the toolbar's Theme between New and Classic and the two must scroll alike.
 */

const ORIENTATION_OPTIONS = ['Horizontal', 'Vertical'] as const;
const SCROLLBAR_OPTIONS = ['Default', 'Compact', 'None'] as const;

type Orientation = (typeof ORIENTATION_OPTIONS)[number];
type ScrollbarStyle = (typeof SCROLLBAR_OPTIONS)[number];

/** Orientation static-entity record → scroll-direction class. */
const ORIENTATION_CLASS: Record<Orientation, string> = {
	Horizontal: 'horizontal-scroll',
	Vertical: 'vertical-scroll',
};

/** ScrollbarStyle static-entity record → modifier class (`Default` adds none). */
const SCROLLBAR_CLASS: Record<ScrollbarStyle, string> = {
	Default: '',
	Compact: 'compact',
	None: 'none',
};

interface ScrollableAreaArgs {
	orientation: Orientation;
	scrollbarStyle: ScrollbarStyle;
	height: string;
	width: string;
	extendedClass: string;
}

const argTypes = {
	orientation: {
		name: 'Orientation',
		control: 'inline-radio',
		options: [...ORIENTATION_OPTIONS],
		description: 'Choose from Horizontal or Vertical orientation.',
	},
	scrollbarStyle: {
		name: 'ScrollbarStyle',
		control: 'inline-radio',
		options: [...SCROLLBAR_OPTIONS],
		description: '`None` hides the scrollbar; the area still scrolls.',
	},
	height: {
		name: 'Height',
		control: 'text',
		description: 'Height of the component. If empty, the height of the parent is used.',
	},
	width: {
		name: 'Width',
		control: 'text',
		description: 'Width of the component. If empty, the width of the parent is used.',
	},
	extendedClass: extendedClassArgType,
} as const;

const meta: Meta<ScrollableAreaArgs> = {
	title: 'Patterns/Interaction/ScrollableArea',
	argTypes,
	args: { orientation: 'Horizontal', scrollbarStyle: 'Compact', height: '', width: '360px', extendedClass: '' },
};
export default meta;

type Story = StoryObj<ScrollableAreaArgs>;

/** The two `--scrollable-area-*` custom properties the block writes from Height / Width. */
function sizeVars({ height, width }: Pick<ScrollableAreaArgs, 'height' | 'width'>): string {
	return cls(height && `--scrollable-area-height: ${height};`, width && `--scrollable-area-width: ${width};`);
}

/**
 * The block's shipped shape: a `[data-block]` wrapper (what Service Studio emits around
 * every block, and what the scrollbar rules key off) around the `.scrollable-area-content`
 * root, which holds the Content placeholder.
 */
function scrollableAreaHtml(args: ScrollableAreaArgs, content: string): string {
	const modifiers = cls(
		ORIENTATION_CLASS[args.orientation],
		SCROLLBAR_CLASS[args.scrollbarStyle],
		args.extendedClass
	);
	return `
		<div data-block="Interaction.ScrollableArea">
			<div class="scrollable-area-content ${modifiers}" style="${sizeVars(args)}">${content}</div>
		</div>`;
}

const scrollableArea = (args: ScrollableAreaArgs, content: string): HTMLElement =>
	renderStatic(scrollableAreaHtml(args, content));

/** Cards sized so that they overflow the area on whichever axis is being scrolled. */
function cards(count: number, orientation: Orientation): string {
	const style = orientation === 'Horizontal' ? 'width: 160px;' : 'margin-block-end: 8px;';
	return Array.from({ length: count }, (_, i) => `<div class="card" style="${style}">Item ${i + 1}</div>`).join('');
}

/**
 * Loose widgets dropped straight into the Content placeholder — styled by
 * `.horizontal-scroll > *:not(table)`.
 */
export const Playground: Story = {
	tags: ['docs-example'],
	render: (args) => scrollableArea(args, cards(12, args.orientation)),
};

/**
 * Vertical orientation. The scroll comes from `Height` constraining the area below its
 * content height, so this story pins one.
 */
export const Vertical: Story = {
	args: { orientation: 'Vertical', height: '220px', width: '320px' },
	render: (args) => scrollableArea(args, cards(12, args.orientation)),
};

/**
 * Content wrapped in a List widget — the common shape, and a separate code path:
 * the scroll and the inline layout are handed down to `.list.list-group` and
 * `.horizontal-scroll > .list > *` rather than applying to the children directly.
 */
export const HorizontalWithList: Story = {
	args: { orientation: 'Horizontal', width: '360px' },
	render: (args) => scrollableArea(args, `<div class="list list-group">${cards(12, args.orientation)}</div>`),
};

/**
 * The three ScrollbarStyle records side by side: `Default` (native scrollbar),
 * `Compact` (slim, revealed on hover) and `None` (hidden, still scrollable).
 */
export const ScrollbarStyles: Story = {
	args: { orientation: 'Horizontal', width: '320px' },
	// Each area below pins its own style, so the shared control has nothing to drive.
	argTypes: { scrollbarStyle: { control: false, table: { disable: true } } },
	render: (args) =>
		renderStatic(
			SCROLLBAR_OPTIONS.map(
				(style) => `
					<div style="margin-block-end: 24px;">
						<p class="text-neutral-7" style="margin-block-end: 8px;">ScrollbarStyle = ${style}</p>
						${scrollableAreaHtml({ ...args, scrollbarStyle: style }, cards(10, args.orientation))}
					</div>`
			).join('')
		),
};
