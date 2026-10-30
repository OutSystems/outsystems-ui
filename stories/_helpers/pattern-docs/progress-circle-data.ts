import type { PatternDocMeta } from './types';

export const PROGRESS_CIRCLE_DOC: PatternDocMeta = {
	name: 'Progress Circle',
	category: 'Numbers',
	lede: 'Ring that fills clockwise from 0 to 100% with a placeholder at its centre — compact completion for cards, avatars and dashboards.',
	overview:
		'The runtime (`ProgressAPI`, type `Circle`) draws two SVG circles — a trail and a progress path — and animates the stroke-dashoffset to the clamped Progress value, mirrored in `aria-valuenow`. Size sets the diameter (`auto` follows the parent width), Thickness the stroke width and Shape the line caps; the Content placeholder sits centred over the ring.',
	stylingSelector: '.osui-progress-circle',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/numbers/progress_circle/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/numbers/progress_circle/',
	liveStoryId: 'patterns-numbers-progress-circle--basic-usage',
	whenToUse: [
		'A percentage that must fit a square slot — card corners, list rows, KPI tiles.',
		'Completion of a profile, a course or a checklist, with the value shown in the centre.',
		'Several parallel measurements side by side, where stacked bars would grow too tall.',
	],
	whenNotToUse: [
		'Full-width progress with a long label — use Progress Bar.',
		'Indeterminate waits with no known end — use a spinner or Button Loading.',
	],
	anatomy: {
		tree: `<div class="osui-progress-circle" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="72" tabindex="0"
     style="--progress-circle-size:120px; --thickness:8px; --shape:round; --progress-color:…; --trail-color:…;"> <!-- set by the runtime -->
  <div class="osui-progress-circle__container">
    <div class="osui-inline-svg svg-wrapper">
      <svg>
        <defs></defs> <!-- gradient definition when ProgressApplyGradient is used -->
        <circle class="osui-progress-circle__container__trail-path"></circle>
        <circle class="osui-progress-circle__container__progress-path animate-entrance"></circle>
      </svg>
    </div>
  </div>
  <div class="osui-progress-circle__content">
    <!-- Content placeholder (centred over the ring) -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Progress Circle',
			rows: [
				{
					name: 'Progress',
					type: 'Integer',
					description:
						'Progress percentage. Usually a number from 0 to 100; values outside the range are clamped. Required.',
				},
				{
					name: 'ProgressColor',
					type: 'Color',
					defaultValue: 'Primary',
					description:
						'The color that fills the circle as progress goes up. For an arbitrary colour use `TextToIdentifier("rgb(0,0,0)")` or `TextToIdentifier("#000000")`.',
				},
				{
					name: 'Size',
					type: 'Text',
					defaultValue: '"auto"',
					description:
						'Diameter of the circle (height and width) in any CSS unit — "120px", "30%", "10vw". "auto" follows the parent width.',
				},
				{
					name: 'TrailColor',
					type: 'Color',
					defaultValue: 'Neutral4',
					description:
						'The color of the empty part of the circle. Accepts the same `TextToIdentifier` values.',
				},
				{
					name: 'Thickness',
					type: 'Integer',
					defaultValue: '8',
					description: 'Sets the thickness of the stroke that marks the progress, in pixels (`--thickness`).',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Add custom style classes to the Pattern. Example: `myclass` or `myclass1 myclass2`. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'OptionalConfigs',
			rows: [
				{
					name: 'Shape',
					type: 'Shape',
					defaultValue: 'Rounded',
					description:
						'Set the progress shape: Rounded, SoftRounded or Sharp — Sharp gives butt line caps, the other two round caps.',
				},
				{
					name: 'AnimateInitialProgress',
					type: 'Boolean',
					defaultValue: 'True',
					description:
						'If True, the Progress Circle shows an animation going from zero to its initial progress when it is built.',
				},
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description: 'Fires after the Progress Circle instance is ready; returns the ProgressCircleId.',
		},
	],
	apiSections: [
		{
			title: 'Progress API',
			rows: [
				{ name: 'Create', description: 'Register a new Progress instance of type Circle (or Bar).' },
				{ name: 'Initialize', description: 'Build the ring, size the SVG and run the entrance animation.' },
				{ name: 'SetProgressValue', description: 'Animate the arc to a new 0–100 value.' },
				{ name: 'ResetProgressValue', description: 'Return the arc to the initial Progress value.' },
				{
					name: 'ProgressApplyGradient',
					description: 'Stroke the arc with a linear or radial SVG gradient from a list of colours.',
				},
				{
					name: 'ChangeProperty',
					description: 'Update a runtime property (Size, Thickness, Shape, colours…).',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to the Initialized callback.' },
				{ name: 'GetProgressItemById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllProgressItemsMap', description: 'List the ids of every Progress instance.' },
				{ name: 'Dispose', description: 'Tear down the instance and release handlers.' },
			],
		},
	],
	accessibility: [
		'The root carries role="progressbar" with aria-valuemin 0, aria-valuemax 100 and an aria-valuenow the runtime updates on every change, so screen readers announce the current value.',
		'The root is focusable (tabindex="0") so keyboard users can reach the value; it has no keyboard interaction of its own.',
		'Put the percentage or a short label in the Content placeholder — it doubles as the visible value and gives the ring an accessible name nearby.',
		'In RTL the ring is mirrored (`scaleX(-1)`) so it fills counter-clockwise. Animations run through `--progress-initial-speed` and `--progress-speed`; set them to 0s under `prefers-reduced-motion`.',
	],
	related: [
		{ name: 'Progress Bar', storyId: 'patterns-numbers-progress-bar--docs' },
		{ name: 'Counter', storyId: 'patterns-numbers-counter--docs' },
		{ name: 'User Avatar', storyId: 'patterns-content-useravatar--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
	],
};
