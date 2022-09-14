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

		// Stores the ability to disable the mobile flatpickr behavior. False is the default provider option
		public DisableMobile = true;

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
		private _checkDateFormat(): string {
			// If DateFormat hasn't been defined, set the same format as server date
			return this.DateFormat !== '' ? this._mapProviderDateFormat() : this.ServerDateFormat;
		}

		// Method used to check the language and also map it into Flatpickr expected format
		private _checkLocale(): FlatpickrLocale {
			// FlatpickrLocale script file is already loaded
			let _locale: FlatpickrLocale;
			try {
				// Set the locale in order to define the calendar language
				_locale = window.flatpickr.l10ns[this._lang];
			} catch (error) {
				throw new Error(`${Flatpickr.ErrorCodes.FailSetLocale}: Locale '${this._lang}' not found!`);
			}

			return _locale;
		}

		// Method used to check the serverDateFormat and map it into the Flatpickr expected format
		private _checkServerDateFormat(): void {
			this.ServerDateFormat = OSFramework.Helper.Dates.ServerFormat.replace('YYYY', 'Y')
				.replace('MM', 'm')
				.replace('DD', '');
		}

		// Method to get a valid Date from the month and year configs
		private _getDateFromMonthYear(monthYear: MonthYear): Date {
			const _monthIndex = OSFramework.Constants.Months.indexOf(monthYear.Month);
			const _validatedYear = monthYear.Year < 1900 ? null : monthYear.Year;
			let _newDate = null;

			if (_monthIndex !== -1 && _validatedYear !== null) {
				_newDate = new Date(_validatedYear, _monthIndex, 1);
			} else {
				console.warn(
					`The passed Month and/or Year is not valid: {Month: ${monthYear.Month} | Year: ${monthYear.Year} }, please review the values on parameters ${OSFramework.Patterns.MonthPicker.Enum.Properties.InitialMonth}, ${OSFramework.Patterns.MonthPicker.Enum.Properties.MinMonth} and ${OSFramework.Patterns.MonthPicker.Enum.Properties.MaxMonth}`
				);
			}

			return _newDate;
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
				}
			}

			return this.DateFormat;
		}
		// Method used to set all the config properties for the Month mode type
		public getProviderConfig(): FlatpickrOptions {
			this._checkServerDateFormat();
			this._checkDateFormat();

			this._providerOptions = {
				altInput: true,
				dateFormat: this.ServerDateFormat,
				defaultDate: this._getDateFromMonthYear(this.InitialMonth),
				disableMobile: this.DisableMobile,
				maxDate: this._getDateFromMonthYear(this.MaxMonth),
				minDate: this._getDateFromMonthYear(this.MinMonth),
				onChange: this.OnChange,
				plugins: [
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					new monthSelectPlugin({
						dateFormat: this.ServerDateFormat,
						altFormat: this.DateFormat,
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
	}
}
