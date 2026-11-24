import type { StudioRecipe } from '../studio-recipe';

export const CHAT_MESSAGE_RECIPES = {
	received: {
		kind: 'widget',
		widgetName: 'Chat Message',
		groupProps: { DisplayOnRight: false, Time: '10:24', MessageStatus: 'None' },
		items: [
			{
				placeholders: [
					{ label: 'Photo placeholder', steps: ['Drag an Avatar widget into the Photo placeholder.'] },
					{
						label: 'Message placeholder',
						steps: ['Drag a Text widget into the Message placeholder.', 'Set the message body text.'],
					},
				],
			},
		],
	},
	sent: {
		kind: 'widget',
		widgetName: 'Chat Message',
		groupProps: { DisplayOnRight: true, MessageStatus: 'Sent' },
		items: [{ placeholders: [{ label: 'Message placeholder', steps: ['Set the sent message text.'] }] }],
	},
	readStatus: {
		kind: 'widget',
		widgetName: 'Chat Message',
		groupProps: { DisplayOnRight: true, MessageStatus: 'Read' },
		items: [{ placeholders: [{ label: 'Message placeholder', steps: ['Set the message text.'] }] }],
	},
} satisfies Record<string, StudioRecipe>;
