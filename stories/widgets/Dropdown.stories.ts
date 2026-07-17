import type { Meta, StoryObj } from '@storybook/html-vite';
import { Fragment } from 'react';
import { Dropdown } from '@outsystems/runtime-widgets-js';
import { createVariable, DataTypes, createElement, mountWidget, runtimeMock, widgetBaseProps } from '../_helpers/widget';

// DropdownMode const enum → numeric: Text(native) 0, Custom 1.
const OPTIONS = [
	{ value: 'Apple', label: 'Apple' },
	{ value: 'Banana', label: 'Banana' },
	{ value: 'Cherry', label: 'Cherry' },
];
const meta: Meta = { title: 'Widgets/Dropdown' };
export default meta;
type Story = StoryObj;

// Wrapper component that holds both dropdowns
function DropdownsWrapper(props: any) {
	const list = runtimeMock({ length: OPTIONS.length, getItem: (i: number) => OPTIONS[i] });

	return createElement(Fragment, null,
		// Container
		createElement(
			'div',
			{ style: { display: 'flex', gap: '40px', padding: '20px', position: 'relative' } },
			// Custom column
			createElement(
				'div',
				{ style: { flex: '1', overflow: 'visible', position: 'relative' } },
				createElement('h3', null, 'Custom (Mode 1)'),
				createElement(Dropdown, {
					...widgetBaseProps('dropdown-custom'),
					...props,
					variable: createVariable(DataTypes.DataTypes.Text, 'Banana'),
					list,
					dropdownMode: 1,
					labels: (item: { label: string }) => item.label,
					values: (item: { value: string }) => item.value,
					emptyValue: '-- Select --',
					mandatory: false,
					enabled: true,
					style: '',
					onChange: () => {},
					placeholders: runtimeMock({
						content: runtimeMock({
							render: (widget: any, itemList: any, callback: any) => {
								const items: any[] = [];
								for (let i = 0; i < itemList.length; i++) {
									const item = itemList.getItem(i);
									const label = item.label;
									items.push(callback(label, i));
								}
								return items;
							},
						}),
					}),
				}),
			),
			// Native column
			createElement(
				'div',
				{ style: { flex: '1' } },
				createElement('h3', null, 'Native (Mode 0)'),
				createElement(Dropdown, {
					...widgetBaseProps('dropdown-native'),
					...props,
					variable: createVariable(DataTypes.DataTypes.Text, 'Banana'),
					list,
					dropdownMode: 0,
					labels: (item: { label: string }) => item.label,
					values: (item: { value: string }) => item.value,
					emptyValue: '-- Select --',
					mandatory: false,
					enabled: true,
					style: '',
					onChange: () => {},
					placeholders: null,
				}),
			),
		),
	);
}

export const Default: Story = {
	render: () => mountWidget(DropdownsWrapper as never, {}),
};
