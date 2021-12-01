/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.DropdownSearch.VirtualSelect {
	export class VirtualSelectConfig extends OSUIFramework.Patterns.Dropdown.AbstractDropdownConfig {
		public ElementId: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
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
				showValueAsTags: true,
				// hideClearButton: true,
				// onServerSearch: this._onSampleSelectServerSearch, // => Trigger the OnServerSearch
				// selectedValue: [1161], // => Predefined selectec value
				// labelRenderer: this._sampleLabelRenderer, // => Add icon/image to each option
				multiple: true,
				allowNewOption: true,
				noOptionsText: this.DropdownPrompt,
				noSearchResultsText: this.NoResultsText,
				options: this.OptionsList,
				position: 'auto',
				search: true,
				searchPlaceholderText: this.SearchText !== '' ? this.SearchText : 'Search...',
				textDirection: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,
			};

			//Cleaning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}
	}
}
