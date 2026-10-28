import type { StudioRecipe } from '../studio-recipe';

const EMPTY_INBOX_STEPS = [
	'Drag a Container into the Center placeholder and set its Style Classes to "text-align-center".',
	'Inside it, drag an Icon widget (inbox), a Text widget with "Your inbox is empty" and a second Text widget with "New messages will show up here as soon as they arrive."',
] as const;

export const CENTER_CONTENT_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Center Content',
		groupProps: { Height: 0 },
		items: [
			{
				placeholders: [
					{ label: 'Top placeholder', steps: ['Leave it empty for this example.'] },
					{ label: 'Center placeholder', steps: [...EMPTY_INBOX_STEPS] },
					{ label: 'Bottom placeholder', steps: ['Leave it empty for this example.'] },
				],
			},
		],
		publishStep:
			'Publish the app and confirm the empty-state copy sits in the middle of the screen (the parent must have a height — the layout content area does).',
	},
	topAndBottom: {
		kind: 'widget',
		widgetName: 'Center Content',
		groupProps: { Height: 0 },
		items: [
			{
				placeholders: [
					{
						label: 'Top placeholder',
						steps: ['Drag a Text widget into the Top placeholder and set Text to "Inbox" (bold).'],
					},
					{ label: 'Center placeholder', steps: [...EMPTY_INBOX_STEPS] },
					{
						label: 'Bottom placeholder',
						steps: ['Drag a Button widget into the Bottom placeholder and set Label to "Compose message".'],
					},
				],
			},
		],
		publishStep:
			'Publish the app and confirm the title stays at the top, the button at the bottom and the copy centred.',
	},
	fixedHeight: {
		kind: 'widget',
		widgetName: 'Center Content',
		groupProps: { Height: 280 },
		items: [
			{
				placeholders: [
					{
						label: 'Center placeholder',
						steps: ['Drag a Tag widget into the Center placeholder and set its text to "280px tall".'],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm the block is 280px tall regardless of its parent.',
	},
} satisfies Record<string, StudioRecipe>;
