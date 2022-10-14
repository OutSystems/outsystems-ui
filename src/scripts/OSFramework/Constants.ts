// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Constants {
	/**
	 * OutSystemsUI Accessibility attribues
	 */
	export const A11YAttributes = {
		Aria: {
			Atomic: 'atomic',
			Controls: 'aria-controls',
			Describedby: 'describedby',
			Disabled: 'aria-disabled',
			Expanded: 'aria-expanded',
			Haspopup: 'aria-haspopup',
			Hidden: 'aria-hidden',
			Label: 'aria-label',
			Labelledby: 'labelledby',
			Multiselectable: 'aria-multiselectable',
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
			Listbox: 'listbox',
			MenuItem: 'menuitem',
			Option: 'option',
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

	/* Used to typify the empty string value*/
	export const EmptyString = '';

	/* Store focusable elements when doing a focus trap inside an element*/
	export const FocusableElems =
		'a[href]:not([disabled]),[tabindex="0"], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]),input[type="submit"]:not([disabled]), select:not([disabled])';

	/* Store JavaScript types*/
	export const JavaScriptTypes = {
		Undefined: 'undefined',
		Boolean: 'boolean',
		Number: 'number',
		String: 'string',
		Symbol: 'symbol',
		Function: 'function',
		Object: 'object',
	};

	/* Store strict inputs elements excluding buttons, checkboxes... */
	export const JustInputs =
		'input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=image]):not([type=image]):not([type=radio]):not([type=range]):not([type=reset]):not([type=submit]), textarea';

	/* cssClass to be checked if the Accessibility Feature is enabled */
	export const HasAccessibilityClass = 'has-accessible-features';

	/* Used to typify noon-valid expected number values */
	export const InvalidNumber = -1;

	/* Store months list */
	export const Months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	/* cssClass to be added to elements that must visible yet hidded for accessibility purposes */
	export const AccessibilityHideElementClass = 'wcag-hide-text';

	/* cssClass to be checked if the RTL Feature is enabled */
	export const IsRTLClass = 'is-rtl';

	/* cssClass to be remove transitions on element */
	export const NoTransition = 'no-transition';

	/* OSUI Version */
	export const OSUIVersion = '2.13.0';

	/*Constant to be used across project as the zero value*/
	export const ZeroValue = 0;
}
