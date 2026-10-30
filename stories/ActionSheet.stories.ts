import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';
import { phoneFrame, PHONE_WIDTH } from './_helpers/phone';

/**
 * Action Sheet — CSS-only mobile pattern (the low-code block toggles the
 * classes). Contract from src/scss/04-patterns/03-interaction/_action-sheet.scss:
 *
 *   .action-sheet-container             fixed full-screen host; backdrop is its ::after
 *   .action-sheet-container--visible    open state (backdrop fades in, sheet slides up)
 *   .action-sheet-container--animatable enables the slide transition
 *   .action-sheet                       the bottom sheet itself
 *     .action-sheet-buttons > .action-sheet-actions > .btn   one row per action
 *     .action-sheet-cancel > .btn                            cancel row
 *
 * The story wires the open/close toggling inline. Being a phone pattern, every
 * example renders inside a phone-sized app screen (`_helpers/phone.ts`), which is
 * also the containing block that keeps the fixed container in the frame.
 */

interface ActionSheetArgs {
	showCancel: boolean;
	extendedClass: string;
}

const ACTIONS = ['Share', 'Add to favorites', 'Delete'];

/** The phone screen of the Playground and the docs examples, cropped below the 700px default. */
const DEFAULT_FRAME = { width: PHONE_WIDTH, height: 560 };

const meta: Meta<ActionSheetArgs> = {
	title: 'Patterns/Interaction/ActionSheet',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		showCancel: {
			name: 'ShowCancel',
			control: 'boolean',
			description: 'Renders the cancel row below the actions.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { showCancel: true, extendedClass: '' },
};
export default meta;

type Story = StoryObj<ActionSheetArgs>;

/** The screen under the sheet: a selected photo and the button that opens the actions. */
const PHOTO_SCREEN = `
	<div style="display: grid; gap: 16px; padding: 16px;">
		<div style="aspect-ratio: 4 / 3; border-radius: var(--border-radius-md, 16px); background: linear-gradient(135deg, var(--color-neutral-3, #e8e8e8), var(--color-neutral-5, #b8b8b8));"></div>
		<div>
			<div class="font-semi-bold">Lisbon, March 2026</div>
			<div class="font-size-s text-neutral-7">4,032 × 3,024 · 2.4 MB</div>
		</div>
		<button type="button" class="btn btn-primary" data-open>More options</button>
	</div>`;

/** The phone screen with the (optionally pre-opened) sheet over it. */
function actionSheetMarkup(
	{ showCancel, extendedClass }: ActionSheetArgs,
	visible = false,
	actions: readonly string[] = ACTIONS,
	frame: { width: number; height: number } = DEFAULT_FRAME
): string {
	const sheet = `
		<div class="${cls('action-sheet-container', 'action-sheet-container--animatable', visible && 'action-sheet-container--visible', extendedClass)}">
			<div class="action-sheet">
				<div class="action-sheet-buttons">
					${actions.map((a) => `<div class="action-sheet-actions"><button type="button" class="btn">${a}</button></div>`).join('')}
				</div>
				${showCancel ? '<div class="action-sheet-cancel"><button type="button" class="btn" data-cancel>Cancel</button></div>' : ''}
			</div>
		</div>`;
	return phoneFrame({ title: 'Photos', content: PHOTO_SCREEN, overlay: sheet, ...frame });
}

/**
 * Mirrors what the low-code block does with IsOpen: the open button adds
 * `--visible`, the cancel row and a backdrop click remove it.
 */
function wireActionSheet(root: HTMLElement): HTMLElement {
	const container = root.querySelector<HTMLElement>('.action-sheet-container')!;
	const setOpen = (open: boolean): void => {
		container.classList.toggle('action-sheet-container--visible', open);
	};
	root.querySelector('[data-open]')?.addEventListener('click', () => setOpen(true));
	root.querySelector('[data-cancel]')?.addEventListener('click', () => setOpen(false));
	// backdrop click: the ::after overlay is the container itself
	container.addEventListener('click', (e) => {
		if (e.target === container) setOpen(false);
	});
	return root;
}

export const Playground: Story = {
	render: (args) => wireActionSheet(renderStatic(actionSheetMarkup(args))),
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

const PHOTO_ACTIONS = ['Share photo', 'Save to album', 'Delete photo'];

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Three actions for a selected photo. <code>IsOpen</code> is False until the button sets it, then the backdrop fades in and the sheet slides up; Cancel or a backdrop tap closes it.',
			},
		},
	},
	render: () =>
		wireActionSheet(renderStatic(actionSheetMarkup({ showCancel: true, extendedClass: '' }, false, PHOTO_ACTIONS))),
};

export const OpenState: Story = {
	tags: ['docs-example'],
	name: 'Open state',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>IsOpen</code> is True, so the sheet renders already open (<code>.action-sheet-container--visible</code>). Bind IsOpen to a Boolean variable and reset it in <code>OnClose</code>.',
			},
		},
	},
	render: () =>
		wireActionSheet(renderStatic(actionSheetMarkup({ showCancel: true, extendedClass: '' }, true, PHOTO_ACTIONS))),
};

/** Sheet pinned open (`--visible`), with and without the cancel row. */
export const OpenStates: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{
						label: 'with cancel',
						html: actionSheetMarkup({ showCancel: true, extendedClass: '' }, true, ACTIONS, {
							width: 300,
							height: 400,
						}),
					},
					{
						label: 'without cancel',
						html: actionSheetMarkup({ showCancel: false, extendedClass: '' }, true, ACTIONS, {
							width: 300,
							height: 400,
						}),
					},
				],
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
