import type { Meta, StoryObj } from '@storybook/html-vite';
import { Switch } from '@outsystems/runtime-widgets-js';
import { createVariable, DataTypes, mountWidget, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/Switch' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountWidget(Switch as never, {
			...widgetBaseProps('switch'),
			variable: createVariable(DataTypes.DataTypes.Boolean, true),
			enabled: true,
			style: '',
			onChange: () => {},
		}),
};
