import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Bulk Actions — row selection on the Table Records **widget**, as the "Bulk actions with filters"
 * screen template renders it (OutSystems UI 3.0.0, ODC).
 *
 * Same method as Widgets/Table and Widgets/Checkbox (see docs-internal/adr/ADR-0009): the platform
 * widget packages are not available to this public repository, so the story renders the DOM the
 * widgets emit, transcribed from a live app:
 *
 *   table.table[role=grid]
 *     thead > tr.table-header
 *       th > span > input.checkbox[data-checkbox][title="Select All"]
 *       th.sortable[tabindex=0] "Name" > .sortable-icon          (one per sortable column)
 *     tbody > tr.table-row(.table-row-selected)
 *       td[data-header=""] > span > input.checkbox[data-checkbox][title="Select item"]
 *       td[data-header="Name"] > AlignCenter block > img.border-radius-soft + name
 *
 * Selection is live: tick rows and the header follows the screen's logic —
 *   • some rows selected → the header checkbox gets `.checkbox-intermediate` and stays
 *     **unchecked** (the dash is drawn by `.checkbox-intermediate:before/:after`, not by `:checked`);
 *   • every row selected → the header is `checked`, without `.checkbox-intermediate`;
 *   • clicking the header selects every row when none is selected, and clears them otherwise;
 *   • each selected row carries `.table-row-selected`.
 *
 * CSS contract: src/scss/03-widgets/_bulk-actions.scss on top of _table.scss and _checkbox.scss.
 * The search / filter bar and the pagination of the screen have stories of their own.
 */
type Product = { name: string; category: string; price: string; maxStock: number; threshold: string };

const PRODUCTS: Product[] = [
	{ name: 'Black and grey headphones', category: 'Headphones', price: '$99.90', maxStock: 250, threshold: '50%' },
	{ name: 'Black and grey laptop', category: 'Laptops', price: '$1,499.24', maxStock: 200, threshold: '10%' },
	{ name: 'Black and grey pro laptop', category: 'Laptops', price: '$1,433.95', maxStock: 458, threshold: '10%' },
	{ name: 'Black and silver headphones', category: 'Headphones', price: '$150.99', maxStock: 500, threshold: '100%' },
	{
		name: 'Smartwatch with black strap',
		category: 'Smartwatches',
		price: '$249.00',
		maxStock: 120,
		threshold: '25%',
	},
];

/** Neutral product thumbnail — the screen's images are app resources, unavailable here. */
const THUMB =
	'data:image/svg+xml,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><rect width="42" height="42" fill="#d9dde3"/><rect x="11" y="13" width="20" height="14" rx="2" fill="#8a929c"/><rect x="8" y="28" width="26" height="2" rx="1" fill="#8a929c"/></svg>'
	);

const checkbox = (id: string, title: string, checked: boolean, intermediate = false): string =>
	`<span><input data-checkbox="" class="checkbox${intermediate ? ' checkbox-intermediate' : ''}" type="checkbox" title="${title}" id="${id}"${checked ? ' checked=""' : ''}></span>`;

const sortableTh = (label: string, alignRight = false): string =>
	`<th class="sortable" tabindex="0"${alignRight ? ' style="text-align: right;"' : ''}>${label}<div class="sortable-icon"></div></th>`;

const row = (p: Product, i: number, selected: boolean): string => `
	<tr class="table-row${selected ? ' table-row-selected' : ''}">
		<td data-header="">${checkbox(`bulk-row-${i}`, 'Select item', selected)}</td>
		<td data-header="Name">
			<div data-block="Utilities.AlignCenter" class="OSBlockWidget">
				<div class="vertical-align flex-direction-row">
					<img data-image="" class="border-radius-soft margin-right-base" alt="${p.name}" src="${THUMB}" style="width: 42px; height: 42px;"><span data-expression="">${p.name}</span>
				</div>
			</div>
		</td>
		<td data-header="Category"><span data-expression="">${p.category}</span></td>
		<td data-header="Price"><div data-container="" style="text-align: right;"><span data-expression="">${p.price}</span></div></td>
		<td data-header="Max Stock"><div data-container="" style="text-align: right;"><span data-expression="">${p.maxStock}</span></div></td>
		<td data-header="Stock Threshold" style="text-align: right;"><span data-expression="">${p.threshold}</span></td>
	</tr>`;

/** Header state the screen derives from the row selection. */
const headerState = (selected: boolean[]) => {
	const count = selected.filter(Boolean).length;
	return { all: count > 0 && count === selected.length, some: count > 0 && count < selected.length };
};

const table = (selected: boolean[]): string => {
	const { all, some } = headerState(selected);
	return `
		<table class="table margin-top-base" role="grid">
			<thead>
				<tr class="table-header">
					<th class="">${checkbox('bulk-select-all', 'Select All', all, some)}</th>
					${sortableTh('Name')}
					${sortableTh('Category')}
					${sortableTh('Price', true)}
					${sortableTh('Max Stock', true)}
					${sortableTh('Stock Threshold', true)}
				</tr>
			</thead>
			<tbody>
				${PRODUCTS.map((p, i) => row(p, i, selected[i])).join('')}
			</tbody>
		</table>`;
};

/** Keep the DOM in step with `selected`, exactly as the screen's OnChange handlers do. */
const sync = (root: HTMLElement, selected: boolean[]): void => {
	const { all, some } = headerState(selected);
	const header = root.querySelector<HTMLInputElement>('#bulk-select-all');
	header.checked = all;
	header.classList.toggle('checkbox-intermediate', some);
	root.querySelectorAll<HTMLTableRowElement>('tbody tr').forEach((tr, i) => {
		tr.classList.toggle('table-row-selected', selected[i]);
		tr.querySelector<HTMLInputElement>('input[data-checkbox]').checked = selected[i];
	});
};

const render = (initial: boolean[]): HTMLElement => {
	const selected = [...initial];
	const root = renderStatic(table(selected));
	root.addEventListener('change', (e) => {
		const input = e.target as HTMLInputElement;
		if (input.id === 'bulk-select-all') {
			// None selected → select all; some or all selected → clear.
			const selectAll = !selected.some(Boolean);
			selected.fill(selectAll);
		} else {
			const index = Number(input.id.replace('bulk-row-', ''));
			selected[index] = input.checked;
		}
		sync(root, selected);
	});
	return root;
};

const meta: Meta = { title: 'Widgets/BulkActions' };
export default meta;
type Story = StoryObj;

/** Two rows selected — the header shows the indeterminate dash and stays unchecked. */
export const PartialSelection: Story = {
	render: () => render([true, false, true, false, false]),
};

export const AllSelected: Story = {
	render: () => render(PRODUCTS.map(() => true)),
};

export const NoneSelected: Story = {
	render: () => render(PRODUCTS.map(() => false)),
};
