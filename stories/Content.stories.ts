import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Content — static markup of the `content` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The screen content block of the layout: breadcrumbs, a top row with the title and actions, and the middle area.
 *
 * CSS contract: src/scss/02-layout/_content.scss.
 */
const meta: Meta = { title: 'Layout/Content' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="content">
			<div class="content-breadcrumbs">
				<div class="breadcrumbs"><a href="#">Home</a><span>Orders</span></div>
			</div>
			<div class="content-top">
				<div class="content-title"><h1>Orders</h1></div>
				<div class="content-actions">
					<button class="btn" type="button">Export</button>
					<button class="btn btn-primary" type="button">New order</button>
				</div>
			</div>
			<div class="content-middle">
				<div class="card">Screen content</div>
			</div>
			</div>`),
};
