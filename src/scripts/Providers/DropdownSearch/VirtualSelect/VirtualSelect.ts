// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DropdownSearch.VirtualSelect {
	/**
	 * Class that implements the Dropdown Search pattern using VirtualSelect as a provider.
	 *
	 * @export
	 * @class OSUIVirtualSelect
	 * @extends {AbstractDropdown<VirtualSelectConfig>}
	 * @implements {IDropdown, IProviderPattern<IVirtualSelect>}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelect
		extends OSUIFramework.Patterns.Dropdown.AbstractDropdown<VirtualSelectConfig>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements OSUIFramework.Patterns.Dropdown.IDropdown, OSUIFramework.Interface.IProviderPattern<IVirtualSelect>
	{
		// Store the provider reference
		public provider: VirtualScroll;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectConfig(configs));
		}

		private _createProviderInstance(): void {
			console.log('_createProviderInstance()');
			// this.provider = window.VirtualSelect.init({
			// 	ele: '#' + this._dropdownId,
			// 	options: this._configs.ItemList,
			// 	noOptionsText: this._configs.EmptyText,
			// 	noSearchResultsText: this._configs.NoResults,
			// 	searchPlaceholderText: this._configs.SearchPrompt,
			// });
		}

		// Method to set the html elements used
		private _setHtmlElements(): void {
			console.log('_setHtmlElements()');
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._createProviderInstance();

			super.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			console.log('changeProperty()', propertyName, propertyValue);
		}

		//Method to clear any selected values from the dropdown
		public clear(): void {
			console.log('clear()');
		}

		// Method to disable the dropdown
		public disable(): void {
			console.log('disable()');
		}

		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				console.log('dispose()');
			}

			super.dispose();
		}

		// Method to enable the dropdown
		public enable(): void {
			console.log('enable()');
		}

		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			console.log('registerProviderCallback()', eventName, callback);
		}
	}
}
