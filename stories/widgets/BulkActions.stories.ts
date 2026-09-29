import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * BulkActions — static markup of the `bulk-actions` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * Row selection inside a `.table`: a checkbox per row and a header checkbox that turns `checkbox-intermediate` when only some rows are selected. Static markup; the toolbar that appears on selection is application-side.
 *
 * CSS contract: src/scss/03-widgets/_bulk-actions.scss.
 */
const meta: Meta = { title: 'Widgets/BulkActions' };
export default meta;
type Story = StoryObj;

export const PartialSelection: Story = {
	render: () =>
		renderStatic(`
			<table class="table">
			<thead>
				<tr>
					<th><div><span><input data-checkbox="" type="checkbox" class="checkbox-intermediate" aria-label="Select all rows" checked=""></span></div></th>
					<th>Order</th>
					<th>Customer</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><div><span><input data-checkbox="" type="checkbox" aria-label="Select row 1" checked=""></span></div></td>
					<td>#10412</td>
					<td>Acme Ltd</td>
				</tr>
				<tr>
					<td><div><span><input data-checkbox="" type="checkbox" aria-label="Select row 2"></span></div></td>
					<td>#10413</td>
					<td>Globex</td>
				</tr>
			</tbody>
			</table>`),
};
