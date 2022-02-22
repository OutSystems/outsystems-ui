// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Constants {
	/**
	 * OutSystemsUI Accessibility attribues
	 */
	export const A11YAttributes = {
		Aria: {
			Atomic: 'atomic',
			Controls: 'aria-controls',
			Disabled: 'aria-disabled',
			Describedby: 'describedby',
			Expanded: 'aria-expanded',
			Haspopup: 'aria-haspopup',
			Hidden: 'aria-hidden',
			Label: 'aria-label',
			Labelledby: 'labelledby',
			Selected: 'aria-selected',
			ValueMax: 'valuemax',
			ValueMin: 'valuemin',
		},
		AriaLive: {
			AttrName: 'aria-live',
			Assertive: 'assertive',
			Polite: 'polite',
			Off: 'off',
		},
		Role: {
			Alert: 'alert',
			AttrName: 'role',
			Button: 'button',
			Complementary: 'complementary',
			MenuItem: 'menuitem',
			Progressbar: 'progressbar',
			Search: 'search',
			Tab: 'tab',
			TabList: 'tablist',
			TabPanel: 'tabpanel',
			Tooltip: 'tooltip',
		},
		TabIndex: 'tabindex',
		States: {
			Empty: '',
			False: 'false',
			TabIndexHidden: '-1',
			TabIndexShow: '0',
			True: 'true',
		},
	};

	/* Used to concatenate when querySelector for a class */
	export const Dot = '.';

	/* Manage if the log messages are visible or not  */
	export const EnableLogMessages = false;

	/* Store focusable elements when doing a focus trap inside an element*/
	export const FocusableElems =
		'a[href]:not([disabled]),[tabindex="0"], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]),input[type="submit"]:not([disabled]), select:not([disabled])';

	/* cssClass to be checked if the Accessibility Feature is enabled */
	export const HasAccessibilityClass = 'has-accessible-features';

	/* cssClass to be added to elements that must visible yet hidded for accessibility purposes */
	export const AccessibilityHideElementClass = 'wcag-hide-text';

	/* cssClass to be checked if the RTL Feature is enabled */
	export const IsRTLClass = 'is-rtl';

	/* cssClass to be remove transitions on element */
	export const NoTransition = 'no-transition';

	/* OSUI Version */
	export const OSUIVersion = '2.8.1';

	/* css Class that is added in layout */
	export const LayoutClass = 'layout';

	/* css Class that is added in header */
	export const HeaderClass = 'header';

	/*Constant to be used across project as the zero value*/
	export const ZeroValue = 0;
}
