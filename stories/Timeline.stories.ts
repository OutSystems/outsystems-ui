import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Timeline — shipped: `.timeline` > `.timeline-item` (role=listitem) > `.timeline-left` + `.timeline-icon` (`.timeline-icon-line` + `.timeline-icon-container.background-primary` > i.icon.fa) + `.timeline-content` (title + `.timeline-content-inner`) + `.timeline-right`. */
const meta: Meta = { title: 'Patterns/Navigation/Timeline' };
export default meta;
type Story = StoryObj;

const item = (left: string, icon: string, title: string, desc: string) => `
	<div class="timeline-item" role="listitem">
		<div class="timeline-left OSInline">${left}</div>
		<div class="timeline-icon OSInline">
			<div class="timeline-icon-line OSInline"></div>
			<div class="timeline-icon-container background-primary OSInline"><i class="icon fa ${icon} fa-1x"></i></div>
		</div>
		<div class="timeline-content"><div>${title}</div><div class="timeline-content-inner">${desc}</div></div>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="timeline" role="list" style="max-width:480px;">
				${item('2019', 'fa-archive', 'Pending approval', 'This request requires your approval.')}
				${item('2020', 'fa-check', 'Approved', 'The request was approved by the manager.')}
				${item('2021', 'fa-flag', 'Closed', 'The request lifecycle is complete.')}
			</div>`),
};
