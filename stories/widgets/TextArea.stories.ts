import type { Meta, StoryObj } from '@storybook/html-vite';
import { TextArea } from '@outsystems/runtime-widgets-js';
import { createVariable, DataTypes, mountWidget, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/TextArea' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountWidget(TextArea as never, {
			...widgetBaseProps('textarea'),
			variable: createVariable(DataTypes.DataTypes.Text, ''),
			prompt: 'Write a comment…',
			maxLength: 500,
			textLines: 3,
			mandatory: false,
			enabled: true,
			style: 'form-control',
			onChange: () => {},
		}),
};
