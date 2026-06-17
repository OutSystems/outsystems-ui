import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * List + List Item — the two OutSystems platform **widgets** rendered together,
 * the way they compose at runtime: a List widget (`.list.list-group`) wrapping
 * one or more List Item widgets (`[data-list-item].list-item`). Each List Item
 * hosts a List Item Content pattern (see Patterns/Content/List Item Content for
 * the content block on its own).
 *
 * CSS-only render — the widget DOM + classes are the styling contract from
 * src/scss/03-widgets/_list.scss and src/scss/03-widgets/_list-item.scss:
 *   `.list.list-group` > `[data-list-item].list-item(.list-item-selected)`
 *   > `.list-item-content` > `-left | -center(-title/-text) | -right`.
 *
 * Hover and selected styling key off the `.desktop` body class set by the
 * Storybook preview decorator.
 */
const meta: Meta = { title: 'Widgets/List' };
export default meta;
type Story = StoryObj;

const item = (selected: boolean, title: string, text: string, right = ''): string => `
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
				${item(true, 'Selected item', 'This row is selected.', '<i class="icon ph ph-check"></i>')}
				${item(false, 'Third item', 'Another row.')}
			</div>`),
};
