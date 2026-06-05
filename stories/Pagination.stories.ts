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
 * `pagination-input` (`.pagination-input`) is the rendered go-to-page container;
 * the page numbers and counter are computed from StartIndex / MaxRecords / TotalCount.
 */
const meta: Meta = { title: 'Patterns/Navigation/Pagination' };
export default meta;

type PaginationArgs = {
	startIndex: number;
	maxRecords: number;
	totalCount: number;
	showGoToPage: boolean;
	extendedClass: string;
};

export const Default: StoryObj<PaginationArgs> = {
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
			description: 'Show an input to jump to a specific page.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ startIndex, maxRecords, totalCount, showGoToPage, extendedClass }) => {
		const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, maxRecords)));
		const currentPage = Math.min(Math.max(1, Math.ceil(startIndex / Math.max(1, maxRecords))), totalPages);
		const rangeStart = (currentPage - 1) * maxRecords + 1;
		const rangeEnd = Math.min(currentPage * maxRecords, totalCount);

		// Build a compact page-button list (prev, up to 5 pages with ellipsis, next)
		const pages: Array<number | '…'> = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push('…');
			for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
			if (currentPage < totalPages - 2) pages.push('…');
			pages.push(totalPages);
		}

		const pageButtons = pages
			.map((p) =>
				p === '…'
					? `<button class="pagination-button is--ellipsis" disabled>…</button>`
					: `<button class="${cls('pagination-button', p === currentPage && 'is--active')}"${p === currentPage ? ' aria-current="page"' : ''}>${p}</button>`
			)
			.join('');

		const goToPage = showGoToPage
			? `<div class="pagination-input"><label>Go to page<input class="form-control" data-input type="number" min="1" max="${totalPages}" value="${currentPage}" style="margin-left:8px;margin-right:8px;width:56px;height:36px;padding:0;text-align:center;"></label></div>`
			: '';

		return renderStatic(`
			<div class="${cls('pagination', extendedClass)}" style="max-width:480px;">
				<div class="pagination-container" style="display:flex;gap:4px;align-items:center;">
					<button class="pagination-button" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
					${pageButtons}
					<button class="pagination-button" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
				</div>
				${goToPage}
				<div class="pagination-counter">Items ${rangeStart}–${rangeEnd} of ${totalCount}</div>
			</div>`);
	},
};
