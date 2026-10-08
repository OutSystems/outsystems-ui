import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from '../_helpers/lowcode';
import {
	type Device,
	deviceArgType,
	enableA11yArgType,
	hasFixedHeaderArgType,
	layoutTopMenu,
	menuVisibleArgType,
	renderLayout,
} from './_shell';

/**
 * LayoutTopMenu — "Adds a layout with the menu on the header, most used in applications
 * with few menu items."
 *
 *   .layout.layout-top[.fixed-header][.has-accessible-features]
 *     .main
 *       header.header[role=banner] > a.skip-nav + .header-top > .header-content
 *         [MenuIcon] [ApplicationTitle] .header-navigation.OSInline > [Menu block]
 *       .content > .main-content[role=main] … + footer.content-bottom > .footer
 *
 * On tablet and phone the `.header-navigation` becomes a fixed drawer and the hamburger
 * opens it (`menu-visible` on the layout). Inputs mirror the block: HasFixedHeader,
 * EnableAccessibilityFeatures, ExtendedClass.
 */
interface Args {
	device: Device;
	menuVisible: boolean;
	hasFixedHeader: boolean;
	enableAccessibilityFeatures: boolean;
	extendedClass: string;
}

const meta: Meta<Args> = {
	title: 'Layouts/TopMenu',
	argTypes: {
		device: deviceArgType,
		menuVisible: menuVisibleArgType,
		hasFixedHeader: hasFixedHeaderArgType,
		enableAccessibilityFeatures: enableA11yArgType,
		extendedClass: extendedClassArgType,
	},
	args: {
		device: 'desktop',
		menuVisible: false,
		hasFixedHeader: true,
		enableAccessibilityFeatures: false,
		extendedClass: '',
	},
};
export default meta;

type Story = StoryObj<Args>;

const render = (args: Args) => renderLayout(layoutTopMenu(args), { device: args.device });

export const Default: Story = { render };

export const Tablet: Story = {
	args: { device: 'tablet' },
	render,
};

export const Phone: Story = {
	args: { device: 'phone' },
	render,
};

export const PhoneMenuOpen: Story = {
	name: 'Phone, menu open',
	args: { device: 'phone', menuVisible: true },
	render,
};
