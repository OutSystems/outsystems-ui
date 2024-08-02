// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Constants {
	/**
	 * OutSystemsUI Accessibility attribues
	 */
	export const A11YAttributes = {
		Aria: {
			Atomic: 'aria-atomic',
			Busy: 'aria-busy',
			Controls: 'aria-controls',
			Describedby: 'aria-describedby',
			Disabled: 'aria-disabled',
			Expanded: 'aria-expanded',
			Haspopup: 'aria-haspopup',
			Hidden: 'aria-hidden',
			Label: 'aria-label',
			Labelledby: 'aria-labelledby',
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
			AlertDialog: 'alertdialog',
			AttrName: 'role',
			Button: 'button',
			Complementary: 'complementary',
			Listbox: 'listbox',
			MenuItem: 'menuitem',
			Option: 'option',
			Presentation: 'presentation',
			Progressbar: 'progressbar',
			Region: 'region',
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

	/* cssClass to be added to elements that must visible yet hidded for accessibility purposes */
	export const AccessibilityHideElementClass = 'wcag-hide-text';

	/* Attribute used to allow propagation on containers with event */
	export const AllowPropagationAttr = '[data-allow-event-propagation]';

	/* Used to concatenate when querySelectorAll for a list of classes */
	export const Comma = ',';

	/* Used to concatenate when querySelector for a class */
	export const Dot = '.';

	/* Used to typify the empty string value*/
	export const EmptyString = '';

	/* Manage if the log messages are visible or not  */
	export const EnableLogMessages = false;

	/* Store focusable elements when doing a focus trap inside an element*/
	export const FocusableElems =
		'a[href]:not([disabled]), [tabindex="0"], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';

	export const FocusableTabIndexHidden = '[tabindex="-1"]';

	/* Attribute used to flag some elements to be ignored by the Focus Trap behaviour */
	export const FocusTrapIgnoreAttr = 'ignore-focus-trap';

	/* cssClass to be checked if the Accessibility Feature is enabled */
	export const HasAccessibilityClass = 'has-accessible-features';

	/* Used to typify noon-valid expected number values */
	export const InvalidNumber = -1;

	/* cssClass to be checked if the RTL Feature is enabled */
	export const IsRTLClass = 'is-rtl';

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

	/* Store the default app lang */
	export const Language = {
		code: 'en-US',
		short: 'en',
	};

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

	/* cssClass to be remove transitions on element */
	export const NoTransition = 'no-transition';

	/**
	 * OSUI Set platform in use.
	 * - This value will be set dynamically at the compilation momment!
	 * - Do not change default string value!
	 */
	export const OSPlatform = '<->platformType<->';

	/* OSUI Version */
	export const OSUIVersion = '2.19.2';

	/* Constant to be used across project as the zero value*/
	export const ZeroValue = 0;
}
