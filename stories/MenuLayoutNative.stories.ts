import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * MenuLayoutNative — static markup of the `menu-layout-native` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The menu inside the native layout: `.app-menu-content` slides over the main area and dims it with its `:after` overlay.
 *
 * CSS contract: src/scss/02-layout/_menu-layout-native.scss.
 */
const meta: Meta = { title: 'Layout/MenuLayoutNative' };
export default meta;
type Story = StoryObj;

export const Open: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-native menu-visible" style="position: relative; min-height: 240px;">
			<aside class="app-menu-content is--open">
				<nav class="app-menu-links"><a class="active" href="#">Inbox</a><a href="#">Tasks</a></nav>
			</aside>
			<div class="main"><div class="content">Screen content</div></div>
			</div>`),
};
