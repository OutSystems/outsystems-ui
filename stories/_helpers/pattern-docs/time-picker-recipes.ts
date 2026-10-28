import type { StudioRecipe } from '../studio-recipe';

const TIME_INPUT_STEPS = [
	'Drag an Input widget into the Timepicker placeholder.',
	'Bind its Variable to a Time local variable and set Prompt to "Select a time".',
];

export const TIME_PICKER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Time Picker',
		groupProps: { Is24Hours: true },
		items: [{ placeholders: [{ label: 'Timepicker placeholder', steps: TIME_INPUT_STEPS }] }],
		publishStep: 'Publish the app and click the input: an hour:minute spinner opens in 24-hour form.',
	},
	twelveHour: {
		kind: 'widget',
		widgetName: 'Time Picker',
		groupProps: { Is24Hours: false, InitialTime: '#09:30:00#' },
		items: [{ placeholders: [{ label: 'Timepicker placeholder', steps: TIME_INPUT_STEPS }] }],
		publishStep: 'Publish the app: the input renders "09:30 AM" and the spinner shows an AM/PM toggle.',
	},
	minMaxTime: {
		kind: 'widget',
		widgetName: 'Time Picker',
		groupProps: {
			Is24Hours: true,
			InitialTime: '#09:00:00#',
			'OptionalConfigs.MinTime': '#09:00:00#',
			'OptionalConfigs.MaxTime': '#18:00:00#',
		},
		items: [{ placeholders: [{ label: 'Timepicker placeholder', steps: TIME_INPUT_STEPS }] }],
		publishStep: 'Publish the app and try to spin past 18:00 or before 09:00: the picker refuses the value.',
	},
} satisfies Record<string, StudioRecipe>;
