import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Bulk Actions — row selection on the Table Records **widget**, transcribed to static markup.
 *
 * Same method as Widgets/Table and Widgets/Checkbox (see docs-internal/adr/ADR-0009): the platform
 * widget packages are not available to this public repository, so the story renders the DOM the
 * widgets emit. A selection column holds the Checkbox widget DOM (`span > input[data-checkbox]`)
 * in every row and in the header; the header checkbox carries `checkbox-intermediate` while only
 * some rows are selected, and selected rows carry `table-row-selected`.
 *
 * CSS contract: src/scss/03-widgets/_bulk-actions.scss on top of _table.scss and _checkbox.scss.
 * The action toolbar that appears on selection is screen content and is not part of this contract.
 */
const meta: Meta = { title: 'Widgets/BulkActions' };
export default meta;
type Story = StoryObj;

const checkbox = (id: string, label: string, checked = false, intermediate = false) =>
	`<span><input data-checkbox="" class="${intermediate ? 'checkbox-intermediate' : ''}" type="checkbox" id="${id}" aria-label="${label}"${checked ? ' checked=""' : ''}></span>`;

const row = (id: string, order: string, customer: string, selected: boolean) => `
	<tr class="table-row table-row-stripping${selected ? ' table-row-selected' : ''}">
		<td data-header="">${checkbox(id, `Select order ${order}`, selected)}</td>
		<td data-header="Order">${order}</td>
		<td data-header="Customer">${customer}</td>
	</tr>`;

export const PartialSelection: Story = {
	render: () =>
		renderStatic(`
			<table class="table" role="grid" style="width:100%;max-width:560px;">
				<thead>
					<tr class="table-header">
						<th>${checkbox('bulk-all', 'Select all rows', true, true)}</th>
						<th>Order</th>
						<th>Customer</th>
					</tr>
				</thead>
				<tbody>
					${row('bulk-1', '#10412', 'Acme Ltd', true)}
					${row('bulk-2', '#10413', 'Globex', false)}
					${row('bulk-3', '#10414', 'Initech', true)}
				</tbody>
			</table>`),
};

export const AllSelected: Story = {
	render: () =>
		renderStatic(`
			<table class="table" role="grid" style="width:100%;max-width:560px;">
				<thead>
					<tr class="table-header">
						<th>${checkbox('bulk-all-2', 'Select all rows', true)}</th>
						<th>Order</th>
						<th>Customer</th>
					</tr>
				</thead>
				<tbody>
					${row('bulk-4', '#10412', 'Acme Ltd', true)}
					${row('bulk-5', '#10413', 'Globex', true)}
				</tbody>
			</table>`),
};
