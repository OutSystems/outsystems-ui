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
		// Store a list of disable days
		private _disabledDays = [];

		// Store a integer list of weekdays
		private _disabledWeekDays = [];

		// Store the language that will be assigned as a locale to the DatePicker
		private _lang: string;

		// Store the Provider Options
		private _providerOptions: FlatpickrOptions;

		// Store configs set using extensibility
		protected _providerExtendedOptions: FlatpickrOptions;

		// Stores the ability to allow inputs to be editable or not
		public AllowInput = false;

		// Store calendar mode is in use
		public CalendarMode: OSFramework.Patterns.DatePicker.Enum.Mode;

		// Stores the ability to disable a range of dates from datepicker
		public Disable = [];

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

		// Method to check if the weekday of date is inside of disable weekdays list
		private _checkDisableWeeksDay(date: Date): boolean {
			return this._disabledWeekDays.indexOf(date.getDay()) > -1;
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
				throw new Error(`${Flatpickr.ErrorCodes.FailSetLocale}: Locale '${this._lang}' not found!`);
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

		// Method to be used to disable days on datepicker, based on an array of dates
		private _setDisable() {
			this.Disable = [];

			// Check if there are weekdays to be disabled
			if (this._disabledWeekDays.length > 0) {
				this.Disable.push((date) => {
					return this._checkDisableWeeksDay(date);
				});
			}

			// Check if there are days to be disabled
			if (this._disabledDays.length > 0) {
				for (const date of this._disabledDays) {
					this.Disable.push(date);
				}
			}
		}

		/**
		 * Method used to get all the global Flatpickr properties across the different types of instances
		 *
		 * @return {*}  {FlatpickrOptions}
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickrConfig
		 */
		public getProviderConfig(): FlatpickrOptions {
			// Check the given server date format config
			this._checkServerDateFormat();

			// Check the disabled days to be applied on datepicker
			this._setDisable();

			this._providerOptions = {
				altFormat: this._checkAltFormat(),
				altInput: true,
				allowInput: this.AllowInput,
				disable: this.Disable.length === 0 ? undefined : this.Disable,
				disableMobile: this.DisableMobile,
				dateFormat:
					this.TimeFormat !== OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Disable
						? this.ServerDateFormat + ' H:i:s' // do not change 'H:i:s' since it's absoluted needed due to platform conversions!
						: this.ServerDateFormat,
				maxDate: OSFramework.Helper.Dates.IsNull(this.MaxDate) ? undefined : this.MaxDate,
				minDate: OSFramework.Helper.Dates.IsNull(this.MinDate) ? undefined : this.MinDate,
				onChange: this.OnChange,
				time_24hr: this.TimeFormat === OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time24hFormat,
				weekNumbers: this.ShowWeekNumbers,
			} as FlatpickrOptions;

			// Make sure locale is not undefined, as when defining the providerOptions defaults in the costructor, the window.locale is no yet available
			if (this._providerOptions.locale === undefined) {
				this._providerOptions.locale = this._checkLocale();
			}

			return this._providerOptions;
		}

		/**
		 * Method to set and save the extensibility provider configs
		 *
		 * @param {FlatpickrOptions} newConfigs
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickrConfig
		 */
		public setExtensibilityConfigs(newConfigs: FlatpickrOptions): void {
			this._providerExtendedOptions = newConfigs;
		}

		/**
		 * Getter that allows to obtain the DatePicker Locale language
		 *
		 * @readonly
		 * @type {string}
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickrConfig
		 */
		public get Lang(): string {
			return this._lang;
		}

		/**
		 * Set DatePicker Locale
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickrConfig
		 */
		public set Lang(value: string) {
			// substring is needed to avoid passing values like "en-EN" since we must use only "en"
			this._lang = value.substring(0, 2);
		}

		/**
		 * Set DisableDays
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickrConfig
		 */
		public set DisabledDays(value: string[]) {
			this._disabledDays = value;
		}

		/**
		 * Set DisableWeekDays
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickrConfig
		 */
		public set DisabledWeekDays(value: number[]) {
			this._disabledWeekDays = value;
		}
	}
}
