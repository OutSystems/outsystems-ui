import type { PatternDocMeta } from './types';

export const CAROUSEL_DOC: PatternDocMeta = {
	name: 'Carousel',
	category: 'Content',
	lede: 'Swipeable slides with arrows and dots — showcase images, cards, or any content in a compact horizontal strip.',
	overview:
		'Use Carousel when several items share the same visual weight and users should browse them one at a time (or a few per viewport). Slides live inside `.osui-carousel__content`; navigation and autoplay are configured on the block.',
	stylingSelector: '.osui-carousel',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/carousel/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/carousel/',
	liveStoryId: 'patterns-content-carousel--default',
	cssApiSlug: 'patterns-content-carousel',
	whenToUse: [
		'Image galleries or product highlights on a landing section.',
		'Onboarding walkthroughs with a few steps.',
		'Any horizontal set of cards where only one (or a few) should be visible at once.',
	],
	whenNotToUse: [
		'Primary page navigation — use Tabs or a sidebar.',
		'Long lists that users need to scan quickly — use a List or Table.',
	],
	anatomy: {
		tree: `<div class="osui-carousel" name="<id>">
  <div class="osui-carousel__track">
    <div class="osui-carousel__content">
      <!-- Carousel Item widgets / slide content -->
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Carousel',
			rows: [
				{
					name: 'ItemsDesktop',
					type: 'Integer',
					defaultValue: '1',
					description: 'Number of visible slides on desktop.',
				},
				{ name: 'ItemsTablet', type: 'Integer', description: 'Number of visible slides on tablet.' },
				{
					name: 'ItemsPhone',
					type: 'Integer',
					defaultValue: '1',
					description: 'Number of visible slides on phone.',
				},
				{
					name: 'Loop',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'When True, wraps from last slide to first.',
				},
				{
					name: 'Navigation',
					type: 'CarouselNavigation',
					defaultValue: 'Both',
					description: 'Arrows, dots, both, or none.',
				},
				{
					name: 'AutoPlay',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'Automatically advance slides.',
				},
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the Carousel root.' },
			],
		},
	],
	apiSections: [
		{
			title: 'Carousel API',
			rows: [
				{ name: 'Create', description: 'Register a Carousel instance (Splide provider).' },
				{ name: 'Initialize', description: 'Build the carousel and wire slides.' },
				{ name: 'ChangeProperty', description: 'Update a runtime property.' },
				{ name: 'Dispose', description: 'Tear down the instance.' },
			],
		},
	],
	accessibility: [
		'Ensure each slide’s meaningful content is reachable by keyboard when focused.',
		'Navigation arrows and dots should have accessible names.',
		'Autoplay should not be the only way to advance — keep manual controls visible.',
	],
	related: [
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Gallery', storyId: 'patterns-adaptive-gallery--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
	],
};
