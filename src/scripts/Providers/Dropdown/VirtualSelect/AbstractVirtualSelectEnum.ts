// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.VirtualSelect.Enum {
	/**
	 * Flatpickr provider info
	 */
	export enum ProviderInfo {
		Name = 'VirtualSelect',
		Version = '1.0.27',
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

	export enum DropboxWrapperOptions {
		Body = 'body',
		Self = 'self',
	}

	/**
	 * Events
	 */
	export enum Events {
		Change = 'change',
		OnSelected = 'OnSelected',
	}

	/**
	 * Properties
	 */
	export enum Properties {
		NoResultsText = 'NoResultsText',
		OptionsList = 'OptionsList',
		Prompt = 'Prompt',
		SearchPrompt = 'SearchPrompt',
		SelectedOptions = 'SelectedOptions',
	}

	/**
	 * Options Figure types
	 */
	export enum FigureType {
		Icon = 'Icon',
		Image = 'Image',
		None = 'None',
	}
}
