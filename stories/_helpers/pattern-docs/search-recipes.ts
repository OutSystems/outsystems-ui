import type { StudioRecipe } from '../studio-recipe';

const INPUT_STEPS = (extra: string[] = []): string[] => [
	'Drag an Input widget into the Input placeholder.',
	'Bind its Variable to a Text local variable (SearchTerm) and set Prompt to "Search…".',
	...extra,
];

export const SEARCH_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Search',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Input placeholder',
						steps: INPUT_STEPS([
							'On the Input’s OnChange, refresh the aggregate or filter the list with SearchTerm.',
						]),
					},
				],
			},
		],
		publishStep: 'Publish the app and type in the field: the list filters as the term changes.',
	},
	prefilledValue: {
		kind: 'widget',
		widgetName: 'Search',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder.',
							'Bind its Variable to a Text local variable whose default value is "Quarterly invoices".',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app: the field renders with the term already in place next to the icon.',
	},
	roundShape: {
		kind: 'widget',
		widgetName: 'Search',
		groupProps: { ExtendedClass: 'shape-round' },
		items: [{ placeholders: [{ label: 'Input placeholder', steps: INPUT_STEPS() }] }],
		publishStep: 'Publish the app: the search field renders with fully rounded ends.',
	},
} satisfies Record<string, StudioRecipe>;
