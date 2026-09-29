import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * HeaderLayoutSide — static markup of the `header-layout-side` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * Header inside the side-menu layout, fixed and beside an expandable aside.
 *
 * CSS contract: src/scss/02-layout/_header-layout-side.scss.
 */
const meta: Meta = { title: 'Layout/HeaderLayoutSide' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-side fixed-header aside-expandable">
			<header class="header">
				<div class="header-navigation"><div class="header-content"><span class="application-name">Field Service</span></div></div>
			</header>
			<aside class="app-menu-content"><nav class="app-menu-links"><a class="active" href="#">Dashboard</a></nav></aside>
			<div class="main"><div class="main-content">Screen content</div></div>
			</div>`),
};
