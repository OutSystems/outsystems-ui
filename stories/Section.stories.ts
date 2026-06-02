import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Section (Group) — shipped: `.section-group.is--sticky` > `.section` (role=region) > `.section-title.dividers` + `.section-content`. */
const meta: Meta = { title: 'Patterns/Content/Section' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="section-group" style="max-width:480px;">
				<div class="section" role="region">
					<div class="section-title dividers">Account settings</div>
					<div class="section-content">Grouped content sits under a section heading with a divider.</div>
				</div>
			</div>`),
};
