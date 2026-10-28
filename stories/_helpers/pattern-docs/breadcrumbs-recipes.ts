import type { StudioRecipe } from '../studio-recipe';

const CATALOGUE_TRAIL = ['Products', 'Laptops', 'ThinkBook 14 Gen 6'] as const;
const ORDERS_TRAIL = ['Home', 'Orders', 'Order #48213'] as const;

const trailSteps = (trail: readonly string[]): string[] => [
	`Drag one Breadcrumbs Item per level into the Content placeholder: ${trail.join(', ')}.`,
];

const titleSteps = (trail: readonly string[]): string[] => [
	`For every level but the last, drag a Link widget into the Title placeholder, set Text to the level name and point it at that screen.`,
	`In the last item, drag a Text widget into the Title placeholder and set Text to "${trail[trail.length - 1]}".`,
];

export const BREADCRUMBS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Breadcrumbs',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: trailSteps(CATALOGUE_TRAIL) },
					{ label: 'Title placeholder (Breadcrumbs Item)', steps: titleSteps(CATALOGUE_TRAIL) },
					{
						label: 'Icon placeholder (Breadcrumbs Item)',
						steps: [
							'Keep the default caret-right Icon widget in every item except the last, and leave the last one empty.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and click an ancestor level to confirm it navigates back.',
	},
	customSeparator: {
		kind: 'widget',
		widgetName: 'Breadcrumbs',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: trailSteps(CATALOGUE_TRAIL) },
					{ label: 'Title placeholder (Breadcrumbs Item)', steps: titleSteps(CATALOGUE_TRAIL) },
					{
						label: 'Icon placeholder (Breadcrumbs Item)',
						steps: [
							'Select the Icon widget in each item except the last and set its icon to "arrow-right" (or any icon you prefer).',
							'Leave the Icon placeholder of the last item empty.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and verify the new separator appears between every level.',
	},
	homeIcon: {
		kind: 'widget',
		widgetName: 'Breadcrumbs',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: trailSteps(ORDERS_TRAIL) },
					{
						label: 'Title placeholder (Breadcrumbs Item)',
						steps: [
							'In the first item, drag a Link widget into the Title placeholder, then drag an Icon widget (icon "house", ExtendedClass "margin-right-xs") and a Text widget ("Home") inside the link.',
							`In the ${ORDERS_TRAIL[1]} item, drag a Link widget into the Title placeholder, set Text to "${ORDERS_TRAIL[1]}" and point it at that screen.`,
							`In the last item, drag a Text widget into the Title placeholder and set Text to "${ORDERS_TRAIL[2]}".`,
						],
					},
					{
						label: 'Icon placeholder (Breadcrumbs Item)',
						steps: ['Keep the default caret-right Icon widget in every item except the last.'],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm the house icon renders inline before "Home".',
	},
} satisfies Record<string, StudioRecipe>;
