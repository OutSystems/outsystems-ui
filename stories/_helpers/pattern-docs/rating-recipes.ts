import type { StudioRecipe } from '../studio-recipe';

const STATE_PLACEHOLDERS = [
	{
		label: 'FilledState placeholder',
		steps: ['Drag an Icon widget into the FilledState placeholder and choose the filled star.'],
	},
	{
		label: 'HalfState placeholder',
		steps: ['Drag an Icon widget into the HalfState placeholder and choose the half star.'],
	},
	{
		label: 'EmptyState placeholder',
		steps: ['Drag an Icon widget into the EmptyState placeholder and choose the outline star.'],
	},
];

export const RATING_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Rating',
		groupProps: { RatingValue: 3.5, RatingScale: 5, IsEdit: false },
		items: [{ placeholders: STATE_PLACEHOLDERS }],
		publishStep: 'Publish the app and check the fourth star renders half-filled.',
	},
	editable: {
		kind: 'widget',
		widgetName: 'Rating',
		groupProps: { RatingValue: 4, RatingScale: 5, IsEdit: true },
		items: [{ placeholders: STATE_PLACEHOLDERS }],
		publishStep: 'Handle the OnSelect event to store its Value, then publish the app and click a star.',
	},
	sizes: {
		kind: 'widget',
		widgetName: 'Rating',
		groupProps: { RatingValue: 3, RatingScale: 5, IsEdit: false },
		items: [
			{
				placeholders: [
					{
						label: 'Size variants',
						steps: [
							'Drag three Ratings side by side; set Size to Small on the first, leave it empty on the second and set it to Medium on the third.',
						],
					},
					...STATE_PLACEHOLDERS,
				],
			},
		],
		publishStep: 'Publish the app and compare the three star sizes in the browser.',
	},
	scale: {
		kind: 'widget',
		widgetName: 'Rating',
		groupProps: { RatingValue: 7, RatingScale: 10, IsEdit: false },
		items: [{ placeholders: STATE_PLACEHOLDERS }],
		publishStep: 'Publish the app and check ten stars render with the first seven filled.',
	},
} satisfies Record<string, StudioRecipe>;
