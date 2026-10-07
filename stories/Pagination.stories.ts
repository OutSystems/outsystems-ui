import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Pagination — controls mirror the low-code input parameters of the `Pagination`
 * block in the OutSystemsUI library OML.
 *   StartIndex    :: Integer      :: (mandatory) — 0-based index of the first record shown
 *   MaxRecords    :: Integer      :: (mandatory)
 *   TotalCount    :: Long Integer :: (mandatory)
 *   ShowGoToPage  :: Boolean      :: False
 *   ExtendedClass :: Text         :: ""
 *
 * The markup and the page arithmetic are the block's own (OutSystems UI 3.0.0, ODC desktop),
 * so the story renders the DOM an app renders for the same inputs:
 *
 *   .pagination[data-maxrecords][data-selectedpage][data-totalpages]
 *     .pagination-counter.OSInline[role=status]   "1 to 10 of 100 items"
 *     nav.pagination-container[aria-label=Pagination]
 *       button.pagination-button  > .pagination-previous.OSInline > {Previous placeholder}
 *       .display-flex                                   (ShowGoToPage = False)
 *         button.pagination-button  "1"                 first page
 *         .pagination-button.is--ellipsis.OSInline "..."
 *         .list.list-group[data-list][role=group] > button.pagination-button × up to 3
 *         .pagination-button.is--ellipsis.OSInline "..."
 *         button.pagination-button  "N"                 last page (5+ pages)
 *       .pagination-input                               (ShowGoToPage = True)
 *         label.wcag-hide-text + input.form-control[data-input] + .pagination-counter "of N pages"
 *       button.pagination-button  > .pagination-next.OSInline > {Next placeholder}
 *
 * The current page carries `.is--active` and `aria-current="true"`; every other page button
 * carries `aria-current="false"`. With a single page, prev/next and the page buttons are
 * not rendered at all; with TotalCount = 0 nothing is.
 *
 * The Previous / Next placeholders hold an Icon widget in the block template, rendered here
 * as `i.icon.ph.ph-caret-left` / `ph-caret-right`. `.is-rtl .pagination-button .icon`
 * rotates them for RTL.
 *
 * Styling contract: src/scss/04-patterns/04-navigation/_pagination.scss.
 */
type PaginationArgs = {
	startIndex: number;
	maxRecords: number;
	totalCount: number;
	showGoToPage: boolean;
	extendedClass: string;
};

/** Desktop value of the block's MaxPagesToShow local (1 on phone). */
const MAX_PAGES_TO_SHOW = 3;

/**
 * The block's InitPagination arithmetic. `totalPages` is the block's TotalPages variable:
 * the 0-based index of the last page (JsGetTotalPages: TotalCount / MaxRecords, minus one
 * when it divides exactly).
 */
const paginate = (startIndex: number, maxRecords: number, totalCount: number) => {
	const ratio = totalCount / maxRecords;
	const totalPages = ratio === Math.floor(ratio) ? ratio - 1 : Math.floor(ratio);
	const selected = Math.trunc(startIndex / maxRecords + 1);
	const lastPage = totalPages + 1;
	const M = MAX_PAGES_TO_SHOW;

	let pagesToCreate = totalPages;
	if (totalPages === 4) {
		pagesToCreate = 3;
	} else if (totalPages - 2 > M) {
		pagesToCreate = M;
	} else if (totalPages > 3) {
		pagesToCreate = totalPages - 2;
	}

	// The middle window starts after page `firstMiddle`.
	const edgeLimit = totalPages === 3 ? 4 : 3;
	let firstMiddle = totalPages - pagesToCreate;
	if (selected <= edgeLimit) {
		firstMiddle = 1;
	} else if (selected + 1 <= totalPages) {
		firstMiddle = selected - 2;
	}
	const middle = Array.from({ length: Math.max(0, pagesToCreate) }, (_, i) => firstMiddle + i + 1);

	return {
		totalPages,
		selected,
		lastPage,
		middle,
		showFirst: totalPages >= 1,
		showLast: totalPages > 3,
		showLeadingEllipsis: selected > 3 && totalPages >= 5,
		showTrailingEllipsis: totalPages > selected + 1 && totalPages >= 5,
		goToValue: Math.max(1, Math.min(selected, lastPage)),
	};
};

/** A page-number Button widget. */
const pageButton = (page: number, selected: number, label: string): string =>
	`<button data-button="" class="${cls('pagination-button', page === selected && 'is--active')}" type="button" aria-label="${label}" aria-current="${page === selected}"><span data-expression="">${page}</span></button>`;

const ellipsis = (extra?: string): string =>
	`<div data-container="" class="${cls('pagination-button is--ellipsis', extra, 'OSInline')}">...</div>`;

/** The previous/next arrow button; `enabled` false renders it disabled, as the runtime does at either end. */
const arrowButton = (side: 'previous' | 'next', icon: 'left' | 'right', enabled: boolean): string =>
	`<button data-button="" class="pagination-button" type="button" aria-label="go to ${side} page"${enabled ? '' : ' disabled=""'}><div data-container="" class="pagination-${side} OSInline"><i class="icon ph ph-caret-${icon}" aria-hidden="true" data-icon=""></i></div></button>`;

