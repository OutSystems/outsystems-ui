// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Dropdown/Enum.ts
namespace OSFramework.Patterns.Dropdown.Enum {
========
namespace OSFramework.OSUI.Patterns.Dropdown.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Dropdown/Enum.ts
	/**
	 * CSS Classes
	 */
	export enum CssClass {
		DropdownLarge = 'dropdown--is-large',
		DropdownSmall = 'dropdown--is-small',
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Dropdown/Enum.ts
	}

	/**
	 * Events
	 */
	export enum Events {
		Initialized = 'Initialized',
========
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Dropdown/Enum.ts
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
