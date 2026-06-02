import type { Meta, StoryObj } from '@storybook/html-vite';
import { Dropdown } from '@outsystems/runtime-widgets-js';
import { createVariable, DataTypes, mountWidget, runtimeMock, widgetBaseProps } from '../_helpers/widget';

// DropdownMode const enum → numeric: Text(native) 0, Custom 1.
const OPTIONS = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry' },
];
const meta: Meta = { title: 'Widgets/Dropdown' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => {
		const list = runtimeMock({ length: OPTIONS.length, getItem: (i: number) => OPTIONS[i] });
		return mountWidget(Dropdown as never, {
			...widgetBaseProps('dropdown'),
			variable: createVariable(DataTypes.DataTypes.Text, 'banana'),
			list,
			dropdownMode: 0,
			labels: (item: { label: string }) => item.label,
			values: (item: { value: string }) => item.value,
			emptyValue: '-- Select --',
			mandatory: false,
			enabled: true,
			style: '',
			onChange: () => {},
		});
	},
};
