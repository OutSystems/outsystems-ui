import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * MenuAppLoginInfo — static markup of the `menu-app-login-info` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The signed-in user block at the bottom of the side menu.
 *
 * CSS contract: src/scss/02-layout/_menu-app-login-info.scss.
 */
const meta: Meta = { title: 'Layout/MenuAppLoginInfo' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-side">
			<div class="app-login-info">
				<div class="user-info">
					<span class="user-avatar">AM</span>
					<span>Alex Morgan</span>
					<a href="#">Log out</a>
				</div>
			</div>
			</div>`),
};
