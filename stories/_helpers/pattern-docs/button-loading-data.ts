import type { PatternDocMeta } from './types';

export const BUTTON_LOADING_DOC: PatternDocMeta = {
	name: 'Button Loading',
	category: 'Utilities',
	lede: 'Wraps a Button or Link so it shows a spinner and blocks repeat clicks while a slow action runs — ideal for save, submit, and checkout flows.',
	overview:
		'Drop a Button (or Link) into the Button placeholder and bind IsLoading to a Boolean. While it is True the runtime adds the loading class, shows the spinner, marks the wrapper aria-busy and disables the button; ShowLabelOnLoading decides whether the label stays visible beside the spinner or collapses to the spinner alone.',
	stylingSelector: '.osui-btn-loading',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/utilities/button_loading/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/utilities/button_loading/',
	liveStoryId: 'patterns-utilities-buttonloading--basic-usage',
	whenToUse: [
		'Form submits, saves, or payments whose server action takes long enough for the user to wonder whether the click registered.',
		'Any action that must not be triggered twice — the button is disabled for as long as IsLoading is True.',
		'Buttons that trigger a download or export and need inline feedback without a full-screen overlay.',
	],
	whenNotToUse: [
		'Instant client-side actions — the spinner would flash for a few milliseconds and feel like a glitch.',
		'Long multi-step processes where the user should see progress — use Progress Bar or a Notification instead.',
	],
	anatomy: {
		tree: `<div class="osui-btn-loading osui-btn-loading--is-loading" aria-live="polite" aria-atomic="true" aria-busy="true">
  <!-- Button placeholder -->
  <button class="btn btn-primary" type="button" disabled>
    <span class="osui-btn-loading__spinner-animation" aria-hidden="true"></span>
    <span data-expression>Save changes</span> <!-- the button label (Expression) -->
  </button>
</div>
<!-- ShowLabelOnLoading = False adds .osui-btn-loading-show-spinner to the root -->`,
	},
	properties: [
		{
			title: 'Button Loading',
			rows: [
				{
					name: 'IsLoading',
					type: 'Boolean',
					description:
						'If True, the button shows the loading spinner and is disabled. If False, the button renders normally. Mandatory — bind it to a local Boolean you toggle around the action.',
				},
				{
					name: 'ShowLabelOnLoading',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'If True, the loading spinner displays beside the label. If False, only the loading spinner is displayed. Runtime config name: `ShowLoadingAndLabel`.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Button Loading root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description: 'Fires once the Button Loading instance is built; receives the ButtonLoadingId.',
		},
	],
	apiSections: [
		{
			title: 'Button Loading API',
			rows: [
				{ name: 'Create', description: 'Register a new Button Loading instance from its configs JSON.' },
				{
					name: 'Initialize',
					description:
						'Build the pattern: find the .btn and spinner children, apply the initial state and ARIA.',
				},
				{
					name: 'ChangeProperty',
					description:
						'Update IsLoading or ShowLoadingAndLabel at runtime (what the platform calls on a bound change).',
				},
				{
					name: 'ForceIsLoadingDisabledState',
					description:
						'Choose whether the inner button gets the disabled attribute while loading (True by default).',
				},
				{ name: 'GetButtonLoadingById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllButtonsLoading', description: 'List the ids of every Button Loading on the page.' },
				{ name: 'RegisterCallback', description: 'Subscribe to the Initialized callback.' },
				{ name: 'Dispose', description: 'Tear down the instance and release its element references.' },
			],
		},
	],
	accessibility: [
		'The root carries aria-live="polite" and aria-atomic="true", and aria-busy flips with IsLoading, so screen readers announce the state change without interrupting the user.',
		'While loading the inner button receives the disabled attribute and is blurred — keyboard focus cannot land on an action that is already running. Use ForceIsLoadingDisabledState(id, false) only when you manage disabling yourself.',
		'The spinner is decorative (aria-hidden="true"); the label text still carries the meaning, so prefer ShowLabelOnLoading True when the loading state should stay readable.',
		'In high-contrast mode the spinner border thickens, and on phones the wrapper stretches to full width to match the button.',
	],
	related: [
		{ name: 'Provider Login Button', storyId: 'patterns-utilities-providerloginbutton--docs' },
		{ name: 'Progress Bar', storyId: 'patterns-numbers-progress-bar--docs' },
		{ name: 'Notification', storyId: 'patterns-interaction-notification--docs' },
	],
};
