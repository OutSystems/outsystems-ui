/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Timepicker.Flatpickr {
	/**
	 * Class that represents the custom configurations received by the Timepicker.
	 *
	 * @export
	 * @class FlatpickrTimeConfig
	 * @extends {AbstractTimePickerConfig}
	 */
	export class FlatpickrTimeConfig extends OSFramework.Patterns.TimePicker.AbstractTimePickerConfig {
		// Store the language that will be assigned as a locale to the TimePicker
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

		// Method used to manage the AM/PM time when it's on use
		private _checkAltFormat(): string {
			let _altFormat;

			if (this.Is24Hours) {
				_altFormat = Enum.InputFormats.Format24h;
			} else {
				_altFormat = Enum.InputFormats.Format12h;
			}
			return _altFormat;
		}

		// Method used to check the language and also map it into Flatpickr expected format
		protected _checkLocale(): FlatpickrLocale {
			// FlatpickrLocale script file is already loaded
			let _locale: FlatpickrLocale;
			try {
				// Set the locale in order to define the calendar language
				_locale = window.flatpickr.l10ns[this._lang];

				// Set the calendar first week day
				_locale.firstDayOfWeek = this.FirstWeekDay;
			} catch (error) {
				throw new Error(`${Flatpickr.ErrorCodes.FailSetLocale}: Locale '${this._lang}' not found!`);
			}

			return _locale;
		}

		// Method used to set all the config properties for the Time mode type
		public getProviderConfig(): FlatpickrOptions {
			this._providerOptions = {
				altFormat: this._checkAltFormat(),
				altInput: true,
				allowInput: this.AllowInput,
				defaultDate: OSFramework.Helper.Times.IsNull(this.InitialTime) ? undefined : this.InitialTime,
				disableMobile: this.DisableMobile,
				enableTime: true,
				noCalendar: true,
				maxTime: OSFramework.Helper.Times.IsNull(this.MaxTime) ? undefined : this.MaxTime,
				minTime: OSFramework.Helper.Times.IsNull(this.MinTime) ? undefined : this.MinTime,
				dateFormat: Enum.InputFormats.Format24h,
				time_24hr: this.Is24Hours,
				onChange: this.OnChange,
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
		 * Getter that allows to obtain the TimePicker Locale language
		 *
		 * @readonly
		 * @type {string}
		 * @memberof AbstractFlatpickrConfig
		 */
		public get Lang(): string {
			return this._lang;
		}

		/**
		 * Set TimePicker Locale
		 *
		 * @memberof AbstractFlatpickrConfig
		 */
		public set Lang(value: string) {
			// substring is needed to avoid passing values like "en-EN" since we must use only "en"
			this._lang = value.substring(0, 2);
		}
	}
}
