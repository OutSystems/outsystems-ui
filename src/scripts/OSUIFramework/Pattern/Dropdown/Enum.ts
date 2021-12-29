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
		OnSelected = 'OnSelected',
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
		AllowMultipleSelection = 'AllowMultipleSelection',
		IsDisabled = 'IsDisabled',
		NoResultsText = 'NoResultsText',
		OptionsList = 'OptionsList',
		Prompt = 'Prompt',
		SearchPrompt = 'SearchPrompt',
		SelectedOptions = 'SelectedOptions',
	}

	/**
	 * Providers
	 */
	export enum Provider {
		VirtualSelect = 'virtual-select',
	}
}
