import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Master Detail — shipped root `.split-screen-wrapper.is--full-height` > `.split-left > .list.list-group > [data-list-item].list-item(.list-item-selected)` + `.split-right > .split-right-content`. */
const meta: Meta = { title: 'Patterns/Adaptive/MasterDetail' };
export default meta;
type Story = StoryObj;

const li = (selected: boolean, label: string) =>
	`<div data-list-item class="list-item ${selected ? 'list-item-selected' : ''}"><div class="list-item-content"><div class="list-item-content-center"><div class="list-item-content-title">${label}</div></div></div></div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="split-screen-wrapper is--full-height" style="--left-percentage:40%;display:flex;min-height:280px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
				<div class="split-left OSInline" style="flex:0 0 40%;border-right:1px solid #eee;">
					<div class="list list-group">${li(true, 'Inbox')}${li(false, 'Drafts')}${li(false, 'Sent')}</div>
				</div>
				<div class="split-right" style="flex:1;">
					<div class="split-right-content" style="padding:24px;"><h2 style="margin:0;">Inbox</h2><p>Select an item from the list.</p></div>
				</div>
			</div>`),
};
