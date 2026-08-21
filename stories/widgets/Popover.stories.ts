import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Popover — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17. The widget
 * renders its two placeholders into two regions and toggles a class on the root:
 *
 *   collapsed → `div[data-popover].""`
 *                 > `.popover-top`      ← trigger placeholder
 *   expanded  → `div[data-popover]." popover-expanded"`
 *                 > `.popover-top`
 *                 > `.popover-bottom.align-center` (inline `width` from `popoverWidth`)
 *
 * The leading space in `class=" popover-expanded"` is emitted verbatim (empty
 * `style` + appended state class) and reproduced.
 *
 * Both states get a story. Previously only the collapsed one was ever
 * snapshotted — Chromatic captures the initial render, so mounting the live
 * widget never photographed `.popover-bottom` at all, and
 * src/scss/03-widgets/_popover.scss / _popover-odc.scss went untested. Splitting
 * the state into a second story is how a static transcription buys that back.
 */
const meta: Meta = { title: 'Widgets/Popover' };
export default meta;
type Story = StoryObj;

const trigger = `<div class="popover-top"><button class="btn" type="button">Open popover ▾</button></div>`;
const content = `
		<div class="popover-bottom align-center" style="width: 220px;">
			<div>
				<div class="dropdown-item" style="padding:8px 12px;cursor:pointer;">Edit</div>
				<div class="dropdown-item" style="padding:8px 12px;cursor:pointer;">Duplicate</div>
				<div class="dropdown-item" style="padding:8px 12px;cursor:pointer;">Delete</div>
			</div>
		</div>`;

export const Default: Story = {
	render: () => renderStatic(`<div data-popover="" class="">${trigger}</div>`),
};

/** The expanded state — `.popover-bottom` is what carries the widget's own CSS. */
export const Expanded: Story = {
	render: () =>
		renderStatic(`
			<div style="padding:20px;min-height:200px;">
				<div data-popover="" class=" popover-expanded">
					${trigger}
					${content}
				</div>
			</div>`),
};
