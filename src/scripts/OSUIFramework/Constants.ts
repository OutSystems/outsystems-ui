// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Constants {
	/**
	 * OutSystemsUI Accessibility attribues
	 */
	export const AccessibilityAttribute = {
		Aria: {
			Describedby: 'describedby',
			Labelledby: 'labelledby',
			ValueMax: 'valuemax',
			ValueMin: 'valuemin',
		},
		Role: {
			AttrName: 'role',
			Progressbar: 'progressbar',
			Search: 'search',
			Tooltip: 'tooltip',
		},
		TabIndex: 'tabindex',
	};

	/* Used to concatenate when querySelector for a class */
	export const Dot = '.';

	/* Used to concatenate when a value needs a unit */
	export const Percentage = '%';
	export const Pixel = 'px';

	/* Manage if the log messages are visible or not  */
	export const EnableLogMessages = false;

	/* Store focusable elements when doing a focus trap inside an element*/
	export const FocusableElems =
		'a[href]:not([disabled]),[tabindex="0"], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]),input[type="submit"]:not([disabled]), select:not([disabled])';

	/* cssClass to be checked if the Accessibility Feature is enabled */
	export const HasAccessibilityClass = 'has-accessible-features';

	/* cssClass to be checked if the RTL Feature is enabled */
	export const IsRTLClass = 'is-rtl';

	/* cssClass to be remove transitions on element */
	export const NoTransition = 'no-transition';

	/* OSUI Version */
	export const OSUIVersion = '2.7.0';
}
