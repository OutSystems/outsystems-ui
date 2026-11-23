import type { StudioRecipe } from '../studio-recipe';

export const COLUMNS_RECIPES = {
	twoColumns: {
		kind: 'widget',
		widgetName: 'Columns 2',
		groupProps: { GutterSize: 'Base', TabletBehavior: 'BreakAll', PhoneBehavior: 'BreakAll' },
		items: [
			{
				placeholders: [
					{
						label: 'Column placeholders',
						steps: [
							'Add content to each column placeholder.',
							'Adjust GutterSize and breakpoint behaviour as needed.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
