import type { PatternDocMeta } from './types';

export const INPUT_WITH_ICON_DOC: PatternDocMeta = {
	name: 'Input With Icon',
	category: 'Interaction',
	lede: 'An Input widget with an icon docked inside its start or end edge — a visual hint (envelope, calendar, user) that costs no extra space.',
	overview:
		'A CSS-only wrapper with two placeholders: Icon and Input. The icon slot is absolutely positioned over the input, and the input gets matching padding on that side so text never runs under the glyph. AlignIconRight moves the slot to the end edge; sizing and states (hover, focus, disabled, error) come from the Input widget itself.',
	stylingSelector: '.input-with-icon',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/input_with_icon/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/input_with_icon/',
	liveStoryId: 'patterns-interaction-inputwithicon--basic-usage',
	cssApiSlug: 'patterns-interaction-input-with-icon',
	whenToUse: [
		'Fields whose type is instantly recognisable from a glyph: e-mail, phone, username, amount, location.',
		'Date, time or password fields where an end-edge icon signals an action (open the calendar, toggle visibility).',
		'Compact filter bars where an icon replaces a visible label.',
	],
	whenNotToUse: [
		'A search box — the Search pattern paints its own magnifying glass and matches the header layout.',
		'Fields that need a floating label — use the Animated Label pattern, which already reserves the inner space.',
	],
	anatomy: {
		tree: `<div class="input-with-icon"> <!-- add .input-with-icon-right when AlignIconRight is True -->
  <div class="input-with-icon-content-icon">
    <i class="icon ph ph-envelope"></i> <!-- Icon placeholder -->
  </div>
  <div class="input-with-icon-input">
    <input class="form-control" type="text" data-input /> <!-- Input placeholder -->
  </div>
</div>
<span class="validation-message">…</span> <!-- platform, only when the Input is not valid -->`,
	},
	properties: [
		{
			title: 'Input With Icon',
			rows: [
				{
					name: 'AlignIconRight',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'When True, docks the icon to the end (right in LTR) edge of the input instead of the start edge.',
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
	accessibility: [
		'The icon is decorative: pair the Input with a Label widget (or an aria-label) so the field is announced by name, not by glyph.',
		'The icon slot is positioned over the input and is not focusable, so the Input stays the only tab stop.',
		'Sizes, focus ring and error colours are the Input widget’s own, so contrast and focus visibility match every other field on the screen.',
		'Padding is logical (inline-start / inline-end), so the icon and the text indent mirror correctly in RTL layouts.',
	],
	related: [
		{ name: 'Search', storyId: 'patterns-interaction-search--docs' },
		{ name: 'Animated Label', storyId: 'patterns-interaction-animatedlabel--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
	],
};
