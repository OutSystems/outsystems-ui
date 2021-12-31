/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.Virtual_Select {
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
		private _checkForFigType(index: number): Enum.FigureType {
			let hasImage = Enum.FigureType.None;

			// Check if image_url_or_class filed has info
			if (
				this.OptionsList[index].image_url_or_class !== undefined &&
				this.OptionsList[index].image_url_or_class !== ''
			) {
				// The given info doesn't have spaces on it, check if it's a valid URL
				hasImage = OSUIFramework.Helper.URL.IsImage(this.OptionsList[index].image_url_or_class)
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
			return `<img class="${Enum.CssClass.OptionItemImage}" src="${this.OptionsList[index].image_url_or_class}">`;
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
			const vsOptions = {
				ele: this.ElementId,
				hideClearButton: true,
				labelRenderer: this._getOptionInfo.bind(this),
				noOptionsText: this.NoResultsText,
				noSearchResultsText: this.NoResultsText,
				options: this.OptionsList,
				placeholder: this.Prompt,
				search: true,
				searchPlaceholderText: this.SearchPrompt,
				selectedValue: this._getSelectedValues(),
				textDirection: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,
			};

			return vsOptions as VirtualSelectOpts;
		}

		protected abstract _getSelectedValues(): string[];
	}
}
