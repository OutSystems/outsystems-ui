import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic, uid } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';
import { phoneFrame, phoneList } from './_helpers/phone';

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
 * Every example renders in a phone-sized app screen (`_helpers/phone.ts`): the
 * frame is the containing block that anchors the fixed stack and overlay, and
 * it restores the overlay that the desktop body class hides.
 */

interface FloatingActionsArgs {
	isExpanded: boolean;
	isHover: boolean;
	extendedClass: string;
}

const ACTIONS: Array<[label: string, icon: string]> = [
	['New message', 'ph-envelope'],
	['Add contact', 'ph-user-plus'],
	['Schedule', 'ph-calendar-plus'],
];

function itemMarkup(label: string, icon: string, delay: number, pseudoAttr = ''): string {
	return `
		<div class="floating-actions-item" style="--delay: ${delay}">
			<span >${label}</span>
			<div class="floating-actions-item-button"${pseudoAttr} role="button" tabindex="0" aria-label="${label}">
				<i class="icon ph ${icon}"></i>
			</div>
		</div>`;
}

const meta: Meta<FloatingActionsArgs> = {
	title: 'Patterns/Interaction/FloatingActions',
	tags: ['!ui-pending', 'ui-reviewed'],
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

/** The screen under the stack — a contacts list. */
const CONTACT_ROWS: Array<[title: string, meta: string]> = [
	['Ana Martins', 'Product design'],
	['Bruno Costa', 'Engineering'],
	['Carla Nunes', 'Customer success'],
	['Diogo Reis', 'Sales'],
	['Eva Lopes', 'Finance'],
];

/**
 * The phone screen with the FAB stack over it, open or closed.
 * `hover` marks the main FAB or the first item button with a `data-pseudo`
 * attribute, which the OpenStates `pseudo` parameter forces into `:hover`
 * (storybook-addon-pseudo-states).
 */
function floatingActionsMarkup(
	isExpanded: boolean,
	extendedClass: string,
	frame: { width: number; height: number } = { width: 390, height: 560 },
	hover?: 'button' | 'item'
): string {
	// Items animate bottom→top: the item closest to the FAB gets --delay: 1.
	const items = ACTIONS.map(([label, icon], i) =>
		itemMarkup(label, icon, ACTIONS.length - i, hover === 'item' && i === 0 ? ' data-pseudo="item-hover"' : '')
	).join('');
	const fabPseudo = hover === 'button' ? ' data-pseudo="fab-hover"' : '';
	const stack = `
		<div class="floating-overlay"></div>
		<div id="${uid('floating-actions')}" class="${cls('floating-actions-wrapper', isExpanded && 'is--open', extendedClass)}">
			<div class="floating-items" aria-hidden="${!isExpanded}">${items}</div>
			<div class="floating-button"${fabPseudo} role="button" tabindex="0" aria-expanded="${isExpanded}" aria-label="Toggle actions">
				<i class="icon ph ph-plus"></i>
			</div>
		</div>`;
	return phoneFrame({ title: 'Contacts', content: phoneList(CONTACT_ROWS), overlay: stack, ...frame });
}

/**
 * Mirrors the block's IsHover / IsExpanded behaviour (what the removed runtime
 * did): click or hover toggles `.is--open` on the wrapper and the overlay,
 * Esc and an overlay click close, Enter / Space toggle from the keyboard.
 */
function wireFloatingActions(root: HTMLElement, isHover: boolean): HTMLElement {
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
}

export const Playground: Story = {
	render: ({ isExpanded, isHover, extendedClass }) =>
		wireFloatingActions(renderStatic(floatingActionsMarkup(isExpanded, extendedClass)), isHover),
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults — <code>IsExpanded</code> False and <code>IsHover</code> False. The main button toggles the three Floating Actions Items on click; Esc or a click on the overlay closes them.',
			},
		},
	},
	render: () => wireFloatingActions(renderStatic(floatingActionsMarkup(false, '')), false),
};

export const StartsExpanded: Story = {
	tags: ['docs-example'],
	name: 'Starts expanded',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>IsExpanded</code> True — the items are visible as soon as the screen renders (<code>.is--open</code>) and the main button shows the close rotation.',
			},
		},
	},
	render: () => wireFloatingActions(renderStatic(floatingActionsMarkup(true, '')), false),
};

export const HoverTrigger: Story = {
	tags: ['docs-example'],
	name: 'Hover trigger',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>IsHover</code> True — moving the pointer over the stack (or focusing the main button) opens it, leaving closes it. No click is needed.',
			},
		},
	},
	render: () => wireFloatingActions(renderStatic(floatingActionsMarkup(false, '')), true),
};

/**
 * The FAB stack closed next to its expanded (`.is--open`) state, plus the two
 * hover states (forced via storybook-addon-pseudo-states): the main FAB
 * hovered, and an expanded item button hovered.
 */
const SMALL = { width: 260, height: 340 };

export const OpenStates: Story = {
	parameters: {
		controls: { disable: true },
		pseudo: { hover: ['[data-pseudo="fab-hover"]', '[data-pseudo="item-hover"]'] },
	},
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{ label: 'closed', html: floatingActionsMarkup(false, '', SMALL) },
					{ label: 'hover (button)', html: floatingActionsMarkup(false, '', SMALL, 'button') },
					{ label: 'open (is--open)', html: floatingActionsMarkup(true, '', SMALL) },
					{ label: 'open + item hover', html: floatingActionsMarkup(true, '', SMALL, 'item') },
				],
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
