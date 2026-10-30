import type { PatternDocMeta } from './types';

export const BOTTOM_BAR_DOC: PatternDocMeta = {
	name: 'Bottom Bar',
	category: 'Navigation',
	lede: 'Tab bar pinned to the bottom edge of a mobile screen — three to five icon-and-label items that jump between the main areas of the app.',
	overview:
		'The bar itself is the Bottom placeholder of the native and phone layouts, rendered as the .bottom-bar-wrapper surface and sized by --bottom-bar-size. Each Bottom Bar Item block dropped into it has an Icon and a Text placeholder, shares the width with its siblings and ellipsizes a label that does not fit. The item of the current screen carries the active class, which switches icon and label to the primary colour. No JavaScript runs — the pattern is CSS only.',
	stylingSelector: '.bottom-bar-wrapper',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/bottom_bar_item/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/bottom_bar_item/',
	liveStoryId: 'patterns-navigation-bottombar--basic-usage',
	cssApiSlug: 'patterns-navigation-bottom-bar-item',
	whenToUse: [
		'Mobile apps with three to five top-level destinations that users switch between often.',
		'When the current area must stay visible and reachable with the thumb on every screen.',
		'Native layouts where the header is already busy with screen actions and a hidden menu would bury navigation.',
	],
	whenNotToUse: [
		'More than five destinations or a nested hierarchy — use a Sidebar or Submenu instead.',
		'Desktop and tablet layouts, or actions that belong to one screen — use Tabs or an Overflow Menu.',
	],
	anatomy: {
		tree: `<div class="bottom-bar-wrapper"> <!-- layout Bottom placeholder (native / phone layouts) -->
  <div class="bottom-bar">
    <div class="active"> <!-- Bottom Bar Item root; ExtendedClass lands here -->
      <div class="bottom-bar-item">
        <div class="bottom-bar-item-icon"><!-- Icon placeholder --></div>
        <div class="bottom-bar-item-text"><!-- Text placeholder --></div>
      </div>
    </div>
    <!-- one container per Bottom Bar Item (flex: 1, max-width 150px) -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Bottom Bar Item',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Bottom Bar Item root. Add active on the item of the current screen to highlight it. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'Keep a visible label in the Text placeholder — the Icon placeholder is decorative and gives the item no accessible name on its own.',
		'The block renders a plain container: wrap the item content in a Link widget (or give the item an On Click action) so it is reachable with Tab and activated with Enter. With .has-accessible-features, a focused link item gets a --color-focus-outer ring.',
		'Mark the current screen with the active class and, on a link item, aria-current="page", so the selected tab is announced as well as coloured.',
		'Labels ellipsize at one line and items cap at 150px; keep them to one or two short words so they stay legible, and remember the ellipsis hides text from sighted users only.',
	],
	related: [
		{ name: 'Tabs', storyId: 'patterns-navigation-tabs--docs' },
		{ name: 'Sidebar', storyId: 'patterns-navigation-sidebar--docs' },
		{ name: 'Submenu', storyId: 'patterns-navigation-submenu--docs' },
	],
};
