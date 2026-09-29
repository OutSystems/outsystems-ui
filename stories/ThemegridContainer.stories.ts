import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * ThemegridContainer — static markup of the `themegrid-container` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The grid container that centres header, main content and footer at the theme’s max width; column widths come from `ThemeGrid_Width*`.
 *
 * CSS contract: src/scss/02-layout/_themegrid-container.scss.
 */
const meta: Meta = { title: 'Layout/ThemegridContainer' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="layout">
			<header class="header"><div class="ThemeGrid_Container"><span class="application-name">Field Service</span></div></header>
			<div class="main">
				<div class="main-content ThemeGrid_Container">
					<div class="ThemeGrid_Width8"><div class="card">Main column</div></div>
					<div class="ThemeGrid_Width4"><div class="card">Side column</div></div>
				</div>
			</div>
			<footer class="footer ThemeGrid_Container"><span>Footer</span></footer>
			</div>`),
};
