import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const RATING_DOC: PatternDocMeta = {
	name: 'Rating',
	category: 'Numbers',
	lede: 'Star (or any icon) scale that shows or collects a score — product reviews, feedback forms, read-only averages.',
	overview:
		'The runtime builds one radio input per RatingScale item inside a fieldset and clones the three state templates from the FilledState, HalfState and EmptyState placeholders into every item; CSS reveals the right state for the current value, including a half item for fractional values. With IsEdit False the control is read-only (pointer events off, arrow keys blocked); with IsEdit True a click or keyboard selection updates RatingValue and fires OnSelect.',
	stylingSelector: '.rating',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/numbers/rating/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/numbers/rating/',
	liveStoryId: 'patterns-numbers-rating--basic-usage',
	cssApiSlug: 'patterns-numbers-rating',
	whenToUse: [
		'Collecting a 1–5 (or 1–N) score in a review or feedback form, with IsEdit True.',
		'Showing an average rating next to a product, a course or a vendor, with IsEdit False.',
		'Any icon-based scale — swap the state placeholders for hearts, thumbs or custom images.',
	],
	whenNotToUse: [
		'Numeric input on a continuous range — use Range Slider.',
		'Binary feedback (like / dislike) — a toggle button is clearer than a one-item scale.',
	],
	anatomy: {
		tree: `<div class="rating rating-medium is-edit is-half"> <!-- Size → .rating-small | .rating-medium; IsEdit → .is-edit -->
  <div class="icon-states"> <!-- state templates, cloned into every item at build time -->
    <div class="rating-item-filled"><i class="icon ph-fill ph-star"></i></div> <!-- FilledState placeholder -->
    <div class="rating-item-half"><i class="icon ph ph-star-half"></i></div> <!-- HalfState placeholder -->
    <div class="rating-item-empty"><i class="icon ph ph-star"></i></div> <!-- EmptyState placeholder -->
  </div>
  <fieldset> <!-- generated: item 0 is the hidden "no rating" input -->
    <input type="radio" class="rating-input wcag-hide-text" id="<id>-rating-1" name="<id>" value="1">
    <label class="rating-item" for="<id>-rating-1">
      <span class="wcag-hide-text">Rating 1</span>
      <div class="rating-item-filled">…</div>
      <div class="rating-item-half">…</div>
      <div class="rating-item-empty">…</div>
    </label>
    <!-- … one input + label per item, up to RatingScale -->
  </fieldset>
</div>`,
	},
	properties: [
		{
			title: 'Rating',
			rows: [
				{
					name: 'RatingValue',
					type: 'Decimal',
					description:
						'Rating number to be displayed. A fractional part from 0.3 to 0.7 renders a half-filled item; below rounds down, above rounds up. Required.',
				},
				{
					name: 'RatingScale',
					type: 'Integer',
					defaultValue: '5',
					description:
						'Number of items to display, up to 100. A scale of 1 behaves as view-only, with IsEdit forced to False.',
				},
				{
					name: 'IsEdit',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'Set to True to let users change the rating; False renders it read-only.',
				},
				{
					name: 'Size',
					type: 'Size',
					defaultValue: 'NullIdentifier()',
					description:
						'Sets the size of the items: Small (12px) or Medium (24px) as `.rating-small` / `.rating-medium`; leave empty for the default 16px.',
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
	],
	events: [
		{ name: 'Initialized', description: 'Fires after the Rating instance is ready; returns the RatingId.' },
		{
			name: 'OnSelect',
			description:
				'Fires when the user picks a new score (IsEdit True); returns the RatingId and the selected Value.',
		},
	],
	apiSections: [
		{
			title: 'Rating API',
			rows: [
				{ name: 'Create', description: 'Register a new Rating instance.' },
				{ name: 'Initialize', description: 'Build the items from RatingScale and apply the current value.' },
				{ name: 'Enable / Disable', description: 'Toggle the disabled state of the fieldset at runtime.' },
				{
					name: 'ChangeProperty',
					description: 'Update a runtime property (RatingValue, RatingScale, IsEdit, Size).',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to the OnSelected callback (the OnSelect event).' },
				{ name: 'GetRatingById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllRatings', description: 'List the ids of every Rating instance.' },
				{ name: 'Dispose', description: 'Tear down the instance and release handlers.' },
			],
		},
	],
	accessibility: [
		'Each item is a native radio input with a visually hidden "Rating N" label (`wcag-hide-text`), so screen readers announce the scale as a radio group and the chosen value as checked.',
		React.createElement(
			React.Fragment,
			null,
			'Editable ratings are keyboard operable: ',
			React.createElement(PdKey, null, 'Tab'),
			' reaches the group, ',
			React.createElement(PdKey, null, '←'),
			' / ',
			React.createElement(PdKey, null, '→'),
			' move between items and ',
			React.createElement(PdKey, { wide: true, children: 'Space' }),
			' selects, as for any radio group.'
		),
		'Read-only (IsEdit False) and disabled instances keep the value readable but block pointer events and the arrow keys, so a keyboard user cannot change the score by accident.',
		'Filled, empty and disabled colours come from `--osui-rating-filled-color`, `--osui-rating-empty-color` and `--osui-rating-disabled-*`; check their contrast against your theme background when you override them.',
	],
	related: [
		{ name: 'Range Slider', storyId: 'patterns-interaction-rangeslider--docs' },
		{ name: 'Progress Bar', storyId: 'patterns-numbers-progress-bar--docs' },
		{ name: 'Badge', storyId: 'patterns-numbers-badge--docs' },
	],
};
