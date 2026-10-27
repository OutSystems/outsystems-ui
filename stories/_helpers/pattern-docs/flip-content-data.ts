import type { PatternDocMeta } from './types';

export const FLIP_CONTENT_DOC: PatternDocMeta = {
	name: 'Flip Content',
	category: 'Content',
	lede: 'Two-sided card that flips on interaction — reveal detail or an alternate view without leaving the page.',
	overview:
		'Use Flip Content when a compact tile should toggle between a front and back face. FlipSelf lets users click to flip; IsFlipped sets the initial face.',
	stylingSelector: '.osui-flip-content',
	odcUrl:
		'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/flip_content/',
	o11Url:
		'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/flip_content/',
	liveStoryId: 'patterns-content-flipcontent--basic-usage',
	whenToUse: [
		'Product tiles that reveal specs on the back.',
		'Flashcards or quiz items.',
		'Any compact control where two states share the same footprint.',
	],
	whenNotToUse: [
		'More than two faces — build a custom flow.',
		'Primary navigation between screens.',
	],
	anatomy: {
		tree: `<div class="osui-flip-content" name="<id>">
  <div class="osui-flip-content__container">
    <div class="osui-flip-content__container__front">
      <!-- Colored container on the front face -->
    </div>
    <div class="osui-flip-content__container__back">
      <!-- Colored container on the back face -->
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Flip Content',
			rows: [
				{ name: 'FlipSelf', type: 'Boolean', defaultValue: 'True', description: 'When True, clicking the card toggles the flip.' },
				{ name: 'IsFlipped', type: 'Boolean', defaultValue: 'False', description: 'When True, renders the back face initially.' },
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	apiSections: [
		{
			title: 'Flip Content API',
			rows: [
				{ name: 'Create', description: 'Register a Flip Content instance.' },
				{ name: 'Initialize', description: 'Build flip behaviour and event handlers.' },
				{ name: 'Flip', description: 'Programmatically toggle the face.' },
				{ name: 'Dispose', description: 'Tear down the instance.' },
			],
		},
	],
	accessibility: [
		'Both faces should remain readable — avoid essential information only on the hidden face.',
		'If FlipSelf is True, ensure keyboard users can trigger the flip.',
		'Use the Storybook A11y toolbar to check focus when the card flips.',
	],
	related: [
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
	],
};
