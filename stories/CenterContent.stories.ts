import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Center Content — CSS-only utility. Contract from
 * src/scss/04-patterns/06-utilities/_center-content.scss:
 *
 *   .center-content                full-height flex column
 *     .center-content-header       pinned top slot
 *     .center-content-container    flex: 1, centers its child both axes
 *     .center-content-bottom       pinned bottom slot
 *
 * Needs a sized parent — the demo box provides the height.
 */

interface CenterContentArgs {
	showHeader: boolean;
	showBottom: boolean;
	extendedClass: string;
}

const meta: Meta<CenterContentArgs> = {
	title: 'Patterns/Utilities/CenterContent',
	argTypes: {
		showHeader: { name: 'Header slot', control: 'boolean' },
		showBottom: { name: 'Bottom slot', control: 'boolean' },
		extendedClass: extendedClassArgType,
	},
	args: { showHeader: true, showBottom: true, extendedClass: '' },
};
export default meta;

type Story = StoryObj<CenterContentArgs>;

export const Default: Story = {
	render: ({ showHeader, showBottom, extendedClass }) =>
		renderStatic(`
			<div style="height: 320px; max-width: 420px; border: 1px dashed var(--color-border); border-radius: var(--border-radius-soft);">
				<div class="${cls('center-content', extendedClass)}">
					${showHeader ? '<div class="center-content-header" style="padding: 12px 16px; color: var(--color-text-subtle);">Header slot</div>' : ''}
					<div class="center-content-container">
						<div style="text-align: center;">
							<div class="card" style="display: inline-block; padding: 16px 24px;">Vertically + horizontally centered</div>
						</div>
					</div>
					${showBottom ? '<div class="center-content-bottom" style="padding: 12px 16px; color: var(--color-text-subtle);">Bottom slot</div>' : ''}
				</div>
			</div>`),
};
