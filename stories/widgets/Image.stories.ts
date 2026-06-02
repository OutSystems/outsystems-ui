import type { Meta, StoryObj } from '@storybook/html-vite';
import { Image } from '@outsystems/runtime-widgets-js';
import { mountWidget, widgetBaseProps } from '../_helpers/widget';

// Image Type const enum → numeric: Static 0, External 1, Binary 2.
const meta: Meta = { title: 'Widgets/Image' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountWidget(Image as never, {
			...widgetBaseProps('image'),
			type: 1, // External
			url: 'https://outsystemsui.outsystems.com/OutSystemsUIWebsite/img/logo.png',
			image: '',
			defaultImage: null,
			style: '',
		}),
};
