import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Chat Message — shipped: `.chat.{left|right}.OSInline` > `.chat-photo`(avatar) + `.chat-message-wrapper` > `.chat-message.padding` + status. */
const meta: Meta = { title: 'Patterns/Content/ChatMessage' };
export default meta;
type Story = StoryObj;

const bubble = (side: string, color: string, initials: string, text: string, status: string) => `
	<div class="chat ${side} OSInline" style="margin-bottom:12px;">
		<div class="chat-photo OSInline">
			<div class="avatar border-radius-rounded background-${color}" role="img" aria-label="user initials, ${initials}"><span class="OSFillParent">${initials}</span></div>
		</div>
		<div class="chat-message-wrapper OSInline">
			<div class="chat-message padding OSInline" role="button" tabindex="0"><span>${text}</span></div>
			<div class="chat-message-status">${status}</div>
		</div>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="max-width:460px;">
				${bubble('left', 'primary', 'SR', 'Hi! Are we still on for the review at 3pm?', '10:24')}
				${bubble('right', 'indigo', 'HS', 'Yes — see you then 👍', 'Sent')}
			</div>`),
};
