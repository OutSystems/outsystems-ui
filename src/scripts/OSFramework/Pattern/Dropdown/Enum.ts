// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Dropdown.Enum {
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
