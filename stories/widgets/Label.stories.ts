import type { Meta, StoryObj } from '@storybook/html-vite';
import { Label } from '@outsystems/runtime-widgets-js';
import { createElement, mountTree, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/Label' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountTree(
			createElement(Label as never, { ...widgetBaseProps('label'), targetWidget: 'someInput', mandatory: true, style: '' }, 'Email address')
		),
};
