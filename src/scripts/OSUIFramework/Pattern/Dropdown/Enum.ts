// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Dropdown.Enum {
	/**
	 * CSS Classes
	 */
	export enum CssClass {}

	/**
	 * Events
	 */
	export enum Events {
		Initialized = 'Initialized',
	}

	// Dropdown Mode Types
	export enum Mode {
		Search = 'search',
		ServerSide = 'server-side',
		Tags = 'tags',
	}

	/**
	 * Dropdown Option item notification type
	 */
	export enum OptionItemNotificationType {
		Add = 'add',
		Click = 'click',
		KeyPressed = 'keyPressed',
		Removed = 'removed',
	}

	/**
	 * Properties
	 */
	export enum Properties {
		IsDisabled = 'IsDisabled',
	}

	/**
	 * Providers
	 */
	export enum Provider {
		OSUIComponents = 'osui-components',
		VirtualSelect = 'virtual-select',
	}
}
