import type { Meta, StoryObj } from '@storybook/html-vite';
import { Checkbox } from '@outsystems/runtime-widgets-js';
import { createVariable, DataTypes, mountWidget, widgetBaseProps } from '../_helpers/widget';

/** SPIKE: the real platform Checkbox widget (React) from @outsystems/runtime-widgets-js. */
const meta: Meta = { title: 'Widgets/Checkbox' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountWidget(Checkbox as never, {
			...widgetBaseProps('checkbox'),
			variable: createVariable(DataTypes.DataTypes.Boolean, true),
			enabled: true,
			style: '',
			onChange: () => {},
		}),
};
