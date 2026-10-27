import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

/** Table — shipped: `table.table` (role=grid) > thead > `tr.table-header` > `th.sortable` (+ `.sortable-icon`); tbody > `tr.table-row` > `td[data-header]`. */
const meta: Meta = { title: 'Patterns/Content/Table' };
export default meta;
type Story = StoryObj;

/**
 * Table is the platform widget styled by OUI, not an OutSystemsUI block — it has no
 * low-code input parameters of its own, so the playground carries no controls.
 */
const row = (selected: boolean, a: string, b: string, c: string) => `
	<tr class="table-row ${selected ? 'table-row-selected' : ''}">
		<td data-header="Name">${a}</td><td data-header="Status">${b}</td><td data-header="Email">${c}</td>
	</tr>`;

export const Playground: Story = {
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

// ─── Docs-page stories ────────────────────────────────────────────────────────

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';

const rowDoc = (opts: { selected?: boolean; striped?: boolean }, a: string, b: string, c: string) => `
	<tr class="table-row${opts.selected ? ' table-row-selected' : ''}${opts.striped ? ' table-row-stripping' : ''}">
		<td data-header="Name">${a}</td><td data-header="Status">${b}</td><td data-header="Email">${c}</td>
	</tr>`;

function tableMarkup({
	selectedIndex = null,
	striped = false,
}: {
	selectedIndex?: number | null;
	striped?: boolean;
} = {}): string {
	const r = (i: number, a: string, b: string, c: string) =>
		rowDoc({ selected: selectedIndex === i, striped }, a, b, c);

	const rows = striped
		? `${r(0, 'John Doe', 'Active', 'john@example.com')}
			${r(1, 'Jane Smith', 'Inactive', 'jane@example.com')}
			${r(2, 'Bob Johnson', 'Active', 'bob@example.com')}
			${r(3, 'Alice Brown', 'Active', 'alice@example.com')}
			${r(4, 'James Sullivan', 'Active', 'james@example.com')}`
		: `${r(0, 'John Doe', 'Active', 'john@example.com')}
			${r(1, 'Jane Smith', 'Inactive', 'jane@example.com')}
			${r(2, 'Bob Johnson', 'Active', 'bob@example.com')}`;

	return `<div style="${DEMO_WRAP}"><table class="table" role="grid" style="width:100%;max-width:560px;">
		<thead>
			<tr class="table-header">
				<th class="sortable" tabindex="0">Name<div class="sortable-icon"></div></th>
				<th class="sortable" tabindex="0">Status<div class="sortable-icon"></div></th>
				<th>Email</th>
			</tr>
		</thead>
		<tbody>
			${rows}
		</tbody>
	</table></div>`;
}

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: { layout: 'padded' },
	render: () => renderStatic(tableMarkup()),
};

export const SelectedRow: Story = {
	tags: ['docs-example'],
	name: 'Selected row',
	parameters: { layout: 'padded' },
	render: () => renderStatic(tableMarkup({ selectedIndex: 2 })),
};

export const Stripes: Story = {
	tags: ['docs-example'],
	name: 'Stripes',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Rows use table-row-stripping so even rows pick up the stripe background.',
			},
		},
	},
	render: () => renderStatic(tableMarkup({ striped: true })),
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
