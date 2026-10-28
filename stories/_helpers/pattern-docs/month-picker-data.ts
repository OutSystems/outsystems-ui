import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const MONTH_PICKER_DOC: PatternDocMeta = {
	name: 'Month Picker',
	category: 'Interaction',
	lede: 'A month-and-year grid on a text input — the right control for billing periods, statements and reports where the day does not matter.',
	overview:
		'Drop an Input widget (Date type) in the MonthPicker placeholder; the runtime builds a Flatpickr month grid under it with year arrows. OnSelected returns a MonthOrderYear record, and MinMonth / MaxMonth grey out everything outside the allowed window.',
	stylingSelector: '.osui-monthpicker',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/month_picker/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/month_picker/',
	liveStoryId: 'patterns-interaction-monthpicker--basic-usage',
	cssApiSlug: 'patterns-interaction-monthpicker',
	whenToUse: [
		'Billing or statement periods, payroll months and subscription renewals.',
		'Report filters that aggregate by month (sales per month, usage per month).',
		'Expiry fields such as card expiry (MM/YYYY) where only month and year are meaningful.',
	],
	whenNotToUse: [
		'Anything that needs a specific day — use the Date Picker (or Date Picker Range for a period with exact bounds).',
		'A fixed short list of periods (last 3 months, this quarter) — a Dropdown is faster to scan.',
	],
	anatomy: {
		tree: `<div class="osui-monthpicker"> <!-- root, located by name="<id>" -->
  <input class="form-control" type="text" /> <!-- MonthPicker placeholder: Input widget (Date) -->
</div>
<div class="osui-monthpicker-a11y"> <!-- keyboard instructions for screen readers, filled by the runtime -->
</div>
<!-- Flatpickr appends to <body> while open: -->
<div class="flatpickr-calendar osui-monthpicker__dropdown">
  <span class="flatpickr-prev-month"></span> <input class="cur-year" /> <span class="flatpickr-next-month"></span>
  <div class="flatpickr-monthSelect-months">…</div> <!-- 12 month cells -->
</div>`,
	},
	properties: [
		{
			title: 'Month Picker',
			rows: [
				{
					name: 'DateFormat',
					type: 'Text',
					defaultValue: 'MM/YYYY',
					description:
						'Display format of the input: MM/YYYY → 03/2022, MMM YYYY → Mar 2022, MMM-YYYY → Mar-2022, MMM, YY → Mar, 22.',
				},
				{
					name: 'InitialMonth',
					type: 'MonthYear',
					description: 'Month and year preselected when the picker renders. Empty for no selection.',
				},
				{
					name: 'MinMonth',
					type: 'MonthYear',
					description: 'Earliest selectable month; every month before it is disabled.',
				},
				{
					name: 'MaxMonth',
					type: 'MonthYear',
					description: 'Latest selectable month; every month after it is disabled.',
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
			description: 'Fires after the Month Picker instance is ready; returns the MonthpickerId.',
		},
		{
			name: 'OnSelected',
			description: 'Fires when the user picks a month; SelectedMonth is a MonthOrderYear (month order and year).',
		},
	],
	apiSections: [
		{
			title: 'Month Picker API',
			rows: [
				{ name: 'Create', description: 'Register an instance (Flatpickr provider).' },
				{ name: 'Initialize', description: 'Build the month grid on the Input widget.' },
				{ name: 'Open / Close', description: 'Programmatically show or hide the grid.' },
				{ name: 'Clear', description: 'Remove the selected month and empty the input.' },
				{ name: 'UpdateInitialMonth', description: 'Set a new selected month from a { Month, Year } record.' },
				{ name: 'SetLanguage', description: 'Switch the month names and instructions to another ISO locale.' },
				{ name: 'UpdatePrompt', description: 'Change the input placeholder text.' },
				{ name: 'SetEditableInput', description: 'Allow or block typing a month directly in the input.' },
				{
					name: 'ChangeProperty',
					description: 'Update a runtime property such as DateFormat, MinMonth or MaxMonth.',
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
			' opens the grid on the focused input, arrow keys move between months, ',
			React.createElement(PdKey, { wide: true, children: 'Ctrl' }),
			' / ',
			React.createElement(PdKey, { wide: true, children: 'Cmd' }),
			' + ',
			React.createElement(PdKey, null, '↑'),
			' / ',
			React.createElement(PdKey, null, '↓'),
			' change the year, ',
			React.createElement(PdKey, { wide: true, children: 'Enter' }),
			' selects and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes.'
		),
		'The runtime fills the `.osui-monthpicker-a11y` container with those instructions, localised per SetLanguage, so screen readers announce them before the grid.',
		'Months outside MinMonth / MaxMonth are rendered disabled and skipped by keyboard navigation.',
		'The Flatpickr input mirrors the platform Input’s disabled state through tabindex and aria-hidden, so a disabled field is not reachable twice.',
	],
	related: [
		{ name: 'Date Picker', storyId: 'patterns-interaction-datepicker--docs' },
		{ name: 'Time Picker', storyId: 'patterns-interaction-timepicker--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
	],
};
