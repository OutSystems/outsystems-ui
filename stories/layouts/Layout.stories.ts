import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from '../_helpers/lowcode';
import {
	type Device,
	deviceArgType,
	enableA11yArgType,
	layoutNoHeader,
	menuVisibleArgType,
	renderLayout,
} from './_shell';

/**
 * Layout — the header-less side menu layout introduced with the new Layouts feature.
 * "Adds a layout with a menu on the side, most used in applications with several menu
 * items."
 *
 *   .layout.layout-side.layout-side-no-header.aside-visible[.has-accessible-features]
 *     a.skip-nav
 *     aside.aside-navigation[role=complementary] > div > [Menu block]
 *     .main
 *       #OnlyInMobileView > [MenuIcon]        the hamburger shown on tablet and phone
 *       .content > .main-content[role=main] … + footer.content-bottom > .footer
 *
 * There is no header: the menu is always visible on desktop, and on tablet and phone a
 * bare menu icon above the content opens it. Inputs mirror the block:
 * EnableAccessibilityFeatures, ExtendedClass.
 */
interface Args {
	device: Device;
	menuVisible: boolean;
	enableAccessibilityFeatures: boolean;
	extendedClass: string;
}

const meta: Meta<Args> = {
	title: 'Layouts/Layout',
	argTypes: {
		device: deviceArgType,
		menuVisible: menuVisibleArgType,
		enableAccessibilityFeatures: enableA11yArgType,
		extendedClass: extendedClassArgType,
	},
	args: { device: 'desktop', menuVisible: false, enableAccessibilityFeatures: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<Args>;

const render = (args: Args) => renderLayout(layoutNoHeader(args), { device: args.device });

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
