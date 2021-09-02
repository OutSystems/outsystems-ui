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

	/* cssClass to be checked if the Accessibility Feature is enabled */
	export const HasAccessibilityClass = 'has-accessible-features';

	/* OSUI Version */
	export const OSUIVersion = '2.6.9';
}
