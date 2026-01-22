// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Constants {
	/**
	 * OutSystemsUI Accessibility attribues
	 */
	export const A11YAttributes = {
		Aria: {
			Atomic: 'aria-atomic',
			Modal: 'aria-modal',
			Busy: 'aria-busy',
			Controls: 'aria-controls',
			Describedby: 'aria-describedby',
			Disabled: 'aria-disabled',
			Expanded: 'aria-expanded',
			Haspopup: {
				prop: 'aria-haspopup',
				value: {
					False: 'false',
					True: 'true',
					Menu: 'menu',
					Listbox: 'listbox',
					Tree: 'tree',
					Grid: 'grid',
					Dialog: 'dialog',
				},
			},
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
			Dialog: 'dialog',
			Listbox: 'listbox',
			Menu: 'menu',
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

	/* Attribute used to flag the default tabindex element under the pattern context */
	export const FocusableTabIndexDefault = 'default-tabindex-element';

	/* Store all the hidden elements under the context of a hidden container (ex: sidebar when it's closed) in order to turn them
	visible for A11Y when hidden container turns into visible */
	export const FocusableTabIndexHidden = '[tabindex="-1"][default-tabindex-element]';

	/* Attribute used to flag some elements to be ignored by the Focus Trap behaviour */
	export const FocusTrapIgnoreAttr = 'ignore-focus-trap';

	/* cssClass to be checked if the Accessibility Feature is enabled */
	export const HasAccessibilityClass = 'has-accessible-features';

	/* Used to typify noon-valid expected number values */
	export const InvalidNumber = -1;

	/* cssClass to be checked if the RTL Feature is enabled */
	export const IsRTLClass = 'is-rtl';

	/* To fix an issue when: 
		- The user is using a device with the Arabic Language
		- The application IS NOT using the Arabic Language

		That makes date type inputs lose the date format and show the date in the wrong format,
		We must force the text direction to RTL in the input in order to fix it.
		
		More info about this in the release notes of ROU-11464.
	*/
	export const IsRTLDeviceType = 'is-rtl-device';

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
	export const OSUIVersion = '2.27.0';

	/* Constant to be used across project as the zero value*/
	export const ZeroValue = 0;
}
