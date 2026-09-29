import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * MenuLayoutSide — static markup of the `menu-layout-side` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The menu inside the side layout: a fixed aside with the logo and links; `aside-expandable` lets it collapse.
 *
 * CSS contract: src/scss/02-layout/_menu-layout-side.scss.
 */
const meta: Meta = { title: 'Layout/MenuLayoutSide' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-side aside-expandable" style="position: relative; min-height: 240px;">
			<aside class="app-menu-content is--open">
				<div class="app-logo"></div>
				<nav class="app-menu-links"><a class="active" href="#">Dashboard</a><a href="#">Work orders</a></nav>
			</aside>
			<div class="main"><div class="main-content">Screen content</div></div>
			</div>`),
};
