import type { StudioRecipe } from '../studio-recipe';

const LABEL_STEPS = (text: string): string[] => [
	'Drag a Label widget into the Label placeholder.',
	`Set Text to "${text}" and Input to the Input widget below.`,
];

export const ANIMATED_LABEL_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Animated Label',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Label placeholder', steps: LABEL_STEPS('Full name') },
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder and bind its Variable to a Text local variable.',
							'Leave Prompt empty — the floating label is the field name.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and click into the field: the label floats to the top edge.',
	},
	prefilledValue: {
		kind: 'widget',
		widgetName: 'Animated Label',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Label placeholder', steps: LABEL_STEPS('Email address') },
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder.',
							'Bind its Variable to a Text local variable whose default value is "ana.silva@example.com".',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app: the label already floats because the Input renders with a value.',
	},
	errorState: {
		kind: 'widget',
		widgetName: 'Animated Label',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Label placeholder', steps: LABEL_STEPS('Full name') },
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder and set Mandatory to True.',
							'In the form’s submit action, set the Input’s Valid property to False and ValidationMessage to the error text when the check fails.',
						],
					},
				],
			},
		],
		publishStep:
			'Publish the app and submit the form with an invalid value to see the red label, border and message.',
	},
	disabled: {
		kind: 'widget',
		widgetName: 'Animated Label',
		groupProps: {},
		items: [
			{
				placeholders: [
					{ label: 'Label placeholder', steps: LABEL_STEPS('Employee ID') },
					{
						label: 'Input placeholder',
						steps: [
							'Drag an Input widget into the Input placeholder and bind it to a variable holding "EMP-10482".',
							'Set the Input’s Enabled property to False.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app: the field surface and label render muted and the input cannot be focused.',
	},
} satisfies Record<string, StudioRecipe>;
