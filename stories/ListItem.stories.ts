import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** List Item (Content) — shipped: `[data-list-item].list-item` > `.list-item-content` > `.list-item-content-left|center|right`. */
const meta: Meta = { title: 'Patterns/Content/ListItem' };
export default meta;
type Story = StoryObj;

const item = (selected: boolean, title: string, text: string, right = '') => `
	<div data-list-item class="list-item ${selected ? 'list-item-selected' : ''}">
		<div class="list-item-content">
			<div class="list-item-content-center">
				<div class="list-item-content-title">${title}</div>
				<div class="list-item-content-text">${text}</div>
			</div>
			${right ? `<div class="list-item-content-right">${right}</div>` : ''}
		</div>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="list list-group" style="max-width:420px;">
				${item(false, 'First item', 'A tappable row with a title and supporting text.')}
				${item(true, 'Selected item', 'This row is selected.', '<i class="icon fa fa-check fa-1x"></i>')}
				${item(false, 'Third item', 'Another row.')}
			</div>`),
};
