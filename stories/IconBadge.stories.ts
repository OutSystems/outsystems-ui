import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Icon with Badge — shipped: `.icon-badge > div > i.icon.fa.fa-NAME.fa-2x` + `.badge.border-radius-rounded.background-primary.OSInline`. */
const meta: Meta = { title: 'Patterns/Numbers/IconBadge' };
export default meta;
type Story = StoryObj;

const iconBadge = (icon: string, n: string) => `
	<div class="icon-badge">
		<div><i class="icon fa ${icon} fa-2x"></i></div>
		<div class="badge border-radius-rounded background-primary OSInline"><span class="OSFillParent">${n}</span></div>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`<div style="display:flex;gap:28px;align-items:center;">${iconBadge('fa-comment-o', '1')}${iconBadge('fa-bell', '3')}${iconBadge('fa-envelope', '9')}</div>`),
};
