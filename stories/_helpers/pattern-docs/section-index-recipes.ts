import type { StudioRecipe } from '../studio-recipe';

export const SECTION_INDEX_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Section Index',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Section Index block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
