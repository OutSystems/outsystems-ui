import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Margin Container — CSS-only utility wrapping content in the standard screen
 * padding (src/scss/04-patterns/06-utilities/_margin-container.scss —
 * `$token-scale-600`, denser on native phone/tablet layouts).
 */

interface MarginContainerArgs {
	extendedClass: string;
}

const meta: Meta<MarginContainerArgs> = {
	title: 'Patterns/Utilities/MarginContainer',
	argTypes: { extendedClass: extendedClassArgType },
	args: { extendedClass: '' },
};
export default meta;

type Story = StoryObj<MarginContainerArgs>;

export const Default: Story = {
	render: ({ extendedClass }) =>
		renderStatic(`
			<div style="max-width: 420px; border: 1px dashed var(--color-border); border-radius: var(--border-radius-soft);">
				<div class="${cls('margin-container', extendedClass)}">
					<div class="card" style="padding: 16px;">Content inside a Margin Container keeps the standard screen padding (dashed line = container edge).</div>
				</div>
			</div>`),
};
