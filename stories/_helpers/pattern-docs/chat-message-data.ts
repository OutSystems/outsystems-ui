import type { PatternDocMeta } from './types';

export const CHAT_MESSAGE_DOC: PatternDocMeta = {
	name: 'Chat Message',
	category: 'Content',
	lede: 'Conversational bubble with avatar, message body, and delivery status — for chat and messaging UIs.',
	overview:
		'Use Chat Message for one turn in a conversation. DisplayOnRight aligns sent messages to the right; MessageStatus shows sent, received, read, or hidden indicators below the bubble.',
	stylingSelector: '.chat',
	odcUrl:
		'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/chat_message/',
	o11Url:
		'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/chat_message/',
	liveStoryId: 'patterns-content-chatmessage--received',
	cssApiSlug: 'patterns-content-chat-message',
	whenToUse: [
		'One-to-one or group chat threads.',
		'Support conversations with clear sent vs received alignment.',
		'Showing delivery or read receipts under a bubble.',
	],
	whenNotToUse: [
		'System notifications — use Notification.',
		'Long-form articles or comments with rich formatting — use Card or custom layout.',
	],
	anatomy: {
		tree: `<div class="chat left">
  <div class="chat-photo"><!-- Avatar --></div>
  <div class="chat-message-wrapper">
    <div class="chat-message"><span>Message text</span></div>
    <div class="chat-message-status">10:24</div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Chat Message',
			rows: [
				{
					name: 'DisplayOnRight',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, aligns the bubble to the right (sent). Adds `.right` on the root.',
				},
				{ name: 'Time', type: 'Text', description: 'Timestamp shown when MessageStatus is none.' },
				{
					name: 'MessageStatus',
					type: 'MessageStatus',
					description: 'Sent, Received, Read, Hidden, or none (plain time text).',
				},
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	accessibility: [
		'Message text should be plain language in the bubble — status icons are supplementary.',
		'Avatar images need meaningful alt text or aria-label with user initials.',
		'Interactive bubbles need a visible focus indicator when focusable.',
	],
	related: [
		{ name: 'UserAvatar', storyId: 'patterns-content-useravatar--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Notification', storyId: 'patterns-interaction-notification--default' },
	],
};
