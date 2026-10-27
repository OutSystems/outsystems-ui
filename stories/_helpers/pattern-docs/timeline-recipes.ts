import type { StudioRecipe } from '../studio-recipe';

export const TIMELINE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Timeline',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Timeline block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
