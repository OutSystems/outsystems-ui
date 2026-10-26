import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

/** Table — shipped: `table.table` (role=grid) > thead > `tr.table-header` > `th.sortable` (+ `.sortable-icon`); tbody > `tr.table-row` > `td[data-header]`. */
const meta: Meta = { title: 'Patterns/Content/Table' };
export default meta;
type Story = StoryObj;

const row = (selected: boolean, a: string, b: string, c: string) => `
	<tr class="table-row ${selected ? 'table-row-selected' : ''}">
		<td data-header="Name">${a}</td><td data-header="Status">${b}</td><td data-header="Email">${c}</td>
	</tr>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<table class="table" role="grid" style="width:100%;max-width:560px;">
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

/** Mini table demonstrating one state in isolation. */
const miniTable = (headerCells: string, bodyRows: string) => `
	<table class="table" role="grid" style="width:360px;">
		<thead><tr class="table-header">${headerCells}</tr></thead>
		<tbody>${bodyRows}</tbody>
	</table>`;

const th = (label: string, sorted = false) =>
	`<th class="sortable ${sorted ? 'sorted' : ''}" tabindex="0">${label}<div class="sortable-icon"></div></th>`;

const miniRow = (name: string, status: string, rowClass = '') =>
	`<tr class="table-row ${rowClass}"><td data-header="Name">${name}</td><td data-header="Status">${status}</td></tr>`;

/**
 * Each row/cell/header state in isolation: `.table-row-selected`,
 * `.table-row-stripping`, `th.sortable.sorted`, `td.table-cell-secondary`.
 */
export const RowStates: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard([
				{
					label: 'table-row-selected',
					html: miniTable(
						`${th('Name')}${th('Status')}`,
						miniRow('John Doe', 'Active') + miniRow('Jane Smith', 'Inactive', 'table-row-selected')
					),
				},
				{
					label: 'table-row-stripping',
					html: miniTable(
						`${th('Name')}${th('Status')}`,
						['John Doe', 'Jane Smith', 'Bob Johnson']
							.map((name, i) => miniRow(name, i % 2 ? 'Inactive' : 'Active', 'table-row-stripping'))
							.join('')
					),
				},
				{
					label: 'sortable sorted',
					html: miniTable(`${th('Name', true)}${th('Status')}`, miniRow('John Doe', 'Active')),
				},
				{
					label: 'table-cell-secondary',
					html: miniTable(
						`${th('Name')}<th>Email</th>`,
						`<tr class="table-row"><td data-header="Name">John Doe</td><td data-header="Email" class="table-cell-secondary">john@example.com</td></tr>`
					),
				},
			]).outerHTML
		),
};
