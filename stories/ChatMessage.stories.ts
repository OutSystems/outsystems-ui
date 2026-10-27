import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

type MessageStatus = 'none' | 'Sent' | 'Received' | 'Read' | 'Hidden';

function statusMarkup(time: string, status: MessageStatus): string {
	switch (status) {
		case 'Sent':
			return `<div class="chat-message-status"><span class="chat-message-status_icon"></span></div>`;
		case 'Received':
			return `<div class="chat-message-status"><span class="chat-message-status_icon-time"></span></div>`;
		case 'Read':
			return `<div class="chat-message-status"><span class="chat-message-status_icon is-read"></span></div>`;
		case 'Hidden':
			return `<div class="chat-message-status hidden"></div>`;
		default:
			return `<div class="chat-message-status">${time}</div>`;
	}
}

function chatMessageMarkup(
	displayOnRight: boolean,
	message: string,
	initials: string,
	time: string,
	status: MessageStatus,
	extendedClass = ''
): string {
	return `<div style="display:flex;justify-content:center;width:100%;"><div style="max-width:460px;width:100%;">
		<div class="${cls('chat', displayOnRight ? 'right' : 'left', 'OSInline', extendedClass)}" style="margin-bottom:12px;">
			<div class="chat-photo OSInline">
				<div class="avatar border-radius-rounded ${displayOnRight ? 'background-indigo' : 'background-primary'}" role="img" aria-label="user initials, ${initials}">
					<span class="OSFillParent">${initials}</span>
				</div>
			</div>
			<div class="chat-message-wrapper OSInline">
				<div class="chat-message padding OSInline" role="button" tabindex="0"><span>${message}</span></div>
				${statusMarkup(time, status)}
			</div>
		</div>
	</div></div>`;
}

const meta: Meta = {
	title: 'Patterns/Content/ChatMessage',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const Received: Story = {
	name: 'Received',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(
			chatMessageMarkup(false, 'Hi! Are we still on for the review at 3pm?', 'SR', '10:24', 'none')
		),
};

export const Sent: Story = {
	name: 'Sent',
	parameters: { layout: 'padded' },
	render: () => renderStatic(chatMessageMarkup(true, 'Yes — see you then 👍', 'HS', '10:24', 'Sent')),
};

export const ReadStatus: Story = {
	name: 'Read status',
	parameters: { layout: 'padded' },
	render: () => renderStatic(chatMessageMarkup(true, 'Yes — see you then 👍', 'HS', '10:24', 'Read')),
};

type ChatMessageArgs = {
	displayOnRight: boolean;
	time: string;
	messageStatus: MessageStatus;
	extendedClass: string;
};

export const Default: StoryObj<ChatMessageArgs> = {
	args: { displayOnRight: false, time: '10:24', messageStatus: 'none', extendedClass: '' },
	argTypes: {
		displayOnRight: { name: 'DisplayOnRight', control: 'boolean' },
		time: { name: 'Time', control: 'text' },
		messageStatus: {
			name: 'MessageStatus',
			control: 'select',
			options: ['none', 'Sent', 'Received', 'Read', 'Hidden'],
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ displayOnRight, time, messageStatus, extendedClass }) =>
		renderStatic(
			chatMessageMarkup(
				displayOnRight,
				displayOnRight ? 'Yes — see you then 👍' : 'Hi! Are we still on for the review at 3pm?',
				displayOnRight ? 'HS' : 'SR',
				time,
				messageStatus === 'none' ? 'none' : messageStatus,
				extendedClass
			)
		),
};
