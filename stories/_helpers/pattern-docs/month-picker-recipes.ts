import type { StudioRecipe } from '../studio-recipe';

const MONTH_INPUT_STEPS = [
	'Drag an Input widget into the MonthPicker placeholder.',
	'Bind its Variable to a Date local variable and set Prompt to "Select a month".',
];

export const MONTH_PICKER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Month Picker',
		groupProps: { DateFormat: 'MM/YYYY' },
		items: [{ placeholders: [{ label: 'MonthPicker placeholder', steps: MONTH_INPUT_STEPS }] }],
		publishStep: 'Publish the app and click the input: a 12-month grid opens with arrows to change the year.',
	},
	monthNameFormat: {
		kind: 'widget',
		widgetName: 'Month Picker',
		groupProps: { DateFormat: 'MMM YYYY', InitialMonth: 'MonthYear(Month: "March", Year: 2024)' },
		items: [{ placeholders: [{ label: 'MonthPicker placeholder', steps: MONTH_INPUT_STEPS }] }],
		publishStep:
			'Publish the app: the input renders "Mar 2024" and any pick is shown as an abbreviated month name.',
	},
	minMaxMonth: {
		kind: 'widget',
		widgetName: 'Month Picker',
		groupProps: {
			DateFormat: 'MM/YYYY',
			InitialMonth: 'MonthYear(Month: "June", Year: 2024)',
			MinMonth: 'MonthYear(Month: "January", Year: 2024)',
			MaxMonth: 'MonthYear(Month: "December", Year: 2024)',
		},
		items: [{ placeholders: [{ label: 'MonthPicker placeholder', steps: MONTH_INPUT_STEPS }] }],
		publishStep:
			'Publish the app and open the picker: only the 2024 months are enabled and the year arrows stop at the limits.',
	},
} satisfies Record<string, StudioRecipe>;
