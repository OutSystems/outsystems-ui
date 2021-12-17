/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr {
	/**
	 * Class that represents the custom configurations received by the Datepicker.
	 *
	 * @export
	 * @class AbstractFlatpickrConfig
	 * @extends {AbstractDatePickerConfig}
	 */
	export abstract class AbstractFlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		// Store the Locale that will be used to set the Datepicker language
		protected _flatpickrLocale: FlatpickrLocale;

		// Store the Flatpickr configs that will be used to create the Flatpickr instance
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		protected _flatpickrOpts: any;

		// Store the default date that will be assigned to the calendar
		public DefaultDate = [];

		// Set the OnChange Event that will be defined in the specific context for each Flatpickr mode
		public OnChange: OSUIFramework.Callbacks.Generic;

		// Store the Server Date format that will be used to casting the selected dates into a knowned date by/for Flatpickr
		public ServerDateFormat: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}

		// Method used to abstract DateFormat style and map it into Flatpickr expected one
		private _abstractDateFormat(): string {
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

		// Method used to manage the AM/PM time when it's on use
		private _checkAltFormat(): string {
			// If DateFormat hasn't been defined, set the same format as server date
			let _altFormat = this.DateFormat !== '' ? this._abstractDateFormat() : this.ServerDateFormat;

			// Time must behave in 24h format
			if (this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time24hFormat) {
				_altFormat = _altFormat + ' - H:i';
			}

			// Time must behave in 12h format with AM/PM
			if (this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time12hFormat) {
				_altFormat = _altFormat + ' - h:i K';
			}

			return _altFormat;
		}

		// Method used to check the language and also map it into Flatpickr expected format
		private _checkLocale(): string {
			const _locale = OSUIFramework.Helper.Language.Lang.substring(0, 2)
				? OSUIFramework.Helper.Language.Lang.substring(0, 2)
				: 'en';

			// FlatpickrLocale script file is already loaded
			// Set the locale in order to define the calendar language
			this._flatpickrLocale = window.flatpickr.l10ns[_locale];
			// Set the calendar first week day
			this._flatpickrLocale.firstDayOfWeek = this.FirstWeekDay;

			return _locale;
		}

		// Method used to check the serverDateFormat and map it into the Flatpickr expected format
		private _checkServerDateFormat(): void {
			this.ServerDateFormat = OSUIFramework.Helper.Dates.ServerFormat.replace('YYYY', 'Y')
				.replace('MM', 'm')
				.replace('DD', 'd');
		}

		// Method used to set all the global Flatpickr properties across the different types of instances
		protected _getFlatpickrOpts(): FlatpickrOptions {
			// Check the given server date format config
			this._checkServerDateFormat();

			this._flatpickrOpts = {
				altFormat: this._checkAltFormat(),
				altInput: true,
				dateFormat:
					this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Disable
						? this.ServerDateFormat + ' H:i'
						: this.ServerDateFormat,
				enableTime: this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Disable,
				locale: this._checkLocale(),
				maxDate: OSUIFramework.Helper.Dates.IsNull(this.MaxDate) ? undefined : this.MaxDate,
				minDate: OSUIFramework.Helper.Dates.IsNull(this.MinDate) ? undefined : this.MinDate,
				onChange: this.OnChange,
				showMonths: this.ShowMonths,
				time_24hr: this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time24hFormat,
				weekNumbers: this.ShowWeekNumbers,
			};

			return this._flatpickrOpts;
		}
	}
}
