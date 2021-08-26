// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Constants {
	/* Manage if the log messages are visible or not  */
	export const enableLogMessages = false;

	/* Store focusable elements when doing a focus trap inside an element*/
	export const focusableElems =
		'a[href]:not([disabled]),[tabindex="0"], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]),input[type="submit"]:not([disabled]), select:not([disabled])';

	/* cssClass to be checked if the Accessibility Feature is enabled */
	export const hasAccessibilityClass = 'has-accessible-features';

	/* cssClass to be checked if the RTL Feature is enabled */
	export const isRTLClass = 'is-rtl';

	/* cssClass to be remove transitions on element */
	export const noTransition = 'no-transition';

	/* OSUI Version */
	export const OSUIVersion = '2.7.0';
}
