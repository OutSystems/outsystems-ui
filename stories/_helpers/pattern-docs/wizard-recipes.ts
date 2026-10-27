import type { StudioRecipe } from '../studio-recipe';

export const WIZARD_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Wizard',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Wizard block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
