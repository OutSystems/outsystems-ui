import type { StudioRecipe } from '../studio-recipe';

const HEADER_STEPS = [
	'Drag three Tabs Header Item widgets into the Header placeholder.',
	'Drag a Text widget into each Title placeholder and set Text to "Overview", "Specifications" and "Reviews".',
];

const CONTENT_STEPS = [
	'Drag three Tabs Content Item widgets into the Content placeholder, in the same order as the headers.',
	'Drop the product description, the specification list and the review summary into each Content placeholder.',
];

export const TABS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Tabs',
		groupProps: { TabsOrientation: 'Entities.Orientation.Horizontal', StartingTab: 0, Height: 'auto' },
		items: [
			{
				placeholders: [
					{ label: 'Header placeholder', steps: HEADER_STEPS },
					{ label: 'Content placeholder', steps: CONTENT_STEPS },
				],
			},
		],
		publishStep:
			'Publish the app and click each header — the matching pane is shown and the indicator slides under it.',
	},
	startingTab: {
		kind: 'widget',
		widgetName: 'Tabs',
		groupProps: { TabsOrientation: 'Entities.Orientation.Horizontal', StartingTab: 1, Height: 'auto' },
		items: [
			{
				placeholders: [
					{ label: 'Header placeholder', steps: HEADER_STEPS },
					{ label: 'Content placeholder', steps: CONTENT_STEPS },
				],
			},
		],
		publishStep: 'Publish the app — the Specifications tab (index 1) is selected when the screen opens.',
	},
	orientation: {
		kind: 'widget',
		widgetName: 'Tabs',
		groupProps: {
			TabsOrientation: 'Entities.Orientation.Vertical',
			TabsVerticalPosition: 'Entities.Direction.Left',
			StartingTab: 0,
		},
		items: [
			{
				placeholders: [
					{
						label: 'Header placeholder',
						steps: [
							'Drag one Tabs Header Item per section into the Header placeholder (Overview, Details, Activity).',
							'Drag a Text widget into each Title placeholder with the section name.',
						],
					},
					{
						label: 'Content placeholder',
						steps: [
							'Drag one Tabs Content Item per section into the Content placeholder, in the same order.',
							'For the horizontal variant, keep TabsOrientation at its default Entities.Orientation.Horizontal.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app — the headers stack beside the content with the indicator on their edge.',
	},
	justifyHeaders: {
		kind: 'widget',
		widgetName: 'Tabs',
		groupProps: { 'OptionalConfigs.JustifyHeaders': true, StartingTab: 0 },
		items: [
			{
				placeholders: [
					{
						label: 'Header placeholder',
						steps: [
							'Drag one Tabs Header Item per section into the Header placeholder (Overview, Details, Activity).',
							'Drag a Text widget into each Title placeholder with the section name.',
						],
					},
					{
						label: 'Content placeholder',
						steps: [
							'Drag one Tabs Content Item per section into the Content placeholder, in the same order.',
							'Leave OptionalConfigs.JustifyHeaders at False for the packed variant.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app — the three headers share the row width evenly.',
	},
} satisfies Record<string, StudioRecipe>;
