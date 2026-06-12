import type { Meta, StoryObj } from '@storybook/html-vite';
import { Popover } from '@outsystems/runtime-widgets-js';
import { createElement, mountWidget, widgetBaseProps } from '../_helpers/widget';

/**
 * Platform Popover widget — `[data-popover]` styled by
 * src/scss/03-widgets/_popover.scss / _popover-odc.scss. Renders
 * `.popover-top` (trigger placeholder; click expands) and, while expanded,
 * `.popover-bottom` (content placeholder, width from `popoverWidth`). Outside
 * clicks collapse it. Placeholders are `Widget.PlaceholderContent` objects —
 * stubbed here with `{ render }`, the only member the widget calls.
 */
const meta: Meta = { title: 'Widgets/Popover' };
export default meta;
type Story = StoryObj;

const item = (label: string, key: string) =>
	createElement('div', { key, style: { padding: '8px 12px', cursor: 'pointer' }, className: 'dropdown-item' }, label);

export const Default: Story = {
	render: () =>
		mountWidget(Popover as never, {
			...widgetBaseProps('popover'),
			style: '',
			popoverWidth: 220,
			placeholders: {
				topContent: {
					render: () => createElement('button', { className: 'btn', type: 'button' }, 'Open popover ▾'),
				},
				bottomContent: {
					render: () =>
						createElement('div', {}, [item('Edit', 'e'), item('Duplicate', 'd'), item('Delete', 'x')]),
				},
			},
		}),
};
