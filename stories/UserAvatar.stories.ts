import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** User Avatar — shipped markup: `<div class="avatar border-radius-{shape} background-{color}" role="img"><span class="OSFillParent">XX</span></div>`. */
const meta: Meta = { title: 'Patterns/Content/UserAvatar' };
export default meta;
type Story = StoryObj;

const avatar = (shape: string, color: string, initials: string, size = '') =>
	`<div class="avatar ${size} border-radius-${shape} background-${color}" aria-label="user initials, ${initials}" role="img"><span class="OSFillParent">${initials}</span></div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="display:flex;gap:12px;align-items:center;">
				${avatar('rounded', 'primary', 'JS', 'avatar-small')}
				${avatar('rounded', 'indigo', 'AB')}
				${avatar('soft', 'neutral-2', 'CD', 'avatar-medium')}
			</div>`),
};
