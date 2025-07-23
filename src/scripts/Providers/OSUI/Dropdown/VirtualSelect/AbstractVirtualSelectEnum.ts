// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect.Enum {
	/**
	 * VirtualSelect provider info
	 */
	export enum ProviderInfo {
		Name = 'VirtualSelect',
		Version = '1.1.0',
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
		BeforeClose = 'beforeClose',
		BeforeOpen = 'beforeOpen',
		Change = 'change',
		OnSelected = 'OnSelected',
	}

	/**
	 * Properties
	 */
	export enum Properties {
		SanitizeDropdownValues = 'SanitizeDropdownValues',
		NoOptionsText = 'NoOptionsText',
		NoResultsText = 'NoResultsText',
		OptionsList = 'OptionsList',
		Prompt = 'Prompt',
		SearchPrompt = 'SearchPrompt',
		StartingSelection = 'StartingSelection',
	}

	/**
	 * Properties values
	 */
	export enum PropertiesValues {
		AriaLabelMultipleValue = 'Select one or more options',
		AriaLabelSingleValue = 'Select an option',
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
