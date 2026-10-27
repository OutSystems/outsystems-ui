import type { StudioRecipe } from '../studio-recipe';

export const DROPDOWN_SERVER_SIDE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Dropdown Server Side',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Dropdown Server Side block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
