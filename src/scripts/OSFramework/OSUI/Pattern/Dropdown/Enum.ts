// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown.Enum {
	/**
	 * CSS Classes
	 */
	export enum CssClass {
		DropdownLarge = 'dropdown--is-large',
		DropdownSmall = 'dropdown--is-small',
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
