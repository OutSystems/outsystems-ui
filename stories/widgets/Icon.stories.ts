import type { Meta, StoryObj } from '@storybook/html-vite';
import { Icon } from '@outsystems/runtime-widgets-js';
import { createElement, mountTree, widgetBaseProps } from '../_helpers/widget';

// IconSize const enum → numeric: FontSize 0, Twotimes 1, Threetimes 2, Fourtimes 3.
const meta: Meta = { title: 'Widgets/Icon' };
export default meta;
type Story = StoryObj;

const icon = (name: string, size: number) =>
	createElement(Icon as never, { ...widgetBaseProps('icon'), icon: name, iconSize: size, style: '', key: name + size });

export const Default: Story = {
	render: () =>
		mountTree(
			createElement('div', { style: { display: 'flex', gap: '20px', alignItems: 'center' } }, [
				icon('star', 1),
				icon('bell', 2),
				icon('check', 3),
				icon('cog', 3),
			])
		),
};
