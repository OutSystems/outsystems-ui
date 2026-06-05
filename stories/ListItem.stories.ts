import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * List Item (Content) — controls mirror the low-code input parameters of the
 * `ListItemContent` block in the OutSystemsUI library OML.
 *   ExtendedClass :: Text :: ""
 *
 * Class mappings come from src/scss/04-patterns/02-content/_list-item-content.scss.
 * Shipped: `[data-list-item].list-item` > `.list-item-content` >
 *   `.list-item-content-left|center|right`.
 */
const meta: Meta = { title: 'Patterns/Content/ListItem' };
export default meta;

type ListItemArgs = { extendedClass: string };

const item = (selected: boolean, title: string, text: string, extendedClass = '', right = '') => `
	<div data-list-item class="list-item ${selected ? 'list-item-selected' : ''}">
		<div class="${cls('list-item-content', extendedClass)}">
			<div class="list-item-content-center">
				<div class="list-item-content-title">${title}</div>
				<div class="list-item-content-text">${text}</div>
			</div>
			${right ? `<div class="list-item-content-right">${right}</div>` : ''}
		</div>
	</div>`;

export const Default: StoryObj<ListItemArgs> = {
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) =>
		renderStatic(`
			<div class="list list-group" style="max-width:420px;">
				${item(false, 'First item', 'A tappable row with a title and supporting text.', extendedClass)}
				${item(true, 'Selected item', 'This row is selected.', extendedClass, '<i class="icon fa fa-check fa-1x"></i>')}
				${item(false, 'Third item', 'Another row.', extendedClass)}
			</div>`),
};
