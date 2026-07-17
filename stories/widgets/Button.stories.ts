import type { Meta, StoryObj } from '@storybook/html-vite';
import { Button } from '@outsystems/runtime-widgets-js';
import { createElement, mountTree, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/Button' };
export default meta;
type Story = StoryObj;

const btn = (style: string, label: string, extra: Record<string, unknown> = {}) =>
	createElement(
		Button as never,
		{ ...widgetBaseProps('button'), style, enabled: true, onClick: () => {}, key: label, ...extra },
		label
	);

export const Variants: Story = {
	render: () =>
		mountTree(
			createElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } }, [
				btn('btn btn-primary', 'Primary'),
				btn('btn', 'Secondary'),
				btn('btn btn-cancel', 'Cancel'),
				btn('btn btn-success', 'Confirm'),
				btn('btn btn-error', 'Delete'),
				btn('btn btn-primary', 'Disabled', { enabled: false }),
			])
		),
};
