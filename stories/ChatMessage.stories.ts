import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

/**
 * Chat Message family. Controls mirror the low-code input parameters of the
 * `ChatMessage` block (extracted from the library OML), wired into the shipped markup.
 *
 * Class mappings from src/scss/04-patterns/02-content/_chat-message.scss and
 * src/scss/01-foundations/_icon-library-odc.scss:
 *   DisplayOnRight → `.chat.right` (omit class for left/received layout)
 *   MessageStatus:
 *     Sent     → `.chat-message-status > .chat-message-status_icon` (shows sent icon via --osui-icon-sent)
 *     Received → `.chat-message-status > .chat-message-status_icon-time` (shows time icon)
 *     Read     → `.chat-message-status > .chat-message-status_icon.is-read` (sent icon in green)
 *     Hidden   → `.chat-message-status.hidden` (display:none)
 *     (none)   → plain timestamp text node
 */
const meta: Meta = { title: 'Patterns/Content/ChatMessage' };
export default meta;

// ─── Shared status markup ─────────────────────────────────────────────────────

type MessageStatus = 'none' | 'Sent' | 'Received' | 'Read' | 'Hidden';

const MESSAGE_STATUS_OPTIONS: MessageStatus[] = ['none', 'Sent', 'Received', 'Read', 'Hidden'];

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
			// 'none': fall back to plain timestamp text (the Time param)
			return `<div class="chat-message-status">${time}</div>`;
	}
}

// ─── ChatMessage ──────────────────────────────────────────────────────────────

type ChatMessageArgs = {
	displayOnRight: boolean;
	time: string;
	messageStatus: MessageStatus;
	extendedClass: string;
};

function chatMessageMarkup({ displayOnRight, time, messageStatus, extendedClass }: ChatMessageArgs): string {
	return `
		<div style="max-width:460px;">
			<div class="${cls('chat', displayOnRight ? 'right' : 'left', 'OSInline', extendedClass)}" style="margin-bottom:12px;">
				<div class="chat-photo OSInline">
					<div class="avatar border-radius-rounded ${displayOnRight ? 'background-indigo' : 'background-primary'}" role="img" aria-label="user initials, ${displayOnRight ? 'HS' : 'SR'}">
						<span class="OSFillParent">${displayOnRight ? 'HS' : 'SR'}</span>
					</div>
				</div>
				<div class="chat-message-wrapper OSInline">
					<div class="chat-message padding OSInline" role="button" tabindex="0">
						<span>${displayOnRight ? 'Yes — see you then 👍' : 'Hi! Are we still on for the review at 3pm?'}</span>
					</div>
					${statusMarkup(time, messageStatus)}
				</div>
			</div>
		</div>`;
}

const baseArgs: ChatMessageArgs = {
	displayOnRight: false,
	time: '10:24',
	messageStatus: 'none',
	extendedClass: '',
};

export const Default: StoryObj<ChatMessageArgs> = {
	args: { ...baseArgs },
	argTypes: {
		displayOnRight: {
			name: 'DisplayOnRight',
			control: 'boolean',
			description:
				'When true, the message bubble aligns to the right (sent); when false, to the left (received).',
		},
		time: {
			name: 'Time',
			control: 'text',
			description: 'Time of the message shown in the status area when MessageStatus is none.',
		},
		messageStatus: {
			name: 'MessageStatus',
			control: 'select',
			options: MESSAGE_STATUS_OPTIONS,
			description:
				'Visual status indicator rendered below the bubble. ' +
				'Sent → sent icon; Received → time icon; Read → sent icon (green, .is-read); Hidden → status area hidden; none → plain Time text.',
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(chatMessageMarkup(args)),
};

/** Received (left) next to sent (right) alignment. */
export const Direction: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard([
				{ label: 'left (received)', html: chatMessageMarkup({ ...baseArgs, displayOnRight: false }) },
				{ label: 'right (sent)', html: chatMessageMarkup({ ...baseArgs, displayOnRight: true }) },
			]).outerHTML
		),
};

/** Every MessageStatus value, from the plain timestamp to the hidden status area. */
export const Statuses: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				MESSAGE_STATUS_OPTIONS.map((messageStatus) => ({
					label: messageStatus,
					html: chatMessageMarkup({ ...baseArgs, messageStatus }),
				}))
			).outerHTML
		),
};
