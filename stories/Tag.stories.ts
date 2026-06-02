import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Tag — shipped markup: `<div class="tag border-radius-{shape} background-{color} OSInline">`. */
const meta: Meta = { title: 'Patterns/Content/Tag' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
				<div class="tag border-radius-rounded background-primary OSInline">High</div>
				<div class="tag border-radius-rounded background-primary-lightest OSInline">Medium</div>
				<div class="tag border-radius-soft background-neutral-2 OSInline">Low</div>
				<div class="tag border-radius-rounded background-red OSInline">Blocked</div>
			</div>`),
};
