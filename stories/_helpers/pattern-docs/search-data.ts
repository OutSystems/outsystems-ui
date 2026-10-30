import type { PatternDocMeta } from './types';

export const SEARCH_DOC: PatternDocMeta = {
	name: 'Search',
	category: 'Interaction',
	lede: 'A search field with the magnifying-glass icon built in — drop an Input in it and filter a list or screen from the header.',
	overview:
		'The block wraps a single Input placeholder in `.osui-search__input` and paints the icon over the input’s start edge, reserving the padding for it. The runtime registers the instance and applies ExtendedClass; everything else (value, prompt, OnChange) is the Input widget’s.',
	stylingSelector: '.osui-search',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/search/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/search/',
	liveStoryId: 'patterns-interaction-search--basic-usage',
	whenToUse: [
		'Filtering a list, table or gallery by a free-text term as the user types.',
		'A global search in the header of a Reactive or Mobile app — the native layout has dedicated header styles for it.',
		'Any text field where the magnifying glass tells users what the field does without a label.',
	],
	whenNotToUse: [
		'A field with a different purpose and icon (e-mail, phone, amount) — use Input With Icon and pick the glyph.',
		'Picking from a known set of options — use a Dropdown with search enabled instead of a free-text field.',
	],
	anatomy: {
		tree: `<div class="osui-search"> <!-- root, located by name="<id>"; ExtendedClass is added here -->
  <div class="osui-search__input">
    <span class="input-text"> <!-- ODC paints the icon with ::after on this span -->
      <input class="form-control" type="search" data-input /> <!-- Input placeholder -->
    </span>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Search',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Add custom style classes to the pattern root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes (shape-round, full-width, …) are supported.',
				},
			],
		},
	],
	events: [{ name: 'Initialized', description: 'Fires when the Search instance is ready; returns the SearchId.' }],
	apiSections: [
		{
			title: 'Search API',
			rows: [
				{ name: 'Create', description: 'Register a new Search instance.' },
				{ name: 'Initialize', description: 'Build the pattern and apply ExtendedClass to the root.' },
				{ name: 'ChangeProperty', description: 'Update a runtime property (ExtendedClass).' },
				{ name: 'RegisterCallback', description: 'Subscribe to the Initialized callback.' },
				{ name: 'GetSearchById', description: 'Return the instance registered under an id.' },
				{ name: 'Dispose', description: 'Release the instance and its map entry.' },
			],
		},
	],
	accessibility: [
		'Use an Input of type search (or set its aria-label / a hidden Label) so the field is announced as a search box, not a plain text field.',
		'The icon is painted with CSS and never enters the accessibility tree, so the Input remains the single focus stop.',
		'Hover and focus styles come from the Input widget tokens, so the focus ring matches every other field on the screen.',
		'When the search filters a list live, announce the result count in an aria-live region so screen-reader users know the list changed.',
	],
	related: [
		{ name: 'Input With Icon', storyId: 'patterns-interaction-inputwithicon--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
		{ name: 'Animated Label', storyId: 'patterns-interaction-animatedlabel--docs' },
	],
};
