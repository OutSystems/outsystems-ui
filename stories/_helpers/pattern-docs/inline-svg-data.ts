import type { PatternDocMeta } from './types';

export const INLINE_SVG_DOC: PatternDocMeta = {
	name: 'Inline SVG',
	category: 'Utilities',
	lede: 'Renders raw SVG markup inline in the DOM so its fill, stroke, and paths can be styled with CSS or animated — unlike an image, which is a sealed bitmap.',
	overview:
		'Paste the SVG markup into SVGCode. On Initialize the runtime validates it and injects it inside the .osui-inline-svg root; a ChangeProperty on SVGCode swaps the drawing in place. Invalid markup is discarded with a console error so nothing unsafe reaches the page.',
	stylingSelector: '.osui-inline-svg',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/utilities/inline_svg/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/utilities/inline_svg/',
	liveStoryId: 'patterns-utilities-inlinesvg--basic-usage',
	whenToUse: [
		'Logos and illustrations that must follow the theme colour — write fill="currentColor" and recolour with text-* utility classes or CSS.',
		'Icons that are not in the icon library, or multi-colour artwork a single-glyph Icon widget cannot express.',
		'SVGs you want to animate (stroke-dashoffset, CSS transitions on paths) or whose parts need hover states.',
	],
	whenNotToUse: [
		'Standard single-colour glyphs — the Icon widget already covers them and ships with the icon font.',
		'Photos or large artwork that never changes colour — an Image widget caches better and keeps the DOM small.',
	],
	anatomy: {
		tree: `<div class="osui-inline-svg"> <!-- root; ExtendedClass lands here -->
  <svg viewBox="0 0 24 24" width="64" height="64"> <!-- the SVGCode markup, injected on Initialize -->
    <path fill="currentColor" d="…"/>
  </svg>
</div>`,
	},
	properties: [
		{
			title: 'Inline SVG',
			rows: [
				{
					name: 'SVGCode',
					type: 'Text',
					defaultValue: '""',
					description:
						'SVG markup code, that is going to be appended on the HTML. Must be a valid <svg> element; invalid markup is rejected with a console error.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Inline SVG root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes such as text-primary are supported.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires once the Inline SVG instance is built; receives the InlineSVGId.' },
	],
	apiSections: [
		{
			title: 'Inline SVG API',
			rows: [
				{ name: 'Create', description: 'Register a new Inline SVG instance from its configs JSON.' },
				{ name: 'Initialize', description: 'Validate SVGCode and inject it inside the root element.' },
				{ name: 'ChangeProperty', description: 'Replace SVGCode at runtime; the drawing is re-injected.' },
				{
					name: 'SetAccessibilityProperties',
					description:
						'Mark the SVG as Decorative, Informative (role="img" + label) or Interactive (role="button", focusable + label) via a JSON options string.',
				},
				{ name: 'GetInlineSvgById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllInlineSvgs', description: 'List the ids of every Inline SVG on the page.' },
				{ name: 'RegisterCallback', description: 'Subscribe to the Initialized callback.' },
				{ name: 'Dispose', description: 'Tear down the instance.' },
			],
		},
	],
	accessibility: [
		'The injected <svg> carries no role by default. Call SetAccessibilityProperties(id, \'{"type":"Decorative"}\') for ornamental artwork — it sets aria-hidden="true" so screen readers skip it.',
		'For meaningful graphics use type Informative with a label: the runtime sets role="img" and aria-label on the <svg> so the picture is announced.',
		'For clickable artwork use type Interactive: role="button", tabindex="0" and the label make it reachable by keyboard — still wire the click handler yourself.',
		'Keep contrast in mind when recolouring with currentColor: a fill that follows text-neutral-* on a dark surface may drop below 3:1 for graphical objects.',
	],
	related: [
		{ name: 'Icon Badge', storyId: 'patterns-numbers-iconbadge--docs' },
		{ name: 'Button Loading', storyId: 'patterns-utilities-buttonloading--docs' },
		{ name: 'Lightbox Image', storyId: 'patterns-interaction-lightboximage--docs' },
	],
};
