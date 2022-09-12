/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.MonthPicker.Flatpickr {
	/**
	 * Class that represents the custom configurations received by the Monthpicker.
	 *
	 * @export
	 * @class FlatpickrMonthConfig
	 * @extends {AbstractFlatpickrConfig}
	 */
	export class FlatpickrMonthConfig extends OSFramework.Patterns.MonthPicker.AbstractMonthPickerConfig {
		// Store the language that will be assigned as a locale to the MonthPicker
		private _lang: string;

		// Store the Provider Options
		private _providerOptions: FlatpickrOptions;

		// Store configs set using extensibility
		protected _providerExtendedOptions: FlatpickrOptions;

		// Stores the ability to allow inputs to be editable or not
		public AllowInput = false;

		// Stores the ability to disable the mobile flatpickr behavior. False is the default provider option
		public DisableMobile = false;

		// Set the OnChange Event that will be defined in the specific context for each Flatpickr mode
		public OnChange: OSFramework.GlobalCallbacks.Generic;

		// Store the Server Date format that will be used to casting the selected dates into a knowned date by/for Flatpickr
		public ServerDateFormat: string;

		constructor(config: JSON) {
			super(config);

			// Set the lang based on the language that has been defined already
			this._lang = OSFramework.Helper.Language.ShortLang;
		}

		// Method used to check the language and also map it into Flatpickr expected format
		protected _checkLocale(): FlatpickrLocale {
			// FlatpickrLocale script file is already loaded
			let _locale: FlatpickrLocale;

			return _locale;
		}

		// Method used to set all the config properties for the Month mode type
		public getProviderConfig(): FlatpickrOptions {
			this._providerOptions = {
				altInput: true,
				dateFormat: 'm.y',
				//defaultDate: OSFramework.Helper.Times.IsNull(this.initialMonth) ? undefined : this.initialMonth,
				defaultDate: new Date(),
				//maxDate: OSFramework.Helper.Dates.IsNull(this.maxMonth) ? undefined : this.maxMonth,
				//minDate: OSFramework.Helper.Dates.IsNull(this.minMonth) ? undefined : this.minMonth,
				onChange: this.OnChange,
				plugins: [
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					new monthSelectPlugin({
						shorthand: true, //defaults to false
						dateFormat: 'm.y', //defaults to "F Y"
						altFormat: 'F Y', //defaults to "F Y"
					}),
				],
			} as FlatpickrOptions;

			// Make sure locale is not undefined, as when definig the providerOptions defaults in the costructor, the window.locale is no yet available
			if (this._providerOptions.locale === undefined) {
				this._providerOptions.locale = this._checkLocale();
			}

			return this.mergeConfigs(this._providerOptions, undefined, this._providerExtendedOptions);
		}

		/**
		 * Method to set and save the extensibility provider configs
		 *
		 * @param {FlatpickrOptions} newConfigs
		 * @memberof AbstractFlatpickrConfig
		 */
		public setExtensibilityConfigs(newConfigs: FlatpickrOptions): void {
			this._providerExtendedOptions = newConfigs;
		}

		/**
		 * Getter that allows to obtain the MonthPicker Locale language
		 *
		 * @readonly
		 * @type {string}
		 * @memberof AbstractFlatpickrConfig
		 */
		public get Lang(): string {
			return this._lang;
		}

		/**
		 * Set MonthPicker Locale
		 *
		 * @memberof AbstractFlatpickrConfig
		 */
		public set Lang(value: string) {
			// substring is needed to avoid passing values like "en-EN" since we must use only "en"
			this._lang = value.substring(0, 2);
		}

		// Method that validates if a given property can be changed.
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			// Block updating InitialMonth after pattern is built (OnParameters Change)!
			if (isBuilt) {
				return key !== OSFramework.Patterns.MonthPicker.Enum.Properties.InitialMonth;
			}
			return true;
		}
	}
}
