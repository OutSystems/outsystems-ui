import type { StudioRecipe } from '../studio-recipe';

export const SWIPE_EVENTS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Swipe Events',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Swipe Events block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
