import type { PatternDocMeta } from './types';

export const MASTER_DETAIL_DOC: PatternDocMeta = {
	name: 'Master Detail',
	category: 'Adaptive',
	lede: 'Side-by-side list and detail panes that collapse into a slide-in detail on phones — the classic inbox, contacts or records layout.',
	overview:
		'LeftContent holds the list and RightContent the detail of the selected record. On desktop and tablet both panes sit side by side, LeftPercentage deciding the split; on phone the list takes the full width and RightContent slides in over it while OpenedOnPhone is True. The close control on the phone detail raises DetailClose so the screen can reset that variable. The pattern is CSS-driven, with no runtime JavaScript API.',
	stylingSelector: '.split-screen-wrapper',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/adaptive/master_detail/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/adaptive/master_detail/',
	liveStoryId: 'patterns-adaptive-masterdetail--basic-usage',
	cssApiSlug: 'patterns-adaptive-master-detail',
	whenToUse: [
		'Browsing records where the user scans a list and reads one item at a time — mail, tickets, contacts, orders.',
		'Settings or admin screens with a category list on the left and the chosen category’s form on the right.',
		'Any list/detail flow that must stay on one screen on desktop yet feel native on phone.',
	],
	whenNotToUse: [
		'Detail that is short enough to expand inline — use Accordion or List Item Content with an expandable row.',
		'Navigation between independent sections rather than records of one list — use Tabs or a Sidebar.',
	],
	anatomy: {
		tree: `<div class="split-screen-wrapper is--full-height" style="--left-percentage: 50%;"> <!-- pattern root; Height sets --master-detail-height -->
  <div class="split-left">
    <!-- LeftContent placeholder: a List with one list-item per record -->
  </div>
  <div class="split-right open"> <!-- .open while OpenedOnPhone is True (phone only) -->
    <div class="split-right-close"> <!-- phone only: raises DetailClose -->
      <a><i class="icon ph ph-arrow-left"></i></a>
    </div>
    <div class="split-right-content">
      <!-- RightContent placeholder -->
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Master Detail',
			rows: [
				{
					name: 'LeftPercentage',
					type: 'Decimal',
					defaultValue: '50',
					description:
						'Width of LeftContent as a percentage of the pattern; RightContent takes the rest. Ignored on phone, where each pane is full width.',
				},
				{
					name: 'OpenedOnPhone',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'Whether the detail pane is shown on phone. Bind it to a local variable: set it to True when a list item is clicked and back to False on DetailClose.',
				},
				{
					name: 'Height',
					type: 'Text',
					defaultValue: '""',
					description:
						'Custom height in pixels or percentage. Empty uses the window height minus the title and header.',
				},
			],
		},
	],
	events: [
		{
			name: 'DetailClose',
			description: 'Fires after the detail pane is closed on phone — use it to reset the OpenedOnPhone variable.',
		},
	],
	accessibility: [
		'List rows in LeftContent should be real controls (a Link or Button, or a Container with tabindex and a click handler) so the detail can be opened from the keyboard.',
		'Mark the selected row with aria-selected="true" (or the list-item-selected class plus an aria-current) so assistive tech knows which record the detail belongs to.',
		'On phone, move focus into RightContent when OpenedOnPhone becomes True and back to the triggering row on DetailClose; the close control has a visible icon, so give it an accessible name.',
		'The slide-in transition is purely CSS; keep it short and respect prefers-reduced-motion in custom overrides.',
	],
	related: [
		{ name: 'Gallery', storyId: 'patterns-adaptive-gallery--docs' },
		{ name: 'Columns', storyId: 'patterns-adaptive-columns--docs' },
		{ name: 'List Item Content', storyId: 'patterns-content-list-item-content--docs' },
		{ name: 'Sidebar', storyId: 'patterns-navigation-sidebar--docs' },
	],
};
