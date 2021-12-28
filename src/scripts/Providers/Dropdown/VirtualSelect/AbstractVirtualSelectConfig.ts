/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.VirtualSelect {
	/**
	 * Class that represents the custom configurations received by the Dropdown.
	 *
	 * @export
	 * @class AbstractVirtualSelectConfig
	 * @extends {AbstractDropdownConfig}
	 */
	export abstract class AbstractVirtualSelectConfig extends OSUIFramework.Patterns.Dropdown.AbstractDropdownConfig {
		public ElementId: string;

		// Method used to check if an image or an icon should be added to the given option
		private _checkForImageOrIcon(index: number): boolean | undefined {
			let hasImage: boolean | undefined;

			// Check if image_url_or_class filed has info
			if (this.OptionsList[index].image_url_or_class !== '') {
				// The given info doesn0t have spaces on it, check if it's a valid URL
				hasImage = OSUIFramework.Helper.URL.IsImage(this.OptionsList[index].image_url_or_class);
			} else {
				// Nothing to be added!
				hasImage = undefined;
			}

			return hasImage;
		}

		// Method used to generate the HTML String to be attached at the option label
		private _getOptionIconPrefix(index: number): string {
			return `<i class="${Enum.CssClass.OptionItemIcon} ${this.OptionsList[index].image_url_or_class}"></i>`;
		}

		// Method used to generate the HTML String to be attached at the option label
		private _getOptionImagePrefix(index: number): string {
			// TODO - jRio: Change this style into CSS!!!
			return `<img class="${Enum.CssClass.OptionItemImage}" style="width:20px; height: 20px;" src="${this.OptionsList[index].image_url_or_class}">`;
		}

		// Method used to generate the option info that will be added
		private _getOptionInfo(data: VirtualSelectOptionInfo): string {
			let prefix = '';

			// Check if an image should be added to the Option item
			if (this._checkForImageOrIcon(data.index) === true) {
				prefix = this._getOptionImagePrefix(data.index);
			} else if (this._checkForImageOrIcon(data.index) === false) {
				// If an icon should be added to the Option item
				prefix = this._getOptionIconPrefix(data.index);
			}

			return `${prefix}${data.label}`;
		}

		// Method used to get the key values of the given selected values
		private _getSelectedValues(): string[] {
			const selectedKeyvalues = [];

			// Has selected values
			if (this.SelectedOptions.length > 0) {
				// Check if it's multiple options
				if (this.ShowCheckboxes) {
					// Get the selected key value
					for (const option of this.SelectedOptions) {
						selectedKeyvalues.push(option.value);
					}
				} else {
					// It's Single option, set only the first given value
					selectedKeyvalues.push(this.SelectedOptions[0].value);
				}
			}

			return selectedKeyvalues;
		}

		// Method used to set all the common VirtualSelect properties across the different types of instances
		public getCommonProviderConfigs(): VirtualSelectOpts {
			const virtualSelectOpts = {
				ele: this.ElementId,
				labelRenderer: this._getOptionInfo.bind(this),
				multiple: this.ShowCheckboxes,
				noOptionsText: this.NoResultsText,
				noSearchResultsText: this.NoResultsText,
				options: this.OptionsList,
				placeholder: this.Prompt,
				searchPlaceholderText: this.SearchPrompt,
				selectedValue: this._getSelectedValues(),
				textDirection: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,
				hideClearButton: true,
				// onServerSearch: this._onSampleSelectServerSearch, // => Trigger the OnServerSearch
			};

			return virtualSelectOpts as VirtualSelectOpts;
		}
	}
}
