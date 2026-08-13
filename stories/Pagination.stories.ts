import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Pagination — controls mirror the low-code input parameters of the `Pagination`
 * block in the OutSystemsUI library OML.
 *   StartIndex   :: Integer :: 1
 *   MaxRecords   :: Integer :: 10
 *   TotalCount   :: Integer :: 100
 *   ShowGoToPage :: Boolean :: False
 *   ExtendedClass :: Text :: ""
 *
 * Class/style mappings come from src/scss/04-patterns/04-navigation/_pagination.scss.
 * The page numbers and counter are computed from StartIndex / MaxRecords / TotalCount.
 *
 * `ShowGoToPage` switches between two **mutually exclusive** navigations — the go-to-page
 * input replaces the page-number buttons, it is not added alongside them. The record-range
 * counter ("1 to 3 of 55 items") stays put on the left in both modes; go-to-page mode adds
 * a *second* `.pagination-counter` inside `.pagination-container` holding the page-count
 * label ("of 19 pages"). The original pattern SCSS (commit cb33221e9) nested
 * `.pagination-input` + `.pagination-counter` inside `.pagination-container` under the
 * comment "With ShowGoToPage parameter, this container is in this context".
 *
 * The prev/next buttons stay the first and last children of `.pagination-container` in both
 * modes. They hold an **Icon widget placeholder** in the low-code block, so the story renders
 * a real icon element (`i.icon.ph.ph-caret-left` / `ph-caret-right`) inside each button —
 * `_pagination.scss` no longer draws the chevrons with `::before` (commit 39b522d75).
 * `.is-rtl .pagination-button .icon` rotates them 180° for RTL.
 */
type PaginationArgs = {
	startIndex: number;
	maxRecords: number;
	totalCount: number;
	showGoToPage: boolean;
	extendedClass: string;
};

const meta: Meta<PaginationArgs> = {
	title: 'Patterns/Navigation/Pagination',
	tags: ['!ui-pending', 'ui-reviewed'],
	args: {
		startIndex: 1,
		maxRecords: 10,
		totalCount: 100,
		showGoToPage: false,
		extendedClass: '',
	},
	argTypes: {
		startIndex: {
			name: 'StartIndex',
			control: { type: 'number', min: 1, step: 1 },
			description: 'Initial index to start pagination.',
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
			description:
				'Replace the page-number buttons with an input to jump straight to a page, followed by an "of N pages" label. The record-range counter on the left is unaffected.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ startIndex, maxRecords, totalCount, showGoToPage, extendedClass }) => {
		const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, maxRecords)));
		const currentPage = Math.min(Math.max(1, Math.ceil(startIndex / Math.max(1, maxRecords))), totalPages);
		const rangeStart = (currentPage - 1) * maxRecords + 1;
		const rangeEnd = Math.min(currentPage * maxRecords, totalCount);

		const counter = `<div class="pagination-counter">${rangeStart} to ${rangeEnd} of ${totalCount} items</div>`;
		// Prev/next hold Icon widget placeholders in the low-code block — rendered here as the
		// same `i.icon.ph.*` markup the Icon widget outputs, so the chevrons come from the
		// icon font rather than from CSS.
		const prev = `<button class="pagination-button" aria-label="Previous page"${currentPage === 1 ? ' disabled' : ''}><i class="icon ph ph-caret-left"></i></button>`;
		const next = `<button class="pagination-button" aria-label="Next page"${currentPage === totalPages ? ' disabled' : ''}><i class="icon ph ph-caret-right"></i></button>`;

		// Build a compact page-button list (up to 5 pages with ellipsis). Only used when
		// ShowGoToPage is False — the input replaces this whole list.
		const pageButtons = (): string => {
			const pages: Array<number | '…'> = [];
			if (totalPages <= 5) {
				for (let i = 1; i <= totalPages; i++) pages.push(i);
			} else {
				pages.push(1);
				if (currentPage > 3) pages.push('…');
				for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++)
					pages.push(i);
				if (currentPage < totalPages - 2) pages.push('…');
				pages.push(totalPages);
			}
			return pages
				.map((p) =>
					p === '…'
						? `<button class="pagination-button is--ellipsis" disabled>…</button>`
						: `<button class="${cls('pagination-button', p === currentPage && 'is--active')}"${p === currentPage ? ' aria-current="page"' : ''}>${p}</button>`
				)
				.join('');
		};

		// Layout is entirely from the shipped CSS (_pagination.scss):
		//  • .pagination is flex/space-between → the range counter (first child) sits left
		//    and .pagination-container (last child) right, in both modes.
		//  • prev/next are the first/last .pagination-button of .pagination-container; they are
		//    icon-only, the chevron coming from the Icon widget placeholder inside the button.
		//  • .pagination-button has its own margin-left spacing — no inline gap needed.
		//  • .pagination .form-control[data-input] carries margin on BOTH sides: the gap from
		//    the prev arrow and the gap to the "of N pages" label.
		const nav = showGoToPage
			? // Go-to-page mode: prev, input, page-count label, next.
				`${prev}
				<div class="pagination-input">
					<input class="form-control" data-input type="number" min="1" max="${totalPages}" value="${currentPage}" aria-label="Go to page">
				</div>
				<div class="pagination-counter">of ${totalPages} pages</div>
				${next}`
			: // Button mode: prev, page numbers, next.
				`${prev}
				${pageButtons()}
				${next}`;

		return renderStatic(`
			<div class="${cls('pagination', extendedClass)}">
				${counter}
				<div class="pagination-container">${nav}</div>
			</div>`);
	},
};
export default meta;

type Story = StoryObj<PaginationArgs>;

export const Default: Story = {};

/**
 * `ShowGoToPage = True` — renders `1 to 10 of 100 items … ‹ [1] of 10 pages ›`.
 *
 * The go-to-page input **replaces** the page-number buttons inside
 * `.pagination-container`, which becomes: prev arrow, `.pagination-input`, an
 * "of N pages" `.pagination-counter`, next arrow. The record-range counter keeps its
 * place as the first child of `.pagination`.
 *
 * The input is a standard OUI form control (`.form-control[data-input]`), which
 * `_pagination.scss` re-sizes to the `--osui-pagination-button-size` square so it lines up
 * with the arrows.
 */
export const ShowGoToPage: Story = {
	args: { showGoToPage: true },
};
