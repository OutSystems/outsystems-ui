import type { StudioRecipe } from '../studio-recipe';

export const MARGIN_CONTAINER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Margin Container',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'MarginContainer placeholder',
						steps: [
							'Drag a Card widget into the MarginContainer placeholder.',
							'Inside the Card, drag a Text widget with "Quarterly summary" and another with "Revenue is up 12% against the previous quarter, driven by renewals."',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm the card is inset from the screen edge by the theme padding.',
	},
	insideLayout: {
		kind: 'widget',
		widgetName: 'Margin Container',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Around the widget',
						steps: [
							'Above the Margin Container, keep the full-bleed widgets directly in the screen: a Container with the "Trip details" title and an Image widget for the hero.',
						],
					},
					{
						label: 'MarginContainer placeholder',
						steps: [
							'Drag a Text widget with "Lisbon to Porto" and another with "Friday, 14 Nov · 08:30 – 11:15 · Alfa Pendular".',
							'Drag a Button widget and set Label to "Check in".',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm the hero bleeds to the edge while the text and button are inset.',
	},
} satisfies Record<string, StudioRecipe>;
