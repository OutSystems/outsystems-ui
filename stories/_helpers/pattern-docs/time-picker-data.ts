import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const TIME_PICKER_DOC: PatternDocMeta = {
	name: 'Time Picker',
	category: 'Interaction',
	lede: 'An hour-and-minute spinner on a text input, in 24-hour or AM/PM form — for reminders, opening hours and appointment slots.',
	overview:
		'Drop an Input widget (Time type) in the Timepicker placeholder; the runtime attaches a Flatpickr time panel under it. Is24Hours picks the clock, TimeFormat overrides the display mask, and MinTime / MaxTime in OptionalConfigs clamp what can be chosen. OnSelected returns the chosen Time.',
	stylingSelector: '.osui-timepicker',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/time_picker/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/time_picker/',
	liveStoryId: 'patterns-interaction-timepicker--basic-usage',
	cssApiSlug: 'patterns-interaction-timepicker',
	whenToUse: [
		'Time-only fields: reminders, shift start and end, store opening hours.',
		'Appointment or delivery slots where the date is already fixed elsewhere on the screen.',
		'Forms that must show a 12-hour clock with AM/PM to some users and a 24-hour clock to others.',
	],
	whenNotToUse: [
		'A date and a time chosen together — use the Date Picker with TimeFormat set.',
		'A handful of fixed slots (09:00, 09:30, 10:00) — a Dropdown is quicker to scan and tap.',
	],
	anatomy: {
		tree: `<div class="osui-timepicker"> <!-- root, located by name="<id>" -->
  <input class="form-control" type="text" /> <!-- Timepicker placeholder: Input widget (Time) -->
</div>
<!-- Flatpickr appends to <body> while open: -->
<div class="flatpickr-calendar osui-timepicker__dropdown">
  <div class="flatpickr-time">
    <input class="flatpickr-hour" /> : <input class="flatpickr-minute" />
    <span class="flatpickr-am-pm">AM</span> <!-- only when Is24Hours is False -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Time Picker',
			rows: [
				{
					name: 'TimeFormat',
					type: 'Text',
					defaultValue: '""',
					description:
						'Display mask using Flatpickr tokens: H → 24-hour, h → 12-hour, i → minutes, K → AM/PM (e.g. H:i → 15:30, h:i K → 03:30 PM). Empty derives the mask from Is24Hours.',
				},
				{
					name: 'Is24Hours',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'True shows a 24-hour clock; False shows a 12-hour clock with an AM/PM selector.',
				},
				{
					name: 'InitialTime',
					type: 'Time',
					defaultValue: '#00:00:00#',
					description:
						'Time preselected when the picker renders. Left at 00:00:00 the input stays empty and the spinner opens at 12:00.',
				},
				{
					name: 'OptionalConfigs.MinTime',
					type: 'Time',
					description: 'Earliest selectable time; the spinner refuses anything before it.',
				},
				{
					name: 'OptionalConfigs.MaxTime',
					type: 'Time',
					description: 'Latest selectable time; the spinner refuses anything after it.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Add custom style classes to the pattern. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description: 'Fires after the Time Picker instance is ready; returns the TimePickerId.',
		},
		{ name: 'OnSelected', description: 'Fires when the user picks a time; SelectedTime holds the value.' },
	],
	apiSections: [
		{
			title: 'Time Picker API',
			rows: [
				{ name: 'Create', description: 'Register an instance (Flatpickr provider).' },
				{ name: 'Initialize', description: 'Build the time panel on the Input widget.' },
				{ name: 'Open / Close', description: 'Programmatically show or hide the panel.' },
				{ name: 'Clear', description: 'Remove the selected time and empty the input.' },
				{ name: 'UpdateInitialTime', description: 'Set a new selected time (HH:mm).' },
				{ name: 'SetLanguage', description: 'Switch the AM/PM labels and instructions to another ISO locale.' },
				{ name: 'UpdatePrompt', description: 'Change the input placeholder text.' },
				{ name: 'SetEditableInput', description: 'Allow or block typing a time directly in the input.' },
				{ name: 'ToggleNativeBehavior', description: 'Use the native mobile time input instead of the panel.' },
				{ name: 'Redraw', description: 'Rebuild the provider after configuration changes.' },
				{
					name: 'ChangeProperty',
					description: 'Update a runtime property such as Is24Hours, MinTime or MaxTime.',
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
			'Keyboard: focus the input and press ',
			React.createElement(PdKey, null, '↓'),
			' to open; ',
			React.createElement(PdKey, { wide: true, children: 'Tab' }),
			' moves between the hour, minute and AM/PM fields, ',
			React.createElement(PdKey, null, '↑'),
			' / ',
			React.createElement(PdKey, null, '↓'),
			' step the focused field, ',
			React.createElement(PdKey, { wide: true, children: 'Enter' }),
			' confirms and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes.'
		),
		'The hour and minute fields are real inputs, so users can type a value directly instead of spinning.',
		'The Flatpickr input mirrors the platform Input’s disabled state through tabindex and aria-hidden, so a disabled field is not reachable twice.',
		'Values outside MinTime / MaxTime are rejected rather than silently clamped, so what is announced is what was stored.',
	],
	related: [
		{ name: 'Date Picker', storyId: 'patterns-interaction-datepicker--docs' },
		{ name: 'Month Picker', storyId: 'patterns-interaction-monthpicker--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
	],
};
