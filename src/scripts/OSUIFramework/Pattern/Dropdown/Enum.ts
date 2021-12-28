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
		OnSelected = 'OnSelected',
		OnInitialize = 'OnInitialize',
	}

	// Dropdown Mode Types
	export enum Mode {
		Search = 'search',
		Tags = 'tags',
	}

	/**
	 * Properties
	 */
	export enum Properties {
		DropdownPrompt = 'DropdownPrompt',
		IsDisabled = 'IsDisabled',
		NoResultsText = 'NoResultsText',
		OptionsList = 'OptionsList',
		SearchText = 'SearchText',
		SelectedOptions = 'SelectedOptions',
		ShowCheckboxes = 'ShowCheckboxes',
		Type = 'Type',
	}

	/**
	 * Providers
	 */
	export enum Provider {
		VirtualSelect = 'virtual-select',
	}

	/**
	 * Types
	 */
	export enum Type {
		Search = 'search',
		Tags = 'tags',
	}
}
