import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

const SHARED_ROWS = [
	{
		name: 'Orientation',
		type: 'Orientation',
		defaultValue: 'Horizontal',
		description: 'Horizontal (default) or Vertical track.',
	},
	{
		name: 'Size',
		type: 'Text',
		defaultValue: '100%',
		description:
			'Track length in any CSS unit (px, %, vw): the width when horizontal, the height when vertical. Example: 30%.',
	},
	{
		name: 'OptionalConfigs.ShowFloatingLabel',
		type: 'Boolean',
		defaultValue: 'False',
		description: 'When True, shows the current value in a floating label above each handle.',
	},
	{
		name: 'OptionalConfigs.Step',
		type: 'Decimal',
		defaultValue: '1',
		description: 'Increment between selectable values; the handle snaps to multiples of it.',
	},
	{
		name: 'OptionalConfigs.ShowTickMarks',
		type: 'Boolean',
		defaultValue: 'False',
		description: 'When True, draws tick marks (pips) under the track. Requires TickMarksInterval.',
	},
	{
		name: 'OptionalConfigs.TickMarksInterval',
		type: 'Integer',
		defaultValue: '0',
		description: 'Distance between tick marks in slider units. Cannot be negative.',
	},
	{
		name: 'OptionalConfigs.IsDisabled',
		type: 'Boolean',
		defaultValue: 'False',
		description: 'When True, renders the slider disabled: muted track and handles that do not react to input.',
	},
	{
		name: 'ExtendedClass',
		type: 'Text',
		defaultValue: '""',
		description:
			'Add custom style classes to the pattern. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
	},
];

export const RANGE_SLIDER_DOC: PatternDocMeta = {
	name: 'Range Slider',
	category: 'Interaction',
	lede: 'A draggable handle on a numeric track — set a volume, a budget or a price band by feel instead of typing, with an optional second handle for intervals.',
	overview:
		'Range Slider mounts noUiSlider on the `.osui-range-slider__provider` element between MinValue and MaxValue. The Range Slider block has one handle and returns Value; the Range Slider Interval block has two and returns IntervalStart and IntervalEnd. OnValueChange fires while dragging unless SetRangeSliderChangeOnDragEnd is called.',
	stylingSelector: '.osui-range-slider',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/range_slider/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/range_slider/',
	liveStoryId: 'patterns-interaction-rangeslider--basic-usage',
	cssApiSlug: 'patterns-interaction-rangeslider',
	whenToUse: [
		'Approximate numeric settings where the feel matters more than the exact digit: volume, brightness, zoom, opacity.',
		'Price, size or date-offset filters — the Interval block picks a lower and an upper bound in one gesture.',
		'Bounded ranges with a visible scale, where tick marks and a floating label make the position self-explanatory.',
	],
	whenNotToUse: [
		'Values that must be typed exactly (quantities, amounts to pay) — use an Input widget with validation.',
		'A fixed set of discrete options (S / M / L) — use Radio Buttons or a Dropdown.',
	],
	anatomy: {
		tree: `<div class="osui-range-slider"> <!-- root, located by name="<id>"; adds --is-interval, --has-ticks, --is-vertical -->
  <div class="osui-range-slider__provider"> <!-- noUiSlider mounts here -->
    <div class="noUi-base">
      <div class="noUi-connects"><div class="noUi-connect"></div></div>
      <div class="noUi-origin">
        <div class="noUi-handle" role="slider" tabindex="0">
          <div class="noUi-tooltip">40</div> <!-- ShowFloatingLabel -->
        </div>
      </div>
      <!-- second .noUi-origin / .noUi-handle in the Interval block -->
    </div>
    <div class="noUi-pips">…</div> <!-- ShowTickMarks -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Range Slider',
			rows: [
				{ name: 'MinValue', type: 'Decimal', description: 'Lower bound of the track. Mandatory.' },
				{ name: 'MaxValue', type: 'Decimal', description: 'Upper bound of the track. Mandatory.' },
				{
					name: 'StartingValue',
					type: 'Decimal',
					description: 'Handle position on render; must sit between MinValue and MaxValue. Mandatory.',
				},
				...SHARED_ROWS,
			],
		},
		{
			title: 'Range Slider Interval',
			rows: [
				{ name: 'MinValue', type: 'Decimal', description: 'Lower bound of the track. Mandatory.' },
				{ name: 'MaxValue', type: 'Decimal', description: 'Upper bound of the track. Mandatory.' },
				{
					name: 'StartingValueFrom',
					type: 'Decimal',
					description: 'Lower handle position on render; must sit between MinValue and MaxValue. Mandatory.',
				},
				{
					name: 'StartingValueTo',
					type: 'Decimal',
					description: 'Upper handle position on render; must sit between MinValue and MaxValue. Mandatory.',
				},
				...SHARED_ROWS,
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description: 'Fires after the slider is ready; returns the id to use with the RangeSliderAPI.',
		},
		{
			name: 'OnValueChange',
			description:
				'Fires on every change while dragging — Value for Range Slider, IntervalStart and IntervalEnd for Range Slider Interval. Call SetRangeSliderChangeOnDragEnd to fire only on release.',
		},
	],
	apiSections: [
		{
			title: 'Range Slider API',
			rows: [
				{
					name: 'Create',
					description: 'Register an instance in single or interval mode (noUiSlider provider).',
				},
				{ name: 'Initialize', description: 'Build the track, handles, tooltips and pips.' },
				{ name: 'SetRangeSliderValue', description: 'Move the handle(s) to new from / to values.' },
				{ name: 'ResetRangeSliderValue', description: 'Return the handle(s) to the starting values.' },
				{ name: 'Enable / Disable', description: 'Toggle the disabled state at runtime.' },
				{
					name: 'SetRangeIntervalChangeOnDragEnd',
					description: 'Make OnValueChange fire only when the handle is released.',
				},
				{
					name: 'ChangeProperty',
					description: 'Update a runtime property such as MinValue, Step or ShowTickMarks.',
				},
				{ name: 'SetProviderConfigs', description: 'Pass extra noUiSlider options (extensibility API).' },
				{
					name: 'SetProviderEvent / UnsetProviderEvent',
					description: 'Subscribe to or remove a raw noUiSlider event.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to the OnValueChange and Initialized callbacks.' },
				{ name: 'Dispose', description: 'Destroy the noUiSlider instance and release handlers.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'Each handle is a focusable ',
			React.createElement('code', null, 'role="slider"'),
			' element: ',
			React.createElement(PdKey, null, '←'),
			' / ',
			React.createElement(PdKey, null, '→'),
			' (and ',
			React.createElement(PdKey, null, '↑'),
			' / ',
			React.createElement(PdKey, null, '↓'),
			') move it by one Step, ',
			React.createElement(PdKey, { wide: true, children: 'Home' }),
			' / ',
			React.createElement(PdKey, { wide: true, children: 'End' }),
			' jump to MinValue / MaxValue.'
		),
		'noUiSlider keeps aria-valuemin, aria-valuemax and aria-valuenow on each handle in sync, so screen readers announce the current value as it moves.',
		'Turn on ShowFloatingLabel or ShowTickMarks when the value matters: colour alone (the filled connect) should not be the only cue.',
		'Handles keep their size on touch screens and a disabled slider mutes both track and handles so the state is visible, not only unresponsive.',
	],
	related: [
		{ name: 'Rating', storyId: 'patterns-numbers-rating--docs' },
		{ name: 'Progress Bar', storyId: 'patterns-numbers-progress-bar--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
	],
};
