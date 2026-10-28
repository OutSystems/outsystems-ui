import type { PatternDocMeta } from './types';

export const PROGRESS_DOC: PatternDocMeta = {
	name: 'Progress Bar',
	category: 'Numbers',
	lede: 'Horizontal track that fills from 0 to 100% — for uploads, quota usage, or how far along a multi-step flow is.',
	overview:
		'The runtime (`ProgressAPI`, type `Bar`) clamps Progress to 0–100, writes it to `--progress-value` and `aria-valuenow`, and resolves ProgressColor and TrailColor through the `--color-*` theme roles. Thickness sets the track height and Shape its end caps; the first render animates from 0 when AnimateInitialProgress is True, and every later `SetProgressValue` transitions the fill.',
	stylingSelector: '.osui-progress-bar',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/numbers/progress_bar/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/numbers/progress_bar/',
	liveStoryId: 'patterns-numbers-progress-bar--basic-usage',
	cssApiSlug: 'patterns-numbers-progressbar',
	whenToUse: [
		'A determinate operation whose completion you can measure — upload, import, sync.',
		'Quota or capacity usage (storage used, budget spent) next to its label.',
		'Position in a sequence of steps when a full Wizard would be too heavy.',
	],
	whenNotToUse: [
		'Indeterminate waits with no known end — use a spinner or Button Loading.',
		'A compact percentage inside a card, a row or an avatar — use Progress Circle.',
	],
	anatomy: {
		tree: `<div class="osui-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" tabindex="0"
     style="--progress-value:60%; --thickness:12px; --shape:…; --progress-color:…; --trail-color:…;"> <!-- set by the runtime -->
  <div class="osui-progress-bar__container animate-entrance"> <!-- .animate-progress-change on later updates -->
    <div class="osui-progress-bar__value"></div> <!-- the fill is drawn by ::before -->
  </div>
  <div class="osui-progress-bar__content">
    <!-- Content placeholder -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Progress Bar',
			rows: [
				{
					name: 'Progress',
					type: 'Integer',
					description:
						'Progress percentage. Usually a number between 0 and 100; values outside the range are clamped. Required.',
				},
				{
					name: 'ProgressColor',
					type: 'Color',
					defaultValue: 'Primary',
					description:
						'The color that fills the bar as progress goes up. For an arbitrary colour use `TextToIdentifier("rgb(0,0,0)")` or `TextToIdentifier("#000000")`.',
				},
				{
					name: 'TrailColor',
					type: 'Color',
					defaultValue: 'Neutral4',
					description: 'The color of the empty part of the bar. Accepts the same `TextToIdentifier` values.',
				},
				{
					name: 'Thickness',
					type: 'Integer',
					defaultValue: '12',
					description: 'Sets the height of the Progress Bar, in pixels (`--thickness`).',
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
						'Sets the progress shape: Rounded, SoftRounded or Sharp — the end caps follow the theme radius of that shape.',
				},
				{
					name: 'AnimateInitialProgress',
					type: 'Boolean',
					defaultValue: 'True',
					description:
						'If True, the Progress Bar shows an animation going from zero to its initial progress when it is built.',
				},
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description: 'Fires after the Progress Bar instance is ready; returns the ProgressBarId.',
		},
	],
	apiSections: [
		{
			title: 'Progress API',
			rows: [
				{ name: 'Create', description: 'Register a new Progress instance of type Bar (or Circle).' },
				{ name: 'Initialize', description: 'Build the bar, apply the configs and run the entrance animation.' },
				{ name: 'SetProgressValue', description: 'Animate the fill to a new 0–100 value.' },
				{ name: 'ResetProgressValue', description: 'Return the fill to the initial Progress value.' },
				{
					name: 'ProgressApplyGradient',
					description: 'Replace the solid fill with a linear or radial gradient from a list of colours.',
				},
				{ name: 'ChangeProperty', description: 'Update a runtime property (Thickness, Shape, colours…).' },
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
		'A progressbar has no accessible name by itself — put a visible label or the percentage in the Content placeholder, or a heading right before the bar.',
		'The entrance and change animations run through `--progress-initial-speed` (0.5s) and `--progress-speed` (0.35s); set them to 0s under `prefers-reduced-motion`. `.os-high-contrast` outlines the track.',
	],
	related: [
		{ name: 'Progress Circle', storyId: 'patterns-numbers-progress-circle--docs' },
		{ name: 'Wizard', storyId: 'patterns-navigation-wizard--docs' },
		{ name: 'Counter', storyId: 'patterns-numbers-counter--docs' },
		{ name: 'Button Loading', storyId: 'patterns-utilities-buttonloading--docs' },
	],
};
