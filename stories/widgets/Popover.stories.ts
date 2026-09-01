import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderPattern, renderStatic } from '../_helpers/osui';

/**
 * Popover — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17, in both
 * states (the expanded one by dispatching a real click before reading the DOM).
 * The widget renders its two placeholders into two regions and toggles a class
 * on the root:
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
 * `Default` re-wires the toggle — expand on trigger click, collapse on an outside
 * click, matching the widget's own behaviour — by adding and removing exactly the
 * captured `.popover-bottom` node and the `popover-expanded` class. `Expanded` is
 * the state pinned open, because Chromatic photographs the initial render only:
 * without it the expanded DOM would never be snapshotted, which is how
 * `_popover.scss` / `_popover-odc.scss` went untested even while this story
 * mounted the live widget.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Popover',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

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
	render: ({ styleClasses }) =>
		renderPattern(
			`<div style="padding:20px;min-height:220px;">
				<div data-popover="" class="${cls(styleClasses)}">${trigger}</div>
			</div>`,
			(root, register) => {
				const popover = root.querySelector<HTMLElement>('[data-popover]')!;
				const top = popover.querySelector<HTMLElement>('.popover-top')!;

				const setOpen = (open: boolean): void => {
					// The widget appends/removes the content region rather than hiding it,
					// and its root className keeps the leading space from an empty `style`.
					popover.className = cls(styleClasses, open && 'popover-expanded');
					popover.querySelector('.popover-bottom')?.remove();
					if (open) {
						popover.insertAdjacentHTML('beforeend', content);
					}
				};

				top.addEventListener('click', () => setOpen(!popover.classList.contains('popover-expanded')));

				// Outside click collapses, as the live widget does via a document listener.
				// Registered for teardown so it does not survive a story switch.
				const onDocClick = (e: MouseEvent): void => {
					if (!popover.contains(e.target as Node)) {
						setOpen(false);
					}
				};
				document.addEventListener('click', onDocClick);
				register(() => document.removeEventListener('click', onDocClick));
			}
		),
};

/** Pinned open — the state that carries the widget's own CSS, so Chromatic sees it. */
export const Expanded: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<div style="padding:20px;min-height:220px;">
				<div data-popover="" class="${cls('popover-expanded', styleClasses)}">
					${trigger}
					${content}
				</div>
			</div>`),
};
