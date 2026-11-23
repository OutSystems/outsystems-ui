import type { StudioRecipe } from '../studio-recipe';

const PLACEHOLDERS = [
	{
		label: 'Previous placeholder',
		steps: ['Keep the default Icon widget (caret-left), or replace it with your own icon or text.'],
	},
	{
		label: 'Next placeholder',
		steps: ['Keep the default Icon widget (caret-right), or replace it with your own icon or text.'],
	},
	{
		label: 'OnNavigate event',
		steps: [
			'Create a handler for OnNavigate that assigns NewStartIndex to the StartIndex local variable and refreshes the aggregate.',
		],
	},
] as const;

const paginationRecipe = (
	groupProps: Record<string, string | number | boolean>,
	publishStep: string,
	extraSteps: string[] = []
): StudioRecipe => ({
	kind: 'widget',
	widgetName: 'Pagination',
	groupProps,
	items: [
		{
			placeholders: [
				{
					label: 'Properties',
					steps: [
						'Bind StartIndex to a local variable (StartIndex), MaxRecords to the aggregate Max. Records and TotalCount to the aggregate Count.',
						...extraSteps,
					],
				},
				...PLACEHOLDERS.map((group) => ({ label: group.label, steps: [...group.steps] })),
			],
		},
	],
	publishStep,
});

const OVERVIEW_VALUES = { StartIndex: 0, MaxRecords: 10, TotalCount: 100 } as const;

export const PAGINATION_RECIPES = {
	basicUsage: paginationRecipe(
		{ ...OVERVIEW_VALUES, ShowGoToPage: false },
		'Publish the app and click page 4 — the window slides and OnNavigate reports NewStartIndex 30.'
	),
	middlePage: paginationRecipe(
		{ ...OVERVIEW_VALUES, StartIndex: 40, ShowGoToPage: false },
		'Publish the app and confirm page 5 is active with an ellipsis on both sides.',
		['Initialise the StartIndex variable with 40 (page 5 when MaxRecords is 10).']
	),
	goToPageInput: paginationRecipe(
		{ ...OVERVIEW_VALUES, ShowGoToPage: true },
		'Publish the app, type a page number in the input and press Enter to jump straight to it.'
	),
} satisfies Record<string, StudioRecipe>;
