import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';
import { phoneFrame, phoneList } from './_helpers/phone';

/**
 * Bottom Sheet — runtime pattern (BottomSheetAPI). Block markup, from the rendered
 * low-code block:
 *
 *   .osui-bottom-sheet[.osui-bottom-sheet--is-open][.osui-bottom-sheet--has-handler]
 *     .osui-bottom-sheet__header > .osui-bottom-sheet__header__top-bar   TopBar placeholder
 *     .osui-bottom-sheet__content                                        Content placeholder
 *   .osui-bottom-sheet-overlay                                           next sibling; the backdrop
 *
 * `Open()` adds `--is-open`, which slides the sheet up and fades the sibling overlay in.
 * Being a phone pattern, every example renders inside a phone-sized app screen
 * (`_helpers/phone.ts`) — the containing block that keeps the fixed sheet and overlay
 * in the frame.
 */
interface BottomSheetArgs {
	showHandler: boolean;
	shape: string;
}

const meta: Meta<BottomSheetArgs> = {
	title: 'Patterns/Interaction/BottomSheet',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		showHandler: {
			control: 'boolean',
			name: 'ShowHandler',
			description: 'Shows the drag handler bar at the top of the sheet.',
		},
		shape: {
			// ShapeTypes values are soft / rounded / none. The low-code names fail
			// validateInRange and every option falls back to soft.
			control: { type: 'inline-radio', labels: { soft: 'SoftRounded', rounded: 'Rounded', none: 'Sharp' } },
			options: ['soft', 'rounded', 'none'],
			name: 'Shape',
			description: 'Corner shape of the sheet: SoftRounded (default), Rounded or Sharp.',
		},
	},
	args: { showHandler: true, shape: 'rounded' },
};
export default meta;

type Story = StoryObj<BottomSheetArgs>;

/**
 * The block markup: sheet plus its overlay sibling. `open` renders the open state into
 * the markup (for the galleries) instead of calling `Open()`, which also moves focus
 * into the sheet and would scroll a docs page to it on load.
 */
function sheetMarkup(id: string, title: string, content: string, open = false): string {
	return `
		<div ${osuiRoot(id)} class="osui-bottom-sheet${open ? ' osui-bottom-sheet--is-open' : ''}" aria-hidden="${!open}" tabindex="-1">
			<div class="osui-bottom-sheet__header">
				<div class="osui-bottom-sheet__header__top-bar"><strong>${title}</strong></div>
			</div>
			<div class="osui-bottom-sheet__content" style="padding: 16px;">${content}</div>
		</div>
		<div class="osui-bottom-sheet-overlay"></div>`;
}

function initSheet(id: string, configs: { ShowHandler: boolean; Shape: string }, register: Register): void {
	const P = Patterns();
	P.BottomSheetAPI.Create(id, cfg(configs));
	P.BottomSheetAPI.Initialize(id);
	register(() => P.BottomSheetAPI.Dispose?.(id));
}

/** Open on the `[data-open]` button, close on `[data-close]`. */
function wireSheet(root: HTMLElement, id: string): void {
	const P = Patterns();
	root.querySelector('[data-open]')?.addEventListener('click', () => P.BottomSheetAPI.Open(id));
	root.querySelector('[data-close]')?.addEventListener('click', () => P.BottomSheetAPI.Close(id));
}

const DELIVERY_SLOTS: Array<[window: string, price: string]> = [
	['08:00 – 10:00', 'Free'],
	['12:00 – 14:00', 'Free'],
	['18:00 – 20:00', '€2.90'],
];

/** The checkout screen under the sheet, with the button that opens it. */
function checkoutScreen(buttonLabel: string): string {
	return `
		${phoneList([
			['Espresso beans, 1 kg', '€18.50'],
			['Pour-over kettle', '€64.00'],
			['Filter papers, 100', '€4.20'],
		])}
		<div style="display: grid; gap: 12px; padding: 16px;">
			<div style="display: flex; justify-content: space-between;"><span>Total</span><strong>€86.70</strong></div>
			<button class="btn btn-primary" data-open type="button">${buttonLabel}</button>
		</div>`;
}

