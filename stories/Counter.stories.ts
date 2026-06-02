import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Counter — shipped: `.counter.card.background-{color}.text-neutral-0` > `.center-align.flex-direction-row` > `.font-size-display` + label + icon. */
const meta: Meta = { title: 'Patterns/Numbers/Counter' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="counter card background-primary text-neutral-0" style="height:150px;max-width:240px;">
				<div class="center-align flex-direction-row" style="gap:12px;">
					<div class="font-size-display text-neutral-0">26</div>
					<div>Completed requests</div>
					<div><i class="icon fa fa-check fa-3x"></i></div>
				</div>
			</div>`),
};
