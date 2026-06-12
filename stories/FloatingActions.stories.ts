import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic, uid } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Floating Actions (parent) + Floating Actions Item (children).
 *
 * CSS-only in this library: the TS behavior (FloatingActionsAPI /
 * FloatingActionsItemAPI) was removed from the bundle in v2.12.0 (09b65010c) —
 * the ODC block drives the classes from low-code. The styling contract lives in
 * src/scss/04-patterns/03-interaction/_floating-actions.scss:
 *
 *   .floating-actions-wrapper          fixed bottom-right container
 *     .floating-items                  column of items (aria-hidden when closed)
 *       .floating-actions-item         one action, style="--delay: N" staggers the
 *                                      open animation (bottom item = 1, counting up)
 *         .floating-actions-item-button  the small round button
 *     .floating-button                 the main FAB (rotates 135° when open)
 *   .floating-overlay                  backdrop sibling — `.desktop` hides it, so it
 *                                      only shows under the tablet/phone body classes
 *
 *   Open state = `.is--open` on BOTH the wrapper and the overlay.
 *
 * The story wires the old runtime's behavior (toggle on click / hover, Esc and
 * overlay close) inline, mirroring the block's IsExpanded / IsHover parameters.
 * The demo box is a transformed containing block so `position: fixed` anchors to
 * it instead of the viewport.
 */

interface FloatingActionsArgs {
	isExpanded: boolean;
	isHover: boolean;
	extendedClass: string;
}

const ACTIONS: Array<[label: string, icon: string]> = [
	['New message', 'fa-envelope-o'],
	['Add contact', 'fa-user-plus'],
	['Schedule', 'fa-calendar-plus-o'],
];

function itemMarkup(label: string, icon: string, delay: number): string {
	return `
		<div class="floating-actions-item" style="--delay: ${delay}">
			<span style="background: var(--color-background-surface); border-radius: var(--border-radius-soft); box-shadow: var(--osui-floating-actions-button-shadow, none); font-size: 13px; padding: 4px 12px;">${label}</span>
			<div class="floating-actions-item-button" role="button" tabindex="0" aria-label="${label}">
				<i class="icon fa ${icon} fa-1x"></i>
			</div>
		</div>`;
}

const meta: Meta<FloatingActionsArgs> = {
	title: 'Patterns/Interaction/FloatingActions',
	argTypes: {
		isExpanded: {
			name: 'IsExpanded',
			control: 'boolean',
			description: 'When true, the floating actions start expanded.',
		},
		isHover: {
			name: 'IsHover',
			control: 'boolean',
			description: 'When true, the actions open on hover instead of click.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { isExpanded: false, isHover: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<FloatingActionsArgs>;

export const Default: Story = {
	render: ({ isExpanded, isHover, extendedClass }) => {
		const id = uid('floating-actions');
		// Items animate bottom→top: the item closest to the FAB gets --delay: 1.
		const items = ACTIONS.map(([label, icon], i) => itemMarkup(label, icon, ACTIONS.length - i)).join('');
		const root = renderStatic(`
			<div style="position: relative; transform: translateZ(0); overflow: hidden; height: 420px; width: 420px; max-width: 100%; border-radius: var(--border-radius-soft); background: var(--color-background-body);">
				<div class="floating-overlay"></div>
				<div id="${id}" class="${cls('floating-actions-wrapper', isExpanded && 'is--open', extendedClass)}">
					<div class="floating-items" aria-hidden="${!isExpanded}">${items}</div>
					<div class="floating-button" role="button" tabindex="0" aria-expanded="${isExpanded}" aria-label="Toggle actions">
						<i class="icon fa fa-plus fa-1x"></i>
					</div>
				</div>
			</div>`);

		const wrapper = root.querySelector<HTMLElement>('.floating-actions-wrapper')!;
		const overlay = root.querySelector<HTMLElement>('.floating-overlay')!;
		const itemsEl = root.querySelector<HTMLElement>('.floating-items')!;
		const button = root.querySelector<HTMLElement>('.floating-button')!;

		const setOpen = (open: boolean): void => {
			wrapper.classList.toggle('is--open', open);
			overlay.classList.toggle('is--open', open);
			button.setAttribute('aria-expanded', String(open));
			itemsEl.setAttribute('aria-hidden', String(!open));
		};
		const toggle = (): void => setOpen(!wrapper.classList.contains('is--open'));

		if (isHover) {
			wrapper.addEventListener('mouseenter', () => setOpen(true));
			wrapper.addEventListener('mouseleave', () => setOpen(false));
			button.addEventListener('focus', () => setOpen(true));
		} else {
			button.addEventListener('click', toggle);
		}
		overlay.addEventListener('click', () => setOpen(false));
		wrapper.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
			if ((e.key === 'Enter' || e.key === ' ') && e.target === button) {
				e.preventDefault();
				toggle();
			}
		});

		return root;
	},
};
