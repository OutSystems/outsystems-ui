import type { StudioRecipe } from '../studio-recipe';

export const TABLE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Table',
		items: [
			{
				placeholders: [
					{
						label: 'Table structure',
						steps: [
							'Configure column headers in the table header row.',
							'Add data rows in the table body.',
							'Use data-header on cells for responsive labels.',
						],
					},
				],
			},
		],
	},
	selectedRow: {
		kind: 'widget',
		widgetName: 'Table',
		groupProps: { ExtendedClass: 'table-row-selected-demo' },
		items: [
			{
				placeholders: [
					{
						label: 'Selection',
						steps: [
							'Apply table-row-selected on the active row.',
							'Wire row click handlers in your logic.',
						],
					},
				],
			},
		],
	},
	stripes: {
		kind: 'widget',
		widgetName: 'Table',
		items: [
			{
				placeholders: [
					{
						label: 'Stripes',
						steps: [
							'Enable striped rows on the Table (or add table-row-stripping on each data row).',
							'Even rows pick up --osui-table-row-stripe-background automatically.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
