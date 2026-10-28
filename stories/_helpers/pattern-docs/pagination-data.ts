import type { PatternDocMeta } from './types';

export const PAGINATION_DOC: PatternDocMeta = {
	name: 'Pagination',
	category: 'Navigation',
	lede: 'Page controls for long lists and tables — a record counter, previous/next arrows and either numbered page buttons or a jump-to-page input.',
	overview:
		'Pagination computes everything from three numbers: StartIndex (the 0-based index of the first record shown), MaxRecords (records per page) and TotalCount. It renders the "1 to 10 of 100 items" counter, the arrows and a sliding window of three numbered pages between the first and last page, collapsing the gaps into ellipses. Every click raises OnNavigate with the NewStartIndex, which you assign back to StartIndex and refresh the data with. With a single page only the counter renders; with TotalCount 0 nothing does.',
	stylingSelector: '.pagination',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/pagination/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/pagination/',
	liveStoryId: 'patterns-navigation-pagination--basic-usage',
	cssApiSlug: 'patterns-navigation-pagination',
	whenToUse: [
		'Tables and lists backed by an aggregate with Max. Records, where users need to know how many records exist and reach a specific page.',
		'Search results and reports where the position inside the set matters more than scrolling.',
		'Long result sets on desktop: the three-page window keeps the control the same width whatever the page count.',
	],
	whenNotToUse: [
		'Feeds that are read top to bottom — use a Scrollable Area or a List with on-scroll loading instead.',
		'Sets that fit on one or two pages — the control collapses to a counter and adds little.',
	],
	anatomy: {
		tree: `<div class="pagination" data-maxrecords="10" data-selectedpage="1" data-totalpages="9">
  <div class="pagination-counter" role="status" aria-live="polite" aria-atomic="true">1 to 10 of 100 items</div>
  <nav class="pagination-container" aria-label="Pagination">
    <button class="pagination-button" aria-label="go to previous page" disabled>
      <div class="pagination-previous"><!-- Previous placeholder (Icon) --></div>
    </button>
    <div class="display-flex"> <!-- ShowGoToPage = False -->
      <button class="pagination-button is--active" aria-current="true">1</button>
      <div class="list list-group" role="group"> <!-- sliding window of up to three pages -->
        <button class="pagination-button" aria-current="false">2</button>
        <!-- … -->
      </div>
      <div class="pagination-button is--ellipsis">...</div>
      <button class="pagination-button" aria-current="false">10</button>
    </div>
    <div class="pagination-input"> <!-- ShowGoToPage = True -->
      <label class="wcag-hide-text" for="<id>">Current page 1 of 10 pages. Insert the page number to go to...</label>
      <input class="form-control" type="number" id="<id>">
      <div class="pagination-counter">of 10 pages</div>
    </div>
    <button class="pagination-button" aria-label="go to next page">
      <div class="pagination-next"><!-- Next placeholder (Icon) --></div>
    </button>
  </nav>
</div>`,
	},
	properties: [
		{
			title: 'Pagination',
			rows: [
				{
					name: 'StartIndex',
					type: 'Integer',
					description:
						'Set the initial index to start pagination — the 0-based index of the first record on the current page. Mandatory; bind it to the aggregate Start Index and update it from OnNavigate.',
				},
				{
					name: 'MaxRecords',
					type: 'Integer',
					description:
						'Number of records per page. Mandatory; use the same value as the aggregate Max. Records.',
				},
				{
					name: 'TotalCount',
					type: 'Long Integer',
					description: 'Total records of the list. Mandatory; typically the aggregate Count.',
				},
				{
					name: 'ShowGoToPage',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'Set to True to show pagination with an input that allows users to jump to a specific page, instead of the numbered page buttons.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Pagination root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{
			name: 'OnNavigate',
			description:
				'Fires when the user picks a page, an arrow or submits the go-to-page input, with NewStartIndex — assign it to StartIndex and refresh the aggregate.',
		},
	],
	accessibility: [
		'The controls sit in a nav landmark labelled "Pagination"; the record counter is a role="status" live region, so page changes are announced without stealing focus.',
		'Every page button is a real button with an aria-label ("go to page 3", "page 10, is last page") and the current page carries aria-current, while the previous/next arrows are disabled at either end instead of hidden.',
		'With ShowGoToPage the number input has a visually hidden label (.wcag-hide-text) that reads the current and total pages.',
		'With .has-accessible-features the buttons draw a focus-visible ring, and under .os-high-contrast the active page keeps a visible border rather than relying on its background tint.',
	],
	related: [
		{ name: 'Table', storyId: 'patterns-content-table--docs' },
		{ name: 'Scrollable Area', storyId: 'patterns-interaction-scrollablearea--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
	],
};
