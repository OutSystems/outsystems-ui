/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.VirtualSelect {
	/**
	 * Class that represents the custom configurations received by the Dropdown.
	 *
	 * @export
	 * @class AbstractVirtualSelectConfig
	 * @extends {AbstractDropdownConfig}
	 */
	export abstract class AbstractVirtualSelectConfig extends OSFramework.Patterns.Dropdown.AbstractDropdownConfig {
		// Store configs set using extensibility
		private _providerExtendedOptions: VirtualSelectOpts;
		// Store the Provider Options
		private _providerOptions: VirtualSelectOpts;
		public ElementId: string;
		public NoResultsText: string;
		public OptionsList: DropDownOption[];
		public Prompt: string;
		public SearchPrompt: string;
		public SelectedOptions: DropDownOption[];
		public ShowDropboxAsPopup = true;

		// Method used to check if an image or an icon should be added to the given option
		private _checkForFigType(index: number): Enum.FigureType {
			let hasImage = Enum.FigureType.None;

			// Check if image_url_or_class filed has info
			if (
				this.OptionsList[index].image_url_or_class !== undefined &&
				this.OptionsList[index].image_url_or_class !== ''
			) {
				// The given info doesn't have spaces on it, check if it's a valid URL
				hasImage = OSFramework.Helper.URL.IsImage(this.OptionsList[index].image_url_or_class)
					? Enum.FigureType.Image
					: Enum.FigureType.Icon;
			}

			return hasImage;
		}

		// Method used to generate the HTML String to be attached at the option label
		private _getOptionIconPrefix(index: number): string {
			return `<i class="${Enum.CssClass.OptionItemIcon} ${this.OptionsList[index].image_url_or_class}"></i>`;
		}

		// Method used to generate the HTML String to be attached at the option label
		private _getOptionImagePrefix(index: number): string {
			// Since we'll add a src attribute, lets sanitize the given url to avoid XSS
			const sanitizedUrl = OSFramework.Helper.Sanitize(this.OptionsList[index].image_url_or_class);
			return `<img class="${Enum.CssClass.OptionItemImage}" src="${sanitizedUrl}">`;
		}

		// Method used to generate the option info that will be added
		private _getOptionInfo(data: VirtualSelectOptionInfo): string {
			let prefix = '';

			// Check if an image should be added to the Option item
			const hasFigureType = this._checkForFigType(data.index);

			switch (hasFigureType) {
				case Enum.FigureType.Image:
					prefix = this._getOptionImagePrefix(data.index);
					break;
				case Enum.FigureType.Icon:
					prefix = this._getOptionIconPrefix(data.index);
					break;
			}

			return `${prefix}${data.label}`;
		}

		// Method used to set all the common VirtualSelect properties across the different types of instances
		public getProviderConfig(): VirtualSelectOpts {
			/* In order to avoid XSS let's sanitize the label of each all options
			- This must be done here since If we do this at the renderer option we will remain with the
			library value unSanitized, that said we must do it before adding the list of options to the library! */
			for (const option of this.OptionsList) {
				option.label = OSFramework.Helper.Sanitize(option.label);
			}

			// Set the library options
			this._providerOptions = {
				ele: this.ElementId,
				dropboxWrapper: this.setDropboxWrapperConfig(this.ShowDropboxAsPopup),
				hideClearButton: false,
				labelRenderer: this._getOptionInfo.bind(this),
				noOptionsText: this.NoResultsText,
				noSearchResultsText: this.NoResultsText,
				options: this.OptionsList,
				placeholder: this.Prompt,
				search: true,
				searchPlaceholderText: this.SearchPrompt,
				selectAllOnlyVisible: true,
				selectedValue: this._getSelectedValues(),
				showDropboxAsPopup: this.ShowDropboxAsPopup,
				silentInitialValueSet: true,
				textDirection: OutSystems.OSUI.Utils.GetIsRTL()
					? OSFramework.GlobalEnum.Direction.RTL
					: OSFramework.GlobalEnum.Direction.LTR,
			} as VirtualSelectOpts;

			return this.mergeConfigs(this._providerOptions, this._providerExtendedOptions);
		}

		/**
		 * Method to set the dropboxWrapper config
		 *
		 * @param {boolean} showAsPopup
		 * @return {*}  {string}
		 * @memberof AbstractVirtualSelectConfig
		 */
		public setDropboxWrapperConfig(showAsPopup: boolean): string {
			return showAsPopup && OSFramework.Helper.DeviceInfo.IsPhone
				? Enum.DropboxWrapperOptions.Body
				: Enum.DropboxWrapperOptions.Self;
		}

		// Override, Validate configs key values
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.NoResultsText:
					validatedValue = this.validateString(value as string, undefined);
					break;
				case Enum.Properties.OptionsList:
					validatedValue = value as DropDownOption;
					break;
				case Enum.Properties.Prompt:
					validatedValue = this.validateString(value as string, undefined);
					break;
				case Enum.Properties.SearchPrompt:
					validatedValue = this.validateString(value as string, undefined);
					break;
				case Enum.Properties.SelectedOptions:
					validatedValue = value as DropDownOption;
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}

		/**
		 * Method to validate and save the external provider configs
		 *
		 * @param {VirtualSelectOpts} newConfigs
		 * @param {ProviderInfo} providerInfo
		 * @memberof AbstractVirtualSelectConfig
		 */
		public validateExtensibilityConfigs(newConfigs: VirtualSelectOpts, providerInfo: ProviderInfo): void {
			this._providerExtendedOptions = super.validateExtensibilityConfigs(newConfigs, providerInfo);
		}

		protected abstract _getSelectedValues(): string[];
	}
}
