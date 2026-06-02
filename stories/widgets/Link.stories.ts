import type { Meta, StoryObj } from '@storybook/html-vite';
import { Link } from '@outsystems/runtime-widgets-js';
import { MemoryRouter } from 'react-router-dom';
import { createElement, mountTree, widgetBaseProps } from '../_helpers/widget';

// Link uses react-router internally → wrap in a MemoryRouter.
const meta: Meta = { title: 'Widgets/Link' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountTree(
			createElement(MemoryRouter as never, null, createElement(Link as never, { ...widgetBaseProps('link'), url: '/somewhere', enabled: true, confirmationMessage: '', onClick: () => {}, style: '' }, 'Go to page'))
		),
};
