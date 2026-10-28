import type { PatternDocMeta } from './types';

export const ANIMATED_LABEL_DOC: PatternDocMeta = {
	name: 'Animated Label',
	category: 'Interaction',
	lede: 'A label that sits inside the input and floats to its top edge on focus or once a value exists — compact forms that never lose their field names.',
	overview:
		'The block wraps a Label placeholder and an Input placeholder. The runtime listens to the input’s focus and blur and toggles the `active` class on the root: when the input is focused or holds text the label floats, when it is blurred and empty the label drops back. A value present at render floats on `UpdateOnRender`.',
	stylingSelector: '.animated-label',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/animated_label/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/animated_label/',
	liveStoryId: 'patterns-interaction-animatedlabel--basic-usage',
	cssApiSlug: 'patterns-interaction-animated-label',
	whenToUse: [
		'Dense forms (sign-up, checkout, settings) where a label above every field would double the height.',
		'Fields whose placeholder would otherwise disappear on typing — the floating label keeps the field name visible.',
		'Mobile forms where vertical space is scarce and the label can share the input box.',
	],
	whenNotToUse: [
		'Inputs that need a long or multi-line label, or helper text beside the label — use a plain Label above the Input instead.',
		'Search or filter fields with a single obvious purpose — use the Search or Input With Icon patterns.',
	],
	anatomy: {
		tree: `<div class="animated-label"> <!-- root; gains .active while focused or filled -->
  <div class="animated-label-text">
    <label for="<input-id>" data-label>Full name</label> <!-- Label placeholder -->
  </div>
  <div class="animated-label-input">
    <input id="<input-id>" class="form-control" type="text" data-input /> <!-- Input placeholder -->
    <span class="validation-message">…</span> <!-- platform, only when the Input is not valid -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Animated Label',
			rows: [
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
	events: [{ name: 'Initialized', description: 'Fires after the Animated Label instance is ready.' }],
	apiSections: [
		{
			title: 'Animated Label API',
			rows: [
				{ name: 'Create', description: 'Register a new Animated Label instance.' },
				{
					name: 'Initialize',
					description: 'Build the pattern and attach the focus / blur listeners to the input.',
				},
				{
					name: 'UpdateOnRender',
					description: 'Re-evaluate the input value after a render so a pre-filled field floats its label.',
				},
				{ name: 'ChangeProperty', description: 'Update a runtime property (ExtendedClass).' },
				{ name: 'RegisterCallback', description: 'Subscribe to the Initialized callback.' },
				{ name: 'GetAnimatedLabelById', description: 'Return the instance registered under an id.' },
				{ name: 'Dispose', description: 'Remove the listeners and release the instance.' },
			],
		},
	],
	accessibility: [
		'The label is a real <label for> bound to the Input id, so screen readers announce the field name whether the label is resting or floating.',
		'Focus moves straight to the Input: the animation is purely visual and adds no extra tab stop.',
		'The resting label is not a placeholder — it stays readable in the floated position, meeting the visible-label requirement.',
		'The floating transition respects the input’s contrast tokens; disabled fields mute both the surface and the label together.',
	],
	related: [
		{ name: 'Input With Icon', storyId: 'patterns-interaction-inputwithicon--docs' },
		{ name: 'Search', storyId: 'patterns-interaction-search--docs' },
		{ name: 'Date Picker', storyId: 'patterns-interaction-datepicker--docs' },
	],
};
