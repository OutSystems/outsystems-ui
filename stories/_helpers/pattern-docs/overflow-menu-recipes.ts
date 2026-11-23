import type { StudioRecipe } from '../studio-recipe';

const MENU_STEPS = [
	'Drag a Text widget for the group title ("Actions") and give it the classes "font-size-label font-semi-bold text-uppercase text-neutral-7 padding-x-base padding-top-base padding-bottom-xs".',
	'Drag one Link widget per action: View details (eye), Duplicate (copy), Rename (pencil-simple) and Delete (trash). Put an Icon and a Text widget inside each link.',
	'Drag a Separator widget above the last link to set the destructive action apart.',
] as const;

const TRIGGER_STEPS = [
	'Drag an Icon widget into the TriggerContent placeholder and set its icon to "dots-three-vertical".',
] as const;

const menuRecipe = (groupProps: Record<string, string>, publishStep: string): StudioRecipe => ({
	kind: 'widget',
	widgetName: 'Overflow Menu',
	groupProps,
	items: [
		{
			placeholders: [
				{ label: 'TriggerContent placeholder', steps: [...TRIGGER_STEPS] },
				{ label: 'Menu placeholder', steps: [...MENU_STEPS] },
			],
		},
	],
	publishStep,
});

export const OVERFLOW_MENU_RECIPES = {
	basicUsage: menuRecipe(
		{},
		'Publish the app, click the trigger to open the menu and press Esc or click outside to close it.'
	),
	balloonShape: {
		kind: 'widget',
		widgetName: 'Overflow Menu',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Properties (one Overflow Menu per shape)',
						steps: [
							'Drag three Overflow Menu widgets side by side.',
							'Set BalloonShape to Entities.Shape.SoftRounded on the first, Entities.Shape.Rounded on the second and Entities.Shape.Sharp on the third.',
						],
					},
					{ label: 'TriggerContent placeholder', steps: [...TRIGGER_STEPS] },
					{ label: 'Menu placeholder', steps: [...MENU_STEPS] },
				],
			},
		],
		publishStep: 'Publish the app and open each menu to compare the corner radius of the balloons.',
	},
	balloonPosition: {
		kind: 'widget',
		widgetName: 'Overflow Menu',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Properties (one Overflow Menu per position)',
						steps: [
							'Drag one Overflow Menu widget per placement you want to compare.',
							'Set BalloonPosition to Entities.FloatingPosition.Auto, .Bottom, .BottomStart, .BottomEnd and .Top respectively (leave it as NullIdentifier() for Auto).',
						],
					},
					{ label: 'TriggerContent placeholder', steps: [...TRIGGER_STEPS] },
					{ label: 'Menu placeholder', steps: [...MENU_STEPS] },
				],
			},
		],
		publishStep:
			'Publish the app and open each menu; place one trigger near the bottom of the screen to watch Auto flip the balloon upwards.',
	},
} satisfies Record<string, StudioRecipe>;
