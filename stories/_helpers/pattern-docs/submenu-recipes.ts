import type { StudioRecipe } from '../studio-recipe';

const MENU_STEPS = ['Drag a Text widget into the Menu placeholder and set Text to "Products".'];

const ITEMS_STEPS = [
	'Drag one Link widget per screen into the Items placeholder: Analytics, Automation, Integrations, Pricing.',
	'Set each Link’s On Click to Navigate and pick the destination screen.',
];

export const SUBMENU_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Submenu',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Menu placeholder', steps: MENU_STEPS },
					{ label: 'Items placeholder', steps: ITEMS_STEPS },
				],
			},
		],
		publishStep: 'Publish the app and click the Products entry in the header menu — the links drop down below it.',
	},
	openOnHover: {
		kind: 'widget',
		widgetName: 'Submenu',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Menu placeholder',
						steps: ['Drag a Text widget into the Menu placeholder and set Text to "Solutions".'],
					},
					{ label: 'Items placeholder', steps: ITEMS_STEPS },
					{
						label: 'Initialized event',
						steps: [
							'Create a client action for the Submenu’s Initialized event.',
							'Add a JavaScript node with the SubmenuId as input and the code OutSystems.OSUI.Patterns.SubmenuAPI.SubmenuOpenOnHover($parameters.SubmenuId);',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and hover the Solutions entry — the panel opens without a click.',
	},
	currentScreen: {
		kind: 'widget',
		widgetName: 'Submenu',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Menu placeholder', steps: MENU_STEPS },
					{
						label: 'Items placeholder',
						steps: [
							...ITEMS_STEPS,
							'No extra setup: on the screen a link navigates to, the platform adds the active class to that link and to the Submenu root.',
						],
					},
				],
			},
		],
		publishStep:
			'Publish the app and open the Automation screen — the Products header is highlighted and Automation is marked inside the panel.',
	},
} satisfies Record<string, StudioRecipe>;
