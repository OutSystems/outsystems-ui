import type { StudioRecipe } from '../studio-recipe';

const DATE_INPUT_STEPS = [
	'Drag an Input widget into the Datepicker placeholder.',
	'Bind its Variable to a Date local variable and set Prompt to "Select a date".',
];

export const DATE_PICKER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Date Picker',
		groupProps: { DateFormat: 'DD/MM/YYYY', ShowTodayButton: false, TimeFormat: 'Disabled' },
		items: [{ placeholders: [{ label: 'Datepicker placeholder', steps: DATE_INPUT_STEPS }] }],
		publishStep: 'Publish the app, open the calendar and pick a day: the input shows it as DD/MM/YYYY.',
	},
	range: {
		kind: 'widget',
		widgetName: 'Date Picker Range',
		groupProps: { DateFormat: 'DD/MM/YYYY', ShowTodayButton: false },
		items: [
			{
				placeholders: [
					{
						label: 'Datepicker placeholder',
						steps: [
							'Drag an Input widget into the Datepicker placeholder.',
							'Bind its Variable to a Text local variable and set Prompt to "Select a date range".',
							'On the OnSelected handler, store SelectedStartDate and SelectedEndDate in two Date local variables.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and click two days in the calendar: the input shows "start to end".',
	},
	withTime: {
		kind: 'widget',
		widgetName: 'Date Picker',
		groupProps: {
			DateFormat: 'DD/MM/YYYY',
			ShowTodayButton: false,
			TimeFormat: 'Time24hFormat',
			'OptionalConfigs.InitialDate': '#2024-03-15 09:30:00#',
		},
		items: [
			{
				placeholders: [
					{
						label: 'Datepicker placeholder',
						steps: [
							'Drag an Input widget into the Datepicker placeholder.',
							'Bind its Variable to a Date Time local variable (the time part is needed) and set Prompt to "Select a date and time".',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and open the picker: the hour and minute spinner sits under the calendar.',
	},
	todayButton: {
		kind: 'widget',
		widgetName: 'Date Picker',
		groupProps: { DateFormat: 'DD/MM/YYYY', ShowTodayButton: true, TimeFormat: 'Disabled' },
		items: [{ placeholders: [{ label: 'Datepicker placeholder', steps: DATE_INPUT_STEPS }] }],
		publishStep:
			'Publish the app, open the picker and press Today: the current day is selected and the calendar closes.',
	},
} satisfies Record<string, StudioRecipe>;
