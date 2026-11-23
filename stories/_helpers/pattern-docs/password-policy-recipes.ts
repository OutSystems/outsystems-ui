import type { StudioRecipe } from '../studio-recipe';

const PASSWORD_INPUT_STEPS = [
	'Above the block, drag an Input widget, set its Type to Password and bind its Variable to a Text local variable (for example NewPassword).',
	'Select the Password Policy block and set Password to NewPassword.',
] as const;

const COMPLIANT_STEPS = [
	'Open the Compliant event handler and create a new client action.',
	'Assign the IsValid output to a Boolean local variable (for example IsPasswordValid) and bind the submit button Enabled property to it.',
] as const;

export const PASSWORD_POLICY_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Password Policy',
		groupProps: {},
		publishStep: 'Publish the app and type in the password field — each rule turns green as it is met.',
		items: [
			{
				placeholders: [
					{ label: 'Password parameter', steps: [...PASSWORD_INPUT_STEPS] },
					{ label: 'Compliant event', steps: [...COMPLIANT_STEPS] },
				],
			},
		],
	},
	partiallyValid: {
		kind: 'widget',
		widgetName: 'Password Policy',
		groupProps: {},
		publishStep:
			'Publish the app and type a value such as "password1" — the lower-case and number rows turn green while the rest stay unmet.',
		items: [
			{
				placeholders: [
					{ label: 'Password parameter', steps: [...PASSWORD_INPUT_STEPS] },
					{ label: 'Compliant event', steps: [...COMPLIANT_STEPS] },
				],
			},
		],
	},
	compliant: {
		kind: 'widget',
		widgetName: 'Password Policy',
		groupProps: {},
		publishStep:
			'Publish the app and type a value that meets every rule, such as "CorrectHorse42" — the list collapses to the success row and the submit button becomes enabled.',
		items: [
			{
				placeholders: [
					{ label: 'Password parameter', steps: [...PASSWORD_INPUT_STEPS] },
					{ label: 'Compliant event', steps: [...COMPLIANT_STEPS] },
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
