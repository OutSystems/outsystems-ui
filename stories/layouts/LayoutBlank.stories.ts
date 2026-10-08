import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from '../_helpers/lowcode';
import { type Device, deviceArgType, enableA11yArgType, layoutBlank, renderLayout } from './_shell';

/**
 * LayoutBlank — "Adds a basic layout with a single placeholder." No header, menu or
 * footer: just the content column.
 *
 *   .layout.blank[.has-accessible-features]
 *     .main > .content > .main-content[role=main]   (Content placeholder)
 *
 * Inputs mirror the block: EnableAccessibilityFeatures, ExtendedClass.
 */
interface Args {
	device: Device;
	enableAccessibilityFeatures: boolean;
	extendedClass: string;
}

const meta: Meta<Args> = {
	title: 'Layouts/LayoutBlank',
	argTypes: {
		device: deviceArgType,
		enableAccessibilityFeatures: enableA11yArgType,
		extendedClass: extendedClassArgType,
	},
	args: { device: 'desktop', enableAccessibilityFeatures: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<Args>;

const render = (args: Args) => renderLayout(layoutBlank(args), { device: args.device });

export const Default: Story = { render };

export const Phone: Story = {
	args: { device: 'phone' },
	render,
};
