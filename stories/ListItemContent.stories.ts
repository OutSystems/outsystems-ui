import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * List Item Content — the `ListItemContent` pattern block from the OutSystemsUI
 * library OML. It is a content layout (left / center / right regions) that only
 * makes sense *inside* a List Item widget, which in turn lives in a List widget.
 *
 * Because it has no standalone meaning, this story doesn't render the block on
 * its own — it just links to the composed Widgets/List story, where List Item
 * Content is shown inside the List Item + List widgets it belongs to.
 */
const meta: Meta = { title: 'Patterns/Content/List Item Content' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="max-width:420px;">
				List Item Content is used inside a List Item, within a List widget. See the composed example:
				<a href="./?path=/story/widgets-list--default" target="_top">Widgets/List →</a>
			</div>`),
};
