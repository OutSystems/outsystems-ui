import type { PatternDocMeta } from './types';

export const TABLE_DOC: PatternDocMeta = {
	name: 'Table',
	category: 'Content',
	lede: 'Styled data table with sortable headers, row selection, and responsive cell labels.',
	overview:
		'Use Table for structured tabular data. Headers use `.table-header` and `.sortable`; rows use `.table-row` with optional `.table-row-selected` or `.table-row-stripping`. Cells carry `data-header` for stacked mobile layouts.',
	stylingSelector: 'table.table',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/table/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/table/',
	liveStoryId: 'patterns-content-table--basic-usage',
	cssApiSlug: 'widgets-table',
	whenToUse: [
		'Structured datasets users compare column by column.',
		'Admin lists with sortable columns.',
		'Selectable rows for bulk actions.',
	],
	whenNotToUse: ['Simple vertical lists — use List.', 'Complex pivot or spreadsheet editing — use a dedicated grid.'],
	anatomy: {
		tree: `<table class="table" role="grid">
  <thead>
    <tr class="table-header">
      <th class="sortable" tabindex="0">Name<div class="sortable-icon"></div></th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-row table-row-selected">
      <td data-header="Name">Jane Doe</td>
    </tr>
  </tbody>
</table>`,
	},
	properties: [
		{
			title: 'Table',
			rows: [{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the table root.' }],
		},
	],
	accessibility: [
		'Use role="grid" and ensure sortable headers are keyboard operable.',
		'data-header values should match visible column titles for responsive layouts.',
		'Selected rows should be announced or visually distinct beyond colour alone.',
	],
	related: [
		{ name: 'List Item Content', storyId: 'patterns-content-list-item-content--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Pagination', storyId: 'patterns-navigation-pagination--docs' },
	],
};
