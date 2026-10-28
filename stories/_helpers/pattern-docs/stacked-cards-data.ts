import type { PatternDocMeta } from './types';

export const STACKED_CARDS_DOC: PatternDocMeta = {
	name: 'Stacked Cards',
	category: 'Interaction',
	lede: 'Swipeable deck of cards for one-at-a-time decisions — accept, reject or flag each record with a drag in the matching direction.',
	overview:
		'The Content placeholder holds a List whose items become the cards; the block stacks them, keeps the first as the active card and lets the next ones peek out from the bottom (or top) by ElementsMargin pixels, with a slight rotation when Rotate is True. Dragging the active card past the threshold fires OnLeftSwipe, OnRightSwipe or OnTopSwipe and reveals the next record (OnItemChange); the OverlayLeft / OverlayRight / OverlayTop placeholders are the colour-coded feedback shown during the drag.',
	stylingSelector: '.stackedcards',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/stacked_cards/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/stacked_cards/',
	liveStoryId: 'patterns-interaction-stackedcards--basic-usage',
	cssApiSlug: 'patterns-interaction-stacked-cards',
	whenToUse: [
		'Triage flows on mobile: approve or reject expenses, candidates, or leads one record at a time.',
		'Discovery experiences where each card is a rich preview (image, title, a line of detail).',
		'Short decks — users lose context in a deck of more than a few dozen cards.',
	],
	whenNotToUse: [
		'Browsing many items side by side — use Carousel or Gallery, which keep the neighbours visible.',
		'Desktop-first screens or data that users need to compare and sort — use a Table or List.',
	],
	anatomy: {
		tree: `<div class="stackedcards stackedcards-origin-bottom"> <!-- origin mirrors StackedOptions -->
  <div class="stackedcards-container">
    <div class="list list-group"> <!-- Content placeholder: a List widget -->
      <div> <!-- active card: position relative; the others stack behind it -->
        <div class="card padding-none">
          <img src="…" alt="Aurora Station" />
          <div>Aurora Station</div>
        </div>
        <div class="stackedcards-overlay left"><!-- OverlayLeft placeholder --></div>
        <div class="stackedcards-overlay right"><!-- OverlayRight placeholder --></div>
        <div class="stackedcards-overlay top"><!-- OverlayTop placeholder --></div>
      </div>
      <div> <!-- next card --> </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Stacked Cards',
			rows: [
				{
					name: 'StackedOptions',
					type: 'StackedCardsPosition',
					defaultValue: 'Bottom',
					description: 'Where the back cards peek out from: Bottom, Top, or None to hide them.',
				},
				{
					name: 'Rotate',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'Rotates the active card slightly while it is dragged.',
				},
				{
					name: 'Items',
					type: 'Integer',
					defaultValue: '5',
					description: 'Number of cards visible in the stack when StackedOptions is Bottom or Top.',
				},
				{
					name: 'ElementsMargin',
					type: 'Integer',
					defaultValue: '5',
					description: 'Offset in pixels between consecutive cards when StackedOptions is Bottom or Top.',
				},
				{
					name: 'UseOverlays',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'Shows the OverlayLeft / OverlayRight / OverlayTop placeholders as swipe feedback.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Stacked Cards root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{ name: 'OnItemChange', description: 'Fires when the active card changes (CurrentPosition).' },
		{ name: 'OnLeftSwipe', description: 'Fires when the active card is swiped left (CurrentPosition).' },
		{ name: 'OnRightSwipe', description: 'Fires when the active card is swiped right (CurrentPosition).' },
		{ name: 'OnTopSwipe', description: 'Fires when the active card is swiped up (CurrentPosition).' },
	],
	accessibility: [
		'Swiping is pointer-only: add visible Accept / Reject buttons that trigger the same actions as the swipe events so keyboard and switch users can decide too.',
		'Text selection is disabled inside the stack so a drag does not select the card copy — keep anything users must copy outside the deck.',
		'Give each card image meaningful alt text; the overlays are decorative feedback, so keep their icons aria-hidden.',
		'The overlay colours come from --osui-stacked-cards-overlay-{left,right,top}-background (error, success, info) — pair them with a word or icon so the meaning does not rely on colour alone.',
	],
	related: [
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
		{ name: 'Gallery', storyId: 'patterns-adaptive-gallery--docs' },
	],
};
