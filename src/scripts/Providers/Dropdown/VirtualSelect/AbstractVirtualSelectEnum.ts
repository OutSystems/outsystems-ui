// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.VirtualSelect.Enum {
	/**
	 * VirtualSelect provider info
	 */
	export enum ProviderInfo {
		Name = 'VirtualSelect',
		Version = '1.0.31',
	}

	/**
	 * CSS Classes
	 */
	export enum CssClass {
		ErrorMessage = 'osui-dropdown-error-message',
		NotValid = 'osui-dropdown--not-valid',
		OptionItemIcon = 'osui-dropdown-option-icon',
		OptionItemImage = 'osui-dropdown-option-image',
	}

	/**
	 * Events
	 */
	export enum Events {
		Change = 'change',
		OnProviderConfigsApplied = 'OnProviderConfigsApplied',
		OnSelected = 'OnSelected',
	}

	/**
	 * Properties
	 */
	export enum Properties {
		NoOptionsText = 'NoOptionsText',
		NoResultsText = 'NoResultsText',
		OptionsList = 'OptionsList',
		Prompt = 'Prompt',
		SearchPrompt = 'SearchPrompt',
		StartingSelection = 'StartingSelection',
	}

	/**
	 * Options Figure types
	 */
	export enum FigureType {
		Icon = 'Icon',
		Image = 'Image',
		None = 'None',
	}

	export enum ExtendedConfigs {
		hasOptionDescription = 'hasOptionDescription',
	}
}
