import type { Meta, StoryObj } from '@storybook/html-vite';
import { Input } from '@outsystems/runtime-widgets-js';
import { createVariable, DataTypes, mountWidget, widgetBaseProps } from '../_helpers/widget';

// InputType is a const enum (erased by esbuild) → use numeric literals. Text = 0.
const meta: Meta = { title: 'Widgets/Input' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountWidget(Input as never, {
			...widgetBaseProps('input'),
			variable: createVariable(DataTypes.DataTypes.Text, ''),
			inputType: 0,
			prompt: 'Enter your name',
			maxLength: 100,
			mandatory: false,
			enabled: true,
			style: 'form-control',
			onChange: () => {},
		}),
};
