import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

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
 * The story wires the open/close toggling inline and contains the fixed
 * container in a transformed demo box.
 */

interface ActionSheetArgs {
	showCancel: boolean;
	extendedClass: string;
}

const ACTIONS = ['Share', 'Add to favorites', 'Delete'];

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

/** The demo box with the (optionally pre-opened) sheet inside. */
function actionSheetMarkup(
	{ showCancel, extendedClass }: ActionSheetArgs,
	visible = false,
	height = 420,
	actions: readonly string[] = ACTIONS
): string {
	return `
		<div style="position: relative; transform: translateZ(0); overflow: hidden; height: ${height}px; border-radius: var(--border-radius-soft); background: var(--color-background-body);">
			<div style="padding: 16px;">
				<button type="button" class="btn btn-primary" data-open>Open action sheet</button>
			</div>
			<div class="${cls('action-sheet-container', 'action-sheet-container--animatable', visible && 'action-sheet-container--visible', extendedClass)}">
				<div class="action-sheet">
					<div class="action-sheet-buttons">
						${actions.map((a) => `<div class="action-sheet-actions"><button type="button" class="btn">${a}</button></div>`).join('')}
					</div>
					${showCancel ? '<div class="action-sheet-cancel"><button type="button" class="btn" data-cancel>Cancel</button></div>' : ''}
				</div>
			</div>
		</div>`;
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
		wireActionSheet(
			renderStatic(actionSheetMarkup({ showCancel: true, extendedClass: '' }, false, 360, PHOTO_ACTIONS))
		),
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
		wireActionSheet(
			renderStatic(actionSheetMarkup({ showCancel: true, extendedClass: '' }, true, 360, PHOTO_ACTIONS))
		),
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
						html: `<div style="width:320px;">${actionSheetMarkup({ showCancel: true, extendedClass: '' }, true, 320)}</div>`,
					},
					{
						label: 'without cancel',
						html: `<div style="width:320px;">${actionSheetMarkup({ showCancel: false, extendedClass: '' }, true, 320)}</div>`,
					},
				],
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
