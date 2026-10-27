import type { StudioRecipe } from '../studio-recipe';

export const TABS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Tabs',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Tabs block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
