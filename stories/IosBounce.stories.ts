import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * IosBounce — static markup of the `ios-bounce` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * iOS-only fix for the rubber-band scroll: `.ios .layout-native.ios-bounce` locks the header and lets `.main` scroll.
 *
 * CSS contract: src/scss/02-layout/_ios-bounce.scss.
 */
const meta: Meta = { title: 'Layout/IosBounce' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="ios">
			<div class="layout layout-native ios-bounce">
				<header class="header"><div class="header-top"><div class="header-title"><span>Inbox</span></div></div></header>
				<div class="main">
					<div class="content">
						<div class="content-middle">Scrolls without bouncing the header</div>
						<div class="content-bottom"></div>
					</div>
				</div>
			</div>
			</div>`),
};
