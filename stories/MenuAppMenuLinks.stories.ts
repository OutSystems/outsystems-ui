import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * MenuAppMenuLinks — static markup of the `menu-app-menu-links` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The navigation links of the menu; `.active` marks the current screen.
 *
 * CSS contract: src/scss/02-layout/_menu-app-menu-links.scss.
 */
const meta: Meta = { title: 'Layout/MenuAppMenuLinks' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-side">
			<nav class="app-menu-links">
				<a class="active" href="#">Dashboard</a>
				<a href="#">Work orders</a>
				<a href="#">Customers</a>
				<a href="#">Settings</a>
			</nav>
			</div>`),
};
