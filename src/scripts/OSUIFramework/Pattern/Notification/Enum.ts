// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification.Enum {
	/**
	 * Notification Enum properties
	 */
	export enum Properties {
		IsOpen = 'IsOpen',
		Position = 'Position',
		Width = 'Width',
		HasOverlay = 'HasOverlay',
		CloseAfterTime = 'CloseAfterTime',
		CloseOnBodyClick = 'CloseOnBodyClick',
	}

	/**
	 * Sidebar Enum for CSS Classes
	 */

	export enum CssClass {
		Pattern = 'osui-notification',
		PatternContent = 'osui-notification-content',
		PatternIsOpen = 'is-open',
		PatternOverlay = 'has-overlay',
		PatternPosition = 'is-',
	}

	/**
	 * Sidebar Enum for CSS Custom Properties
	 */
	export enum CssProperty {
		Width = '--notification-width',
	}
}
