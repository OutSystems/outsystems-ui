import type { Meta, StoryObj } from '@storybook/html-vite';
import { Text } from '@outsystems/runtime-widgets-js';
import { mountWidget, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/Text' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountWidget(Text as never, { ...widgetBaseProps('text'), text: 'Plain platform Text widget output.', style: '' }),
};
