import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Layout — static markup of the `layout` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The screen layout skeleton: `.screen-container > .layout` with the header, the menu content and `.main > .main-content`. `layout-side`, `layout-native` and `aside-expandable` select the variant.
 *
 * CSS contract: src/scss/02-layout/_layout.scss.
 */
const meta: Meta = { title: 'Layout/Layout' };
export default meta;
type Story = StoryObj;

export const SideMenu: Story = {
	render: () =>
		renderStatic(`
			<div class="screen-container">
			<div class="layout layout-side aside-expandable">
				<header class="header"><div class="header-top"><div class="application-name">Field Service</div></div></header>
				<aside class="app-menu-content">
					<nav class="app-menu-links"><a class="active" href="#">Dashboard</a><a href="#">Work orders</a></nav>
					<div class="app-login-info"><div class="user-info"><span>Alex Morgan</span></div></div>
				</aside>
				<div class="main">
					<div class="main-content"><div class="content"><div class="content-middle">Screen content</div></div></div>
				</div>
			</div>
			</div>`),
};

export const Native: Story = {
	render: () =>
		renderStatic(`
			<div class="screen-container">
			<div class="layout layout-native">
				<header class="header"><div class="header-top"><div class="header-title"><span>Inbox</span></div></div></header>
				<div class="main"><div class="main-content"><div class="content">Screen content</div></div></div>
			</div>
			</div>`),
};
