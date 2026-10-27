import type { StudioRecipe } from '../studio-recipe';

export const SIDEBAR_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Sidebar',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Sidebar block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
