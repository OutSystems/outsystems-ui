/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Datepicker.Flatpickr {
	/**
	 * Class that represents the custom configurations received by the Datepicker.
	 *
	 * @export
	 * @class AbstractFlatpickrConfig
	 * @extends {AbstractDatePickerConfig}
	 */
	export abstract class AbstractFlatpickrConfig extends OSFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		// Store the language that will be assigned as a locale to the DatePicker
		private _lang: string;

		// Store configs set using extensibility
		private _providerExtendedOptions: FlatpickrOptions;

		// Store the Provider Options
		private _providerOptions: FlatpickrOptions;

		// Stores the ability to allow inputs to be editable or not
		public AllowInput = false;

		// Store calendar mode is in use
		public CalendarMode: OSFramework.Patterns.DatePicker.Enum.Mode;

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
			// If DateFormat hasn't been defined, set the same format as server date
			let _altFormat = this.DateFormat !== '' ? this._mapProviderDateFormat() : this.ServerDateFormat;

			// Time must behave in 12h format with AM/PM or in 24h format
			if (this.TimeFormat === OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time12hFormat) {
				_altFormat = _altFormat + ' - h:i K';
			} else if (this.TimeFormat === OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time24hFormat) {
				_altFormat = _altFormat + ' - H:i';
			}

			return _altFormat;
		}

		// Method used to check the language and also map it into Flatpickr expected format
		private _checkLocale(): FlatpickrLocale {
			// FlatpickrLocale script file is already loaded
			let _locale: FlatpickrLocale;
			try {
				// Set the locale in order to define the calendar language
				_locale = window.flatpickr.l10ns[this._lang];

				// Set the calendar first week day
				_locale.firstDayOfWeek = this.FirstWeekDay;
			} catch (error) {
				console.log(error);
			}

			return _locale;
		}

		// Method used to check the serverDateFormat and map it into the Flatpickr expected format
		private _checkServerDateFormat(): void {
			this.ServerDateFormat = OSFramework.Helper.Dates.ServerFormat.replace('YYYY', 'Y')
				.replace('MM', 'm')
				.replace('DD', 'd');
		}

		// Method used to mapping DateFormat style and map it into Flatpickr expected one
		private _mapProviderDateFormat(): string {
			const _dateFormat = this.DateFormat.replace(/[^a-zA-Z]/g, ' ').split(' ');
			for (const format of _dateFormat) {
				switch (format) {
					// Map Year
					case 'YYYY':
						this.DateFormat = this.DateFormat.replace('YYYY', 'Y');
						break;

					case 'YY':
						this.DateFormat = this.DateFormat.replace('YY', 'y');
						break;

					// Map Month
					case 'MMM':
						this.DateFormat = this.DateFormat.replace('MMM', 'M');
						break;

					case 'MM':
						this.DateFormat = this.DateFormat.replace('MM', 'm');
						break;

					// Map Day
					case 'DDD':
						this.DateFormat = this.DateFormat.replace('DDD', 'D');
						break;

					case 'DD':
						this.DateFormat = this.DateFormat.replace('DD', 'd');
						break;
				}
			}

			return this.DateFormat;
		}

		/**
		 * Method used to get all the global Flatpickr properties across the different types of instances
		 *
		 * @return {*}  {FlatpickrOptions}
		 * @memberof AbstractFlatpickrConfig
		 */
		public getCommonProviderConfigs(): FlatpickrOptions {
			// Check the given server date format config
			this._checkServerDateFormat();

			this._providerOptions = {
				altFormat: this._checkAltFormat(),
				altInput: true,
				allowInput: this.AllowInput,
				disableMobile: this.DisableMobile,
				dateFormat:
					this.TimeFormat !== OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Disable
						? this.ServerDateFormat + ' H:i'
						: this.ServerDateFormat,
				maxDate: OSFramework.Helper.Dates.IsNull(this.MaxDate) ? undefined : this.MaxDate,
				minDate: OSFramework.Helper.Dates.IsNull(this.MinDate) ? undefined : this.MinDate,
				onChange: this.OnChange,
				time_24hr: this.TimeFormat === OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time24hFormat,
				weekNumbers: this.ShowWeekNumbers,
			} as FlatpickrOptions;

			// Make sure locale is not undefined, as when definig the providerOptions defaults in the costructor, the window.locale is no yet available
			if (this._providerOptions.locale === undefined) {
				this._providerOptions.locale = this._checkLocale();
			}

			return this.mergeConfigs(this._providerOptions, this._providerExtendedOptions);
		}

		/**
		 * Method to validate and save the external provider configs
		 *
		 * @param {FlatpickrOptions} newConfigs
		 * @param {ProviderInfo} providerInfo
		 * @memberof AbstractFlatpickrConfig
		 */
		public validateExtensibilityConfigs(newConfigs: FlatpickrOptions, providerInfo: ProviderInfo): void {
			this._providerExtendedOptions = super.validateExtensibilityConfigs(newConfigs, providerInfo);
		}

		/**
		 * Getter that allows to obtain the DatePicker Locale language
		 *
		 * @readonly
		 * @type {string}
		 * @memberof AbstractFlatpickrConfig
		 */
		public get Lang(): string {
			return this._lang;
		}

		/**
		 * Set DatePicker Locale
		 *
		 * @memberof AbstractFlatpickrConfig
		 */
		public set Lang(value: string) {
			// substring is needed to avoid passing values like "en-EN" since we must use only "en"
			this._lang = value.substring(0, 2);
		}
	}
}
