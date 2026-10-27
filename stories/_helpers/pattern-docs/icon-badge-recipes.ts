import type { StudioRecipe } from '../studio-recipe';

export const ICON_BADGE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Icon Badge',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Icon Badge block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
