import type { StudioRecipe } from '../studio-recipe';

export const TOUCH_EVENTS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Touch Events',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Touch Events block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
