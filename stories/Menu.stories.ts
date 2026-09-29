import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Menu — static markup of the `menu` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The application menu: `.app-menu-content` (open with `is--open`) with its overlay, inside the layout that carries `menu-visible`.
 *
 * CSS contract: src/scss/02-layout/_menu.scss.
 */
const meta: Meta = { title: 'Layout/Menu' };
export default meta;
type Story = StoryObj;

export const Open: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-side menu-visible" style="position: relative; min-height: 240px;">
			<div class="app-menu-overlay"></div>
			<aside class="app-menu-content is--open">
				<nav class="app-menu-links"><a class="active" href="#">Dashboard</a><a href="#">Work orders</a><a href="#">Settings</a></nav>
			</aside>
			<div class="main"><div class="main-content">Screen content</div></div>
			</div>`),
};
