import type { StudioRecipe } from '../studio-recipe';

export const NOTIFICATION_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Notification',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Notification block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
