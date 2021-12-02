/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.DropdownSearch.VirtualSelect {
	export class VirtualSelectConfig extends OSUIFramework.Patterns.Dropdown.AbstractDropdownConfig {
		public ElementId: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
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

		// private _onSampleSelectServerSearch(searchValue, virtualSelect) {
		// 	console.log(searchValue, virtualSelect);
		// 	// virtualSelect.setServerOptions(newOptions);
		// }

		// private _sampleLabelRenderer(data) {
		// 	// console.log(data);
		// 	// console.log(data.index);
		// 	if (data.index === 49 /* amout of already loaded items */) {
		// 		console.log('LoadingMoreData!');
		// 	}

		// 	return `${data.label}`;
		// }

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				ele: this.ElementId,
				multiple: this.ShowCheckboxes,
				noOptionsText: this.DropdownPrompt,
				noSearchResultsText: this.NoResultsText,
				options: this.OptionsList,
				search: this.Type === OSUIFramework.Patterns.Dropdown.Enum.Type.Search,
				searchPlaceholderText: this.SearchText !== '' ? this.SearchText : 'Search...',
				selectedValue: this._getSelectedValues(),
				showValueAsTags: this.ShowCheckboxes && this.Type === OSUIFramework.Patterns.Dropdown.Enum.Type.Tags,
				textDirection: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,

				// hideClearButton: true,
				// onServerSearch: this._onSampleSelectServerSearch, // => Trigger the OnServerSearch
				// labelRenderer: this._sampleLabelRenderer, // => Add icon/image to each option
			};

			//Cleaning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}
	}
}
