import type { Meta, StoryObj } from '@storybook/html-vite';
import { ButtonGroup, ButtonGroupItem } from '@outsystems/runtime-widgets-js';
import { createElement, createVariable, DataTypes, mountTree, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/ButtonGroup' };
export default meta;
type Story = StoryObj;

const item = (value: string, label: string, selected: boolean) =>
	createElement(
		ButtonGroupItem as never,
		{
			...widgetBaseProps('button-group-item'),
			value,
			style: 'button-group-item',
			isSelected: selected,
			enabled: true,
			tabIndex: -1,
			updateValueInParent: () => {},
			getFocusableElementId: () => '',
			key: value,
		},
		label
	);

export const Default: Story = {
	render: () =>
		mountTree(
			createElement(
				ButtonGroup as never,
				{
					...widgetBaseProps('button-group'),
					variable: createVariable(DataTypes.DataTypes.Text, 'week'),
					enabled: true,
					mandatory: false,
					style: 'button-group',
					onChange: () => {},
				},
				[item('day', 'Day', false), item('week', 'Week', true), item('month', 'Month', false)]
			)
		),
};
