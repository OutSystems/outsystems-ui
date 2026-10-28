import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

const EXTENDED_CLASS = {
	name: 'ExtendedClass',
	type: 'Text',
	defaultValue: '""',
	description:
		'Add custom style classes to the pattern. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
};

const SHARED_OPTIONAL = [
	{
		name: 'OptionalConfigs.MinDate',
		type: 'Date Time',
		description: 'Earliest selectable date; every day before it is disabled. Empty for no lower limit.',
	},
	{
		name: 'OptionalConfigs.MaxDate',
		type: 'Date Time',
		description: 'Latest selectable date; every day after it is disabled. Empty for no upper limit.',
	},
	{
		name: 'OptionalConfigs.FirstWeekDay',
		type: 'DatePickerWeekDay',
		defaultValue: 'Sunday',
		description: 'Weekday shown in the first column of the calendar.',
	},
	{
		name: 'OptionalConfigs.ShowWeekNumbers',
		type: 'Boolean',
		defaultValue: 'False',
		description: 'When True, shows the ISO week-number column on the left of the calendar.',
	},
];

export const DATE_PICKER_DOC: PatternDocMeta = {
	name: 'Date Picker',
	category: 'Interaction',
	lede: 'A calendar dropdown on a text input — pick a single date, an optional time, or a start/end range without typing a format by hand.',
	overview:
		'Drop an Input widget (Date or DateTime type) in the Datepicker placeholder; the runtime hands it to Flatpickr and renders the calendar under it. Date Picker returns one SelectedDateTime, Date Picker Range returns SelectedStartDate and SelectedEndDate; DateFormat only changes what the input displays — the value stays a platform Date.',
	stylingSelector: '.osui-datepicker',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/date_picker/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/date_picker/',
	liveStoryId: 'patterns-interaction-datepicker--basic-usage',
	cssApiSlug: 'patterns-interaction-datepicker',
	whenToUse: [
		'Booking, scheduling and deadline fields where users think in calendar days (delivery date, due date, appointment).',
		'Check-in / check-out and reporting periods — the Date Picker Range block picks both ends in one calendar.',
		'Forms that must display a locale-specific format (DD/MM/YYYY, MMM DDD, YYYY) while storing a real Date.',
	],
	whenNotToUse: [
		'Month-granularity choices such as a billing period — use the Month Picker.',
		'Time-only fields (opening hours, reminders) — use the Time Picker.',
	],
	anatomy: {
		tree: `<div class="osui-datepicker"> <!-- root, located by name="<id>" -->
  <input class="form-control" type="text" /> <!-- Datepicker placeholder: Input widget (Date / DateTime) -->
</div>
<div class="osui-datepicker-a11y"> <!-- keyboard instructions for screen readers, filled by the runtime -->
</div>
<!-- Flatpickr appends to <body> while open: -->
<div class="flatpickr-calendar osui-datepicker-calendar">
  <div class="flatpickr-months">…</div>
  <div class="flatpickr-weekdays">…</div>
  <div class="flatpickr-days">…</div>
  <div class="flatpickr-time">…</div> <!-- only when TimeFormat is not Disabled -->
  <div class="flatpickr-today-button">…</div> <!-- only when ShowTodayButton is True -->
</div>`,
	},
	properties: [
		{
			title: 'Date Picker',
			rows: [
				{
					name: 'DateFormat',
					type: 'Text',
					defaultValue: '""',
					description:
						'Display format of the input, e.g. DD/MM/YYYY, MM/DD/YYYY, DD MMM YYYY. Empty uses the server date format. Keep it date-only: the time part is appended from TimeFormat.',
				},
				{
					name: 'ShowTodayButton',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, shows a Today button below the calendar that selects the current day.',
				},
				{
					name: 'TimeFormat',
					type: 'DatePickerTimeFormat',
					defaultValue: 'Disabled',
					description:
						'Disabled — date only. Time12hFormat / Time24hFormat — adds an hour:minute spinner to the calendar.',
				},
				{
					name: 'OptionalConfigs.InitialDate',
					type: 'Date Time',
					description: 'Date preselected when the picker renders. Empty for no selection.',
				},
				...SHARED_OPTIONAL,
				EXTENDED_CLASS,
			],
		},
		{
			title: 'Date Picker Range',
			rows: [
				{
					name: 'DateFormat',
					type: 'Text',
					defaultValue: '""',
					description: 'Display format of both dates in the input. Empty uses the server date format.',
				},
				{
					name: 'ShowTodayButton',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, shows a Today button below the calendar that selects the current day.',
				},
				{
					name: 'OptionalConfigs.InitialStartDate',
					type: 'Date',
					description: 'Start date preselected when the picker renders.',
				},
				{
					name: 'OptionalConfigs.InitialEndDate',
					type: 'Date',
					description: 'End date preselected when the picker renders.',
				},
				...SHARED_OPTIONAL,
				EXTENDED_CLASS,
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description: 'Fires after the Date Picker instance is ready; returns the DatePickerId.',
		},
		{
			name: 'OnSelected',
			description:
				'Fires each time a date is picked — SelectedDateTime for Date Picker, SelectedStartDate and SelectedEndDate for Date Picker Range.',
		},
	],
	apiSections: [
		{
			title: 'Date Picker API',
			rows: [
				{ name: 'Create', description: 'Register an instance in single or range mode (Flatpickr provider).' },
				{ name: 'Initialize', description: 'Build the calendar on the Input widget.' },
				{ name: 'Open / Close', description: 'Programmatically show or hide the calendar.' },
				{ name: 'Clear', description: 'Remove the selected date(s) and empty the input.' },
				{ name: 'UpdateInitialDate', description: 'Set a new selected date (or start and end dates).' },
				{
					name: 'DisableDays / DisableWeekDays',
					description: 'Block specific dates or weekdays from selection.',
				},
				{ name: 'SetLanguage', description: 'Switch the calendar locale by ISO code.' },
				{ name: 'UpdatePrompt', description: 'Change the input placeholder text.' },
				{ name: 'SetEditableInput', description: 'Allow or block typing a date directly in the input.' },
				{
					name: 'ToggleNativeBehavior',
					description: 'Use the native mobile date input instead of the calendar.',
				},
				{ name: 'Redraw', description: 'Rebuild the provider after configuration changes.' },
				{
					name: 'ChangeProperty',
					description: 'Update a runtime property such as DateFormat or ShowTodayButton.',
				},
				{ name: 'SetProviderConfigs', description: 'Pass extra Flatpickr options (extensibility API).' },
				{
					name: 'SetProviderEvent / UnsetProviderEvent',
					description: 'Subscribe to or remove a raw Flatpickr event.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to the OnSelected and Initialized callbacks.' },
				{ name: 'Dispose', description: 'Destroy the Flatpickr instance and release handlers.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'Keyboard: ',
			React.createElement(PdKey, null, '↓'),
			' opens the calendar on the focused input, arrow keys move between days, ',
			React.createElement(PdKey, { wide: true, children: 'Ctrl' }),
			' / ',
			React.createElement(PdKey, { wide: true, children: 'Cmd' }),
			' + arrows jump months and years, ',
			React.createElement(PdKey, { wide: true, children: 'Enter' }),
			' selects and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes.'
		),
		'The runtime fills the `.osui-datepicker-a11y` container with those keyboard instructions, localised per SetLanguage, so screen readers announce them before the calendar.',
		'A visually hidden month/year summary is prepended to the month header and updated on every navigation.',
		'The Today button carries a localised aria-label, and the Flatpickr input mirrors the platform Input’s disabled state through tabindex and aria-hidden.',
	],
	related: [
		{ name: 'Month Picker', storyId: 'patterns-interaction-monthpicker--docs' },
		{ name: 'Time Picker', storyId: 'patterns-interaction-timepicker--docs' },
		{ name: 'Animated Label', storyId: 'patterns-interaction-animatedlabel--docs' },
	],
};
