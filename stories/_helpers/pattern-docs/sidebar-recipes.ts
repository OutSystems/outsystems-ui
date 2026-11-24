import type { StudioRecipe } from '../studio-recipe';

const OPEN_FROM_BUTTON =
	'Drag a Button widget next to the Sidebar, create a client action for its OnClick and call the SidebarAPI Open action (or the Sidebar’s Toggle client action) with the Sidebar’s Id.';

export const SIDEBAR_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Sidebar',
		groupProps: { Direction: 'Entities.Direction.Right', HasOverlay: false, Width: '360px' },
		items: [
			{
				placeholders: [
					{
						label: 'Header placeholder',
						steps: [
							'Drag a Text widget into the Header placeholder and set Text to "Order #10482".',
							'Drag a Button widget with a close icon and call the Sidebar Close action from its OnClick.',
						],
					},
					{
						label: 'Content placeholder',
						steps: [
							'Drag the order detail widgets (status, carrier, items, total) into the Content placeholder.',
							OPEN_FROM_BUTTON,
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and click the button — the panel slides in from the right.',
	},
	withOverlay: {
		kind: 'widget',
		widgetName: 'Sidebar',
		groupProps: { Direction: 'Entities.Direction.Right', HasOverlay: true, Width: '360px' },
		items: [
			{
				placeholders: [
					{
						label: 'Header placeholder',
						steps: ['Drag a Text widget into the Header placeholder and set Text to "Filters".'],
					},
					{
						label: 'Content placeholder',
						steps: [
							'Drag a Form with Checkbox and Radio Group widgets for the filter options, plus an "Apply filters" Button.',
							OPEN_FROM_BUTTON,
						],
					},
				],
			},
		],
		publishStep: 'Publish the app, open the Sidebar and click the dimmed page behind it — the panel closes.',
	},
	directionLeft: {
		kind: 'widget',
		widgetName: 'Sidebar',
		groupProps: { Direction: 'Entities.Direction.Left', HasOverlay: true, Width: '280px' },
		items: [
			{
				placeholders: [
					{
						label: 'Header placeholder',
						steps: ['Drag a Text widget into the Header placeholder and set Text to "Navigation".'],
					},
					{
						label: 'Content placeholder',
						steps: [
							'Drag Link widgets into the Content placeholder, one per screen (Dashboard, Orders, Customers, Reports, Settings).',
							OPEN_FROM_BUTTON,
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and open the Sidebar — it slides in from the left edge.',
	},
} satisfies Record<string, StudioRecipe>;
