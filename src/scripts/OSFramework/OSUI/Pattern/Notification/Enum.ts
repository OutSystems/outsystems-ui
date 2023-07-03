// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Notification/Enum.ts
namespace OSFramework.Patterns.Notification.Enum {
========
namespace OSFramework.OSUI.Patterns.Notification.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Notification/Enum.ts
	/**
	 * Notification Enum for CSS Classes
	 */
	export enum CssClass {
		Pattern = 'osui-notification',
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
		DefaultPosition = 'top',
		DefaultWidth = '370px',
	}

	/**
	 * Notification Events
	 */
	export enum Events {
		OnToggle = 'OnToggle',
	}

	/**
	 * Notification Enum properties
	 */
	export enum Properties {
		CloseAfterTime = 'CloseAfterTime',
		InteractToClose = 'InteractToClose',
		NeedsSwipes = 'NeedsSwipes',
		Position = 'Position',
		StartsOpen = 'StartsOpen',
		Width = 'Width',
	}
}
