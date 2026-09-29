import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Header — static markup of the `header` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The application header: logo and application name in `.header-top`, navigation in `.header-navigation`, the menu icon and the user info.
 *
 * CSS contract: src/scss/02-layout/_header.scss.
 */
const meta: Meta = { title: 'Layout/Header' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<header class="header">
			<div class="header-top">
				<div class="header-logo"><img class="app-logo" alt="" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'></svg>"></div>
				<div class="application-name">Field Service</div>
				<button class="menu-icon" type="button" aria-label="Open menu"><span></span></button>
			</div>
			<div class="header-navigation">
				<div class="header-content">
					<nav class="app-menu-links"><a class="active" href="#">Dashboard</a><a href="#">Work orders</a></nav>
				</div>
				<div class="user-info"><span class="user-avatar">FS</span><span>Alex Morgan</span></div>
			</div>
			</header>`),
};
