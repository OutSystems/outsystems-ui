import type { Meta, StoryObj } from '@storybook/html-vite';
import { Popup } from '@outsystems/runtime-widgets-js';
import { createElement, mountTree, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/Popup' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountTree(
			createElement(Popup as never, { ...widgetBaseProps('popup'), showPopup: true, style: '' },
				createElement('div', { style: { padding: '24px', maxWidth: '420px' } }, [
					createElement('h2', { key: 'h', style: { marginTop: 0 } }, 'Confirm action'),
					createElement('p', { key: 'p' }, 'The platform Popup widget renders a centered dialog over a backdrop.'),
				])
			)
		),
};
