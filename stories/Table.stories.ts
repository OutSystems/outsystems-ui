import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';

const row = (opts: { selected?: boolean; striped?: boolean }, a: string, b: string, c: string) => `
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
		row({ selected: selectedIndex === i, striped }, a, b, c);

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

const meta: Meta = {
	title: 'Patterns/Content/Table',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const BasicUsage: Story = {
	name: 'Basic usage',
	parameters: { layout: 'padded' },
	render: () => renderStatic(tableMarkup()),
};

export const SelectedRow: Story = {
	name: 'Selected row',
	parameters: { layout: 'padded' },
	render: () => renderStatic(tableMarkup({ selectedIndex: 2 })),
};

export const Stripes: Story = {
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

export const Default: Story = {
	render: () => renderStatic(tableMarkup({ selectedIndex: 2 })),
};
