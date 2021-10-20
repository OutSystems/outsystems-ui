// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickr
		extends OSUIFramework.Patterns.DatePicker.AbstractDatePicker<Flatpickr.FlatpickrConfig>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements OSUIFramework.Patterns.DatePicker.IDatePicker, OSUIFramework.Interface.IProviderPattern<Flatpickr>
	{
		// Store the provider target elem
		private _datePickerProviderElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnEnd: any;

		// Store the provider reference
		private _provider: Flatpickr;
		// Store the provider options
		private _providerOptions: FlatpickrOptions;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlatpickrConfig(configs));
		}

		// Method that will create the provider
		private _createProviderDatePicker(): void {
			console.log(`_createProviderDatePicker() ---- Still Here!`);

			// Set inital library options
			this._setInitialLibraryOptions();

			// Init provider
			this._provider = window.flatpickr(this._datePickerProviderElem, this._providerOptions);

			// Trigger platform's OnInitialize event (done by us, the library doesn't have a 'mount' event)
			this._setOnInitializedEvent();

			console.log(this._provider);
		}

		// Method to set the html elements used
		private _setHtmllElements(): void {
			console.log(`_setHtmllElements()`);

			this._datePickerProviderElem = document.getElementById(this._configs.InputWidgetId);
		}

		// Method to set the library options from the config
		private _setInitialLibraryOptions(): void {
			console.log(`_setInitialLibraryOptions()`);

			this._providerOptions = this._configs.getProviderConfig();
		}

		// Method to set the OnInitializeEvent
		private _setOnInitializedEvent(): void {
			console.log(`_setOnInitializedEvent() - Is This needed?`);
			// OSUIFramework.Helper.AsyncInvocation(this._onInitialize, this.widgetId);
		}

		public build(): void {
			super.build();

			this._setHtmllElements();

			this._createProviderDatePicker();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			console.log(`changeProperty(${propertyName}, ${propertyValue})`);
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				this._provider.destroy();
			}

			super.dispose();
		}

		// Provider getter
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		public get provider(): Flatpickr {
			return this._provider;
		}

		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			console.log(`registerProviderCallback(${eventName}, ${callback})`);
		}
	}
}
