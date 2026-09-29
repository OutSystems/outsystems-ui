import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * MenuHeaderLogo — static markup of the `menu-header-logo` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The logo slot of the header in the side-menu layout.
 *
 * CSS contract: src/scss/02-layout/_menu-header-logo.scss.
 */
const meta: Meta = { title: 'Layout/MenuHeaderLogo' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-side">
			<header class="header">
				<div class="header-logo"><img class="app-logo" alt="Field Service" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'></svg>"></div>
			</header>
			</div>`),
};
