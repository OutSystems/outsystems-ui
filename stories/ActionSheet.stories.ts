import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

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

export const Default: Story = {
	render: ({ showCancel, extendedClass }) => {
		const root = renderStatic(`
			<div style="position: relative; transform: translateZ(0); overflow: hidden; height: 420px; border-radius: var(--border-radius-soft); background: var(--color-background-body);">
				<div style="padding: 16px;">
					<button type="button" class="btn btn-primary" data-open>Open action sheet</button>
				</div>
				<div class="${cls('action-sheet-container', 'action-sheet-container--animatable', extendedClass)}">
					<div class="action-sheet">
						<div class="action-sheet-buttons">
							${ACTIONS.map((a) => `<div class="action-sheet-actions"><button type="button" class="btn">${a}</button></div>`).join('')}
						</div>
						${showCancel ? '<div class="action-sheet-cancel"><button type="button" class="btn" data-cancel>Cancel</button></div>' : ''}
					</div>
				</div>
			</div>`);

		const container = root.querySelector<HTMLElement>('.action-sheet-container')!;
		const setOpen = (open: boolean): void => container.classList.toggle('action-sheet-container--visible', open);
		root.querySelector('[data-open]')?.addEventListener('click', () => setOpen(true));
		root.querySelector('[data-cancel]')?.addEventListener('click', () => setOpen(false));
		// backdrop click: the ::after overlay is the container itself
		container.addEventListener('click', (e) => {
			if (e.target === container) setOpen(false);
		});
		return root;
	},
};
