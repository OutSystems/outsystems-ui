import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Badge — shipped markup: `<div class="badge border-radius-rounded background-{color} OSInline"><span>n</span></div>`. */
const meta: Meta = { title: 'Patterns/Numbers/Badge' };
export default meta;
type Story = StoryObj;

const badge = (color: string, n: string) => `<div class="badge border-radius-rounded background-${color} OSInline"><span class="OSFillParent">${n}</span></div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="display:flex;gap:12px;align-items:center;">
				${badge('primary', '1')}
				${badge('primary-lightest', '12')}
				${badge('red', '99+')}
			</div>`),
};
