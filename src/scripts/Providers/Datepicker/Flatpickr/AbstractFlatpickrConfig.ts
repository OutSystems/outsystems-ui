/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Datepicker.Flatpickr {
	/**
	 * Class that represents the custom configurations received by the Datepicker.
	 *
	 * @export
	 * @class AbstractFlatpickrConfig
	 * @extends {AbstractDatePickerConfig}
	 */
	export abstract class AbstractFlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		// Set the OnChange Event that will be defined in the specific context for each Flatpickr mode
		public OnChange: OSUIFramework.Callbacks.Generic;

		// Store the Server Date format that will be used to casting the selected dates into a knowned date by/for Flatpickr
		public ServerDateFormat: string;

		// Store calendar mode is in use
		public calendarMode: OSUIFramework.Patterns.DatePicker.Enum.Mode;

		constructor(config: JSON) {
			super(config);
		}

		// Method used to manage the AM/PM time when it's on use
		private _checkAltFormat(): string {
			// If DateFormat hasn't been defined, set the same format as server date
			let _altFormat = this.DateFormat !== '' ? this._mapProviderDateFormat() : this.ServerDateFormat;

			// Time must behave in 12h format with AM/PM or in 24h format
			if (this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time12hFormat) {
				_altFormat = _altFormat + ' - h:i K';
			} else if (this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time24hFormat) {
				_altFormat = _altFormat + ' - H:i';
			}

			return _altFormat;
		}

		// Method used to check the language and also map it into Flatpickr expected format
		private _checkLocale(): FlatpickrLocale {
			// FlatpickrLocale script file is already loaded
			// Set the locale in order to define the calendar language
			const _locale = window.flatpickr.l10ns[OSUIFramework.Helper.Language.ShortLang];
			// Set the calendar first week day
			_locale.firstDayOfWeek = this.FirstWeekDay;

			return _locale;
		}

		// Method used to check the serverDateFormat and map it into the Flatpickr expected format
		private _checkServerDateFormat(): void {
			this.ServerDateFormat = OSUIFramework.Helper.Dates.ServerFormat.replace('YYYY', 'Y')
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

		// Method used to set all the global Flatpickr properties across the different types of instances
		protected getCommonProviderConfigs(): FlatpickrOptions {
			// Check the given server date format config
			this._checkServerDateFormat();

			const _flatpickrOpts = {
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
				time_24hr: this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormatMode.Time24hFormat,
			};

			return _flatpickrOpts as FlatpickrOptions;
		}
	}
}
