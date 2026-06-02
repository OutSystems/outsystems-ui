import type { Meta, StoryObj } from '@storybook/html-vite';
import { Upload } from '@outsystems/runtime-widgets-js';
import { createVariable, DataTypes, mountWidget, widgetBaseProps } from '../_helpers/widget';

// Accept const enum → numeric: Image 0, Video 1, Any 2.
const meta: Meta = { title: 'Widgets/Upload' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountWidget(Upload as never, {
			...widgetBaseProps('upload'),
			fileContent: createVariable(DataTypes.DataTypes.BinaryData, new DataTypes.BinaryData()),
			fileName: createVariable(DataTypes.DataTypes.Text, ''),
			accept: 0,
			mandatory: false,
			enabled: true,
			style: '',
			onChange: () => {},
		}),
};