const SLOT_CONTENT = `
	<p style="margin: 0 0 12px;">Pick a window for Thursday, 14 March.</p>
	<div class="list" style="margin-bottom: 16px;">
		${DELIVERY_SLOTS.map(
			([window, price]) => `
		<div class="list-item" style="display: flex; justify-content: space-between;">
			<span>${window}</span>
			<span style="color: var(--color-text-subtle);">${price}</span>
		</div>`
		).join('')}
	</div>
	<button class="btn btn-primary" data-close type="button">Confirm slot</button>`;

export const Playground: Story = {
	render: (args) => {
		const id = uid('bottom-sheet');
		const template = phoneFrame({
			title: 'Checkout',
			content: checkoutScreen('Open bottom sheet'),
			overlay: sheetMarkup(id, 'Delivery slot', SLOT_CONTENT),
		});
		return renderPattern(template, (root, register) => {
			initSheet(id, { ShowHandler: args.showHandler, Shape: args.shape }, register);
			wireSheet(root, id);
		});
	},
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults — <code>Shape</code> SoftRounded and <code>ShowHandler</code> True. The sheet is fixed to the bottom of the screen: the button opens it over the dimmed page, the confirm button inside closes it.',
			},
		},
	},
	render: () => {
		const id = uid('bottom-sheet');
		const template = phoneFrame({
			title: 'Checkout',
			content: checkoutScreen('Choose delivery slot'),
			overlay: sheetMarkup(id, 'Delivery slot', SLOT_CONTENT),
		});
		return renderPattern(template, (root, register) => {
			initSheet(id, { ShowHandler: true, Shape: 'soft' }, register);
			wireSheet(root, id);
		});
	},
};

/** Small phone screens, one per variant, each with its sheet already open. */
function sheetGallery(cells: ReadonlyArray<{ id: string; label: string }>): string {
	return labeledBoard(
		cells.map((cell) => ({
			label: cell.label,
			html: phoneFrame({
				title: '',
				content: phoneList([
					['Order #4821', 'Shipped'],
					['Order #4817', 'Processing'],
				]),
				overlay: sheetMarkup(cell.id, 'Sheet title', '<p>Content slides up from the bottom edge.</p>', true),
				width: 220,
				height: 300,
			}),
		})),
		{ direction: 'row', wrap: true, gap: 16 }
	).outerHTML;
}

/**
 * Default omits a known shape, so validation falls back to SoftRounded (`soft`).
 * Then SoftRounded, Rounded (`rounded`) and Sharp (`none`).
 */
export const Shapes: Story = {
	tags: ['docs-example'],
	name: 'Shapes',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>Shape</code> — SoftRounded (the default, also what an unknown value falls back to), Rounded and Sharp. Each sheet is shown open on a small screen so the corner radius of the top edge is visible.',
			},
		},
	},
	render: () => {
		const shapes = [
			{ label: 'Default', shape: '' },
			{ label: 'SoftRounded', shape: 'soft' },
			{ label: 'Rounded', shape: 'rounded' },
			{ label: 'Sharp', shape: 'none' },
		] as const;
		const cells = shapes.map((shape) => ({ ...shape, id: uid('bottom-sheet') }));
		return renderPattern(sheetGallery(cells), (_root, register) => {
			for (const cell of cells) {
				initSheet(cell.id, { ShowHandler: true, Shape: cell.shape }, register);
			}
		});
	},
};

/** The drag bar is the `osui-bottom-sheet--has-handler` class. The block default is on. */
export const Handler: Story = {
	tags: ['docs-example'],
	name: 'Drag handler',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>ShowHandler</code> True adds the drag bar (<code>osui-bottom-sheet--has-handler</code>) at the top of the sheet; False hides it. On touch devices the header is the drag area either way.',
			},
		},
	},
	render: () => {
		const handlers = [
			{ label: 'With handler', showHandler: true },
			{ label: 'Without handler', showHandler: false },
		] as const;
		const cells = handlers.map((handler) => ({ ...handler, id: uid('bottom-sheet') }));
		return renderPattern(sheetGallery(cells), (_root, register) => {
			for (const cell of cells) {
				initSheet(cell.id, { ShowHandler: cell.showHandler, Shape: 'soft' }, register);
			}
		});
	},
};
