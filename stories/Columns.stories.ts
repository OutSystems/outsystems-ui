import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

const meta: Meta = { title: 'Patterns/Adaptive/Columns' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="columns gutter-lg columns3" style="display:flex;">
				<div class="columns-item"><div class="card">Column 1</div></div>
				<div class="columns-item"><div class="card">Column 2</div></div>
				<div class="columns-item"><div class="card">Column 3</div></div>
			</div>`),
};
