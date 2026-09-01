import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { renderStatic } from './_helpers/osui';

/** Table — shipped: `table.table` (role=grid) > thead > `tr.table-header` > `th.sortable` (+ `.sortable-icon`); tbody > `tr.table-row` > `td[data-header]`. */
type TableArgs = { extendedClass: string };

const meta: Meta<TableArgs> = {
	title: 'Patterns/Content/Table',
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
};
export default meta;
type Story = StoryObj<TableArgs>;

const row = (selected: boolean, a: string, b: string, c: string) => `
	<tr class="table-row ${selected ? 'table-row-selected' : ''}">
		<td data-header="Name">${a}</td><td data-header="Status">${b}</td><td data-header="Email">${c}</td>
	</tr>`;

export const Default: Story = {
	render: ({ extendedClass }) =>
		renderStatic(`
			<table class="${cls('table', extendedClass)}" role="grid" style="width:100%;max-width:560px;">
				<thead>
					<tr class="table-header">
						<th class="sortable" tabindex="0">Name<div class="sortable-icon"></div></th>
						<th class="sortable" tabindex="0">Status<div class="sortable-icon"></div></th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					${row(false, 'John Doe', 'Active', 'john@example.com')}
					${row(false, 'Jane Smith', 'Inactive', 'jane@example.com')}
					${row(true, 'Bob Johnson', 'Active', 'bob@example.com')}
				</tbody>
			</table>`),
};
