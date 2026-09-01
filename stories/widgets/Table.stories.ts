import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Table Records — the OutSystems platform **widget** (`TableRecords` from
 * `@outsystems/runtime-widgets-js`) is an iterator bound to `source: IList`,
 * rendering `headerRow`/`row` placeholder content per record. Mounting it for
 * real would require mocking that list + placeholder plumbing, so — same as
 * List (see Widgets/List) — this is a CSS-only render of the DOM/class
 * contract the widget ships from src/scss/03-widgets/_table.scss:
 *   `table.table[role=grid]` > `thead > tr.table-header > th(.sortable.sorted + .sortable-icon)`;
 *   `tbody > tr.table-row(.table-row-selected|.table-row-stripping) > td[data-header](.table-cell-secondary)`.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Table',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

const row = (name: string, status: string, email: string) => `
	<tr class="table-row table-row-stripping">
		<td data-header="Name">${name}</td>
		<td data-header="Status">${status}</td>
		<td data-header="Email" class="table-cell-secondary">${email}</td>
	</tr>`;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<table class="${cls('table', styleClasses)}" role="grid" style="width:100%;max-width:560px;">
				<thead>
					<tr class="table-header">
						<th class="sortable sorted" tabindex="0">Name<div class="sortable-icon"></div></th>
						<th class="sortable" tabindex="0">Status<div class="sortable-icon"></div></th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					${row('John Doe', 'Active', 'john@example.com')}
					${row('Jane Smith', 'Inactive', 'jane@example.com')}
					${row('Bob Johnson', 'Active', 'bob@example.com')}
					${row('Alice Brown', 'Active', 'alice@example.com')}
					${row('James Sullivan', 'Active', 'james@example.com')}
					${row('William Cullen', 'Active', 'william@example.com')}
					${row('Amanda Lawrence', 'Active', 'amanda@example.com')}
				</tbody>
			</table>`),
};
