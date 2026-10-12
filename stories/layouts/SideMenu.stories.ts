import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from '../_helpers/lowcode';
import {
	type Device,
	type MenuBehavior,
	deviceArgType,
	enableA11yArgType,
	hasFixedHeaderArgType,
	layoutSideMenu,
	menuBehaviorArgType,
	menuVisibleArgType,
	renderLayout,
} from './_shell';

/**
 * LayoutSideMenu — "Adds a layout with a menu on the side, most used in applications
 * with several menu items."
 *
 *   .layout.layout-side[.fixed-header].aside-{visible|overlay|expandable}[.has-accessible-features]
 *     a.skip-nav
 *     aside.aside-navigation[role=complementary] > div > [Menu block]
 *     .main
 *       header.header[role=banner] > .header-top > .header-content > [MenuIcon] [ApplicationTitle] .header-navigation
 *       .content > .main-content[role=main] … + footer.content-bottom > .footer
 *
 * Inputs mirror the block: MenuBehavior (SideMenuBehavior: Visible / Overlay /
 * Expandable), HasFixedHeader, EnableAccessibilityFeatures, ExtendedClass. Side menu
 * layouts are full width (no content cap); the menu panel carries the aside hairlines and
 * the 8px link gap from `_layout.scss`.
 */
interface Args {
	device: Device;
	menuVisible: boolean;
	menuBehavior: MenuBehavior;
	hasFixedHeader: boolean;
	enableAccessibilityFeatures: boolean;
	extendedClass: string;
}

const meta: Meta<Args> = {
	title: 'Layouts/SideMenu',
	argTypes: {
		device: deviceArgType,
		menuVisible: menuVisibleArgType,
		menuBehavior: menuBehaviorArgType,
		hasFixedHeader: hasFixedHeaderArgType,
		enableAccessibilityFeatures: enableA11yArgType,
		extendedClass: extendedClassArgType,
	},
	args: {
		device: 'desktop',
		menuVisible: false,
		menuBehavior: 'Visible',
		hasFixedHeader: true,
		enableAccessibilityFeatures: false,
		extendedClass: '',
	},
};
export default meta;

type Story = StoryObj<Args>;

const render = (args: Args) => renderLayout(layoutSideMenu(args), { device: args.device });

export const Visible: Story = { render };

export const Overlay: Story = {
	args: { menuBehavior: 'Overlay' },
	render,
};

export const OverlayOpen: Story = {
	name: 'Overlay, menu open',
	args: { menuBehavior: 'Overlay', menuVisible: true },
	render,
};

export const Expandable: Story = {
	args: { menuBehavior: 'Expandable' },
	render,
};

export const ExpandableOpen: Story = {
	name: 'Expandable, menu open',
	args: { menuBehavior: 'Expandable', menuVisible: true },
	render,
};

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
