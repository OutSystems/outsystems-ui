import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const LIGHTBOX_IMAGE_DOC: PatternDocMeta = {
	name: 'Lightbox Image',
	category: 'Interaction',
	lede: 'Thumbnail that opens the full-size photo in a dark, zoomable viewer — and, grouped with its siblings, becomes a swipeable gallery.',
	overview:
		'Each block wraps one Thumbnail placeholder (an Image widget, or the ImageURL parameter) in a link. Clicking it opens the PhotoSwipe viewer the platform ships, sized from the thumbnail by ImageZoom, with Title as the caption; blocks that share a Group open in one gallery with prev/next arrows and a counter. The viewer itself is hosted by the Lightbox block from the Utilities folder, which must be on the screen once.',
	stylingSelector: '.lightbox-item',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/lightbox_image/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/lightbox_image/',
	liveStoryId: 'patterns-interaction-lightboximage--basic-usage',
	cssApiSlug: 'patterns-interaction-lightbox-image',
	whenToUse: [
		'Product or property photos where users want to inspect detail at full size.',
		'Photo sets (a trip, an inspection, an incident report) that should be browsed one at a time without leaving the screen.',
		'Attachments previews in a record detail, where a thumbnail is enough until it is clicked.',
	],
	whenNotToUse: [
		'Images that are content in their own right and should be visible inline — use Carousel or Gallery.',
		'Non-image attachments (PDF, video) — use a download link or the Video pattern.',
	],
	anatomy: {
		tree: `<div class="lightbox-item">
  <a href="<full-size image>"> <!-- the block builds the link; Group joins blocks into one gallery -->
    <!-- Thumbnail placeholder --> <img src="…" alt="Aurora over the fjord" />
  </a>
</div>
<!-- rendered once by the Utilities\\Lightbox block, outside the images: -->
<div class="pswp" role="dialog" aria-hidden="true">
  <div class="pswp__bg"></div>
  <div class="pswp__scroll-wrap">
    <div class="pswp__container"> … </div>
    <div class="pswp__ui">
      <div class="pswp__top-bar"> <!-- counter, zoom, close --> </div>
      <button class="pswp__button pswp__button--arrow--left"></button>
      <button class="pswp__button pswp__button--arrow--right"></button>
      <div class="pswp__caption"> <!-- Title --> </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Lightbox Image',
			rows: [
				{
					name: 'Title',
					type: 'Text',
					defaultValue: '""',
					description: 'Caption shown under the full-size image.',
				},
				{
					name: 'Group',
					type: 'Text',
					defaultValue: '""',
					description: 'Blocks with the same Group open in one gallery with prev/next navigation.',
				},
				{
					name: 'ImageURL',
					type: 'Text',
					defaultValue: '""',
					description:
						'URL of the image to open, replacing the Thumbnail image. For a binary image use the BinaryToURLImage actions from the Utilities folder.',
				},
				{
					name: 'ImageZoom',
					type: 'Decimal',
					defaultValue: '2',
					description:
						'Size of the full-screen image relative to the thumbnail: a 100x100 thumbnail with zoom 2 opens at 200x200. Keep the same ratio to avoid distortion.',
				},
				{
					name: 'OptionalConfigs',
					type: 'LightboxImageOptionalConfigs',
					description: 'Extra configurations for the viewer.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Lightbox Image root. Use disable-url to turn off the ImageURL feature. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description:
				'Fires once, from the first Lightbox instance on the screen, with the viewer object (LightboxObj) whose updateCloseBtnAriaLabel / updatePrevBtnAriaLabel / updateNextBtnAriaLabel methods relabel the controls for every instance.',
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The viewer is a dialog: ',
			React.createElement(PdKey, null, 'Esc'),
			' closes it and ',
			React.createElement(PdKey, null, '←'),
			' / ',
			React.createElement(PdKey, null, '→'),
			' move through the group.'
		),
		'The thumbnail is a link, so it is in the Tab order; under .has-accessible-features the whole .lightbox-item shows a focus ring while the link is focused.',
		'Give the Thumbnail image alt text that describes the photo — the Title caption is only shown once the viewer is open.',
		'Use the LightboxObj from Initialized to translate the close, previous and next button labels for localised apps.',
	],
	related: [
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
		{ name: 'Gallery', storyId: 'patterns-adaptive-gallery--docs' },
		{ name: 'Video', storyId: 'patterns-utilities-video--docs' },
	],
};
