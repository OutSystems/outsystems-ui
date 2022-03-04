// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification.Enum {
	/**
	 * Notification Enum for CSS Classes
	 */

	export enum CssClass {
		Pattern = 'osui-notification',
		PatternContent = 'osui-notification__content',
		PatternIsOpen = 'osui-notification--is-open',
		PatternPosition = 'osui-notification--is-',
	}

	/**
	 * Notification Enum for CSS Custom Properties
	 */
	export enum CssProperty {
		Width = '--notification-width',
	}

	/**
	 * Notification default properties
	 */
	export enum Defaults {
		DefaultWidth = '370px',
		DefaultPosition = 'top',
	}

	/**
	 * Notification Events
	 */
	export enum Events {
		OnInitialize = 'Initialized',
		OnToggle = 'OnToggle',
	}
	/**
	 * Notification Enum properties
	 */
	export enum Properties {
		StartsOpen = 'StartsOpen',
		Position = 'Position',
		Width = 'Width',
		CloseAfterTime = 'CloseAfterTime',
		ClickToClose = 'ClickToClose',
	}
}
