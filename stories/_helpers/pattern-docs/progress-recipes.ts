import type { StudioRecipe } from '../studio-recipe';

export const PROGRESS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Progress',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Progress block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
