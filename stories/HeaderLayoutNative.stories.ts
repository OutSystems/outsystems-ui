import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * HeaderLayoutNative — static markup of the `header-layout-native` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * Header inside the native (mobile) layout: a title row with left and right slots for the menu icon and actions.
 *
 * CSS contract: src/scss/02-layout/_header-layout-native.scss.
 */
const meta: Meta = { title: 'Layout/HeaderLayoutNative' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-native">
			<header class="header">
				<div class="header-top">
					<div class="header-title">
						<div class="header-title-left"><button class="menu-icon" type="button" aria-label="Open menu"><span></span></button></div>
						<span>Work orders</span>
						<div class="header-title-right"><button class="btn" type="button">Filter</button></div>
					</div>
				</div>
			</header>
			<div class="main"><div class="content">Screen content</div></div>
			<div class="content-bottom"></div>
			</div>`),
};