/** The numbered page buttons with their ellipses: first, leading …, the sliding window, trailing …, last. */
const pageNavigation = (p: ReturnType<typeof paginate>): string => {
	const middle = p.middle
		.map((page) => pageButton(page, p.selected, page === p.selected ? `page ${page}` : `go to page ${page}`))
		.join('');
	return `
			<div data-container="" class="display-flex">
				${p.showFirst ? pageButton(1, p.selected, p.selected > 1 ? 'go to page 1' : 'page 1') : ''}
				${p.showLeadingEllipsis ? ellipsis() : ''}
				<div data-list="" data-virtualization-disabled="" data-animation-disabled="" class="list list-group" disable-virtualization="True" role="group">${middle}</div>
				${p.showTrailingEllipsis ? ellipsis('hide-on-service-studio') : ''}
				${p.showLast ? pageButton(p.lastPage, p.selected, `page ${p.lastPage}, is last page`) : ''}
			</div>`;
};

const meta: Meta<PaginationArgs> = {
	title: 'Patterns/Navigation/Pagination',
	tags: ['!ui-pending', 'ui-reviewed'],
	args: {
		startIndex: 0,
		maxRecords: 10,
		totalCount: 100,
		showGoToPage: false,
		extendedClass: '',
	},
	argTypes: {
		startIndex: {
			name: 'StartIndex',
			control: { type: 'number', min: 0, step: 10 },
			description: 'Set the initial index to start pagination (0-based record index).',
		},
		maxRecords: {
			name: 'MaxRecords',
			control: { type: 'number', min: 1, step: 1 },
			description: 'Number of records per page.',
		},
		totalCount: {
			name: 'TotalCount',
			control: { type: 'number', min: 0, step: 10 },
			description: 'Total records of list.',
		},
		showGoToPage: {
			name: 'ShowGoToPage',
			control: 'boolean',
			description: 'Set to true, to show pagination with an input that allows to jump to a specific page.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ startIndex, maxRecords, totalCount, showGoToPage, extendedClass }) => {
		const max = Math.max(1, maxRecords);
		const p = paginate(Math.max(0, startIndex), max, Math.max(0, totalCount));
		const rangeEnd = max + startIndex >= totalCount ? totalCount : max + startIndex;

		const counter = `
			<div data-container="" class="pagination-counter OSInline" role="status" aria-live="polite" aria-atomic="true">
				<span data-expression="" data-testid="Pagination.RecordNumberFrom">${startIndex + 1}</span><span data-trans="6c08ff2e-126f-45fe-9737-83cf5de0970f" data-testid="Pagination.To"> to </span><span data-expression="" data-testid="Pagination.RecordNumberTo">${rangeEnd}</span><span data-trans="f3606a4b-4ae9-4147-bbb5-1f016314d425" data-testid="Pagination.Of.Items"> of </span><span data-expression="" data-testid="Pagination.RecordsNumber">${totalCount}</span><span data-trans="7daeb8e1-4b0e-4831-b7ad-c9895d4f2d60" data-testid="Pagination.Items"> items</span>
			</div>`;

		const hasPages = p.totalPages > 0;
		const prev = hasPages ? arrowButton('previous', 'left', startIndex > 0) : '';
		const next = hasPages ? arrowButton('next', 'right', p.selected < p.totalPages + 1) : '';
		const pageNav = pageNavigation(p);

		const goToPage = `
			<div data-container="" class="pagination-input">
				<label data-label="" class="wcag-hide-text OSFillParent" for="pagination-goto"><span data-expression="">Current page ${p.goToValue} of ${p.lastPage} pages. Insert the page number to go to...</span></label>
				<input data-input="" class="form-control" type="number" value="${p.goToValue}" id="pagination-goto">
				<div data-container="" class="pagination-counter OSInline"><span data-trans="b207f5ee-aead-4d0c-bbbd-2bc9a6361e2c" data-testid="Pagination.Of.Pages">of </span><span data-expression="" data-testid="Pagination.Counter">${p.totalPages + 1}</span><span data-trans="04fc28b2-d8a4-409b-847f-ebf28e962f60" data-testid="Pagination.Pages"> pages</span></div>
			</div>`;

		// TotalCount = 0 hides the whole wrapper (IsVisible = False).
		const body =
			totalCount > 0
				? `<div data-container="" class="${cls('pagination', extendedClass)}" data-maxrecords="${max}" data-selectedpage="${p.selected}" data-totalpages="${p.totalPages}">
						${counter}
						<nav data-advancedhtml="" class="pagination-container" aria-label="Pagination">
							${prev}
							${showGoToPage ? goToPage : pageNav}
							${next}
						</nav>
					</div>`
				: '';

		return renderStatic(`<div data-block="Navigation.Pagination" class="OSBlockWidget">${body}</div>`);
	},
};
export default meta;

type Story = StoryObj<PaginationArgs>;

/** First page of 10 — `‹ 1 2 3 4 … 10 ›`. */
export const Default: Story = {};

/** A page in the middle — both ellipses and the sliding window of three pages. */
export const MiddlePage: Story = {
	args: { startIndex: 40 },
};

/**
 * `ShowGoToPage = True` — the page buttons are replaced by `.pagination-input`: a visually
 * hidden label, the page input (sized to `--osui-pagination-button-size` by
 * `_pagination.scss`) and the "of N pages" counter, all inside `.pagination-input`.
 */
export const ShowGoToPage: Story = {
	args: { showGoToPage: true },
};

/**
 * Everything fits on one page — only the record counter renders, the navigation is empty
 * (the case on a live app with 14 records and MaxRecords = 50).
 */
export const SinglePage: Story = {
	args: { maxRecords: 50, totalCount: 14 },
};
