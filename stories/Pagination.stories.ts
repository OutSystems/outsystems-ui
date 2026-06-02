import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

const meta: Meta = { title: 'Patterns/Navigation/Pagination' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="pagination">
				<div class="pagination-container" style="display:flex;gap:4px;align-items:center;">
					<button class="pagination-button" disabled>Prev</button>
					<button class="pagination-button is--active">1</button>
					<button class="pagination-button">2</button>
					<button class="pagination-button is--ellipsis">…</button>
					<button class="pagination-button">5</button>
					<button class="pagination-button">Next</button>
				</div>
				<div class="pagination-counter">Items 1–10 of 45</div>
			</div>`),
};
