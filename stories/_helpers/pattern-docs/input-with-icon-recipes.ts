import type { StudioRecipe } from '../studio-recipe';

const ICON_STEPS = (icon: string): string[] => [
	'Drag an Icon widget into the Icon placeholder.',
	`Set its Icon to ${icon}.`,
];

export const INPUT_WITH_ICON_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Input With Icon',
		groupProps: { AlignIconRight: false },
		items: [
			{
				placeholders: [
					{ label: 'Icon placeholder', steps: ICON_STEPS('envelope') },
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder.',
							'Bind its Variable to a Text local variable and set Prompt to "you@example.com".',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app: the envelope sits at the start edge and the prompt text is indented past it.',
	},
	iconRight: {
		kind: 'widget',
		widgetName: 'Input With Icon',
		groupProps: { AlignIconRight: true },
		items: [
			{
				placeholders: [
					{ label: 'Icon placeholder', steps: ICON_STEPS('calendar-blank') },
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder.',
							'Bind its Variable to a Text local variable and set Prompt to "Delivery date".',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app: the calendar icon docks to the end edge of the input.',
	},
	errorState: {
		kind: 'widget',
		widgetName: 'Input With Icon',
		groupProps: { AlignIconRight: false },
		items: [
			{
				placeholders: [
					{ label: 'Icon placeholder', steps: ICON_STEPS('user') },
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder and bind it to a Text local variable.',
							'In the submit action, set the Input’s Valid property to False and ValidationMessage to "Username must have at least 3 characters." when the check fails.',
						],
					},
				],
			},
		],
		publishStep:
			'Publish the app and submit a two-letter username: the input turns red and the message appears below it.',
	},
} satisfies Record<string, StudioRecipe>;
