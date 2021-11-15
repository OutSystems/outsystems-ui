/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr {
	export abstract class AbstractFlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		protected _flatpickrLocale: FlatpickrLocale;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		protected _flatpickrOpts: any;

		public DefaultDate: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnChange: any;
		public ServerDateFormat: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}

		// Method used to abstract DateFormat style and map it into flatpickr expected one
		private _abstractDateFormat(): string {
			const _dateFormat = this.DateFormat.replace(/[^a-zA-Z]/g, ' ').split(' ');
			for (let i = 0; i < _dateFormat.length; ++i) {
				switch (_dateFormat[i]) {
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

					// Map Month
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
			if (this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Time24hFormat) {
				_altFormat = _altFormat + ' H:i';
			}

			// Time must behave in 12h format with AM/PM
			if (this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Time12hFormat) {
				_altFormat = _altFormat + ' h:i K';
			}

			return _altFormat;
		}

		// Method used to check the serverDateFormat and set it into the Flatpickr expected format
		private _checkServerDateFormat(): void {
			this.ServerDateFormat = OSUIFramework.Helper.Dates.serverFormat
				.replace('YYYY', 'Y')
				.replace('MM', 'm')
				.replace('dd', 'd');
		}

		// Method used to set all the global Flatpickr properties across the different types of instances
		protected _getFlatpickrOpts(): FlatpickrOptions {
			// Check the given server date format config
			this._checkServerDateFormat();

			const _locale = 'en';
			this._flatpickrLocale = window.flatpickr.l10ns[_locale];
			this._flatpickrLocale.firstDayOfWeek = this.OptionalConfigs.firstWeekDay;
			// console.log('Changed LOCALE', this._flatpickrLocale);

			// eslint-disable-next-line prefer-const
			this._flatpickrOpts = {
				altFormat: this._checkAltFormat(),
				altInput: true,
				enableTime: this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Disable,
				locale: _locale,
				maxDate: OSUIFramework.Helper.Dates.IsNull(this.OptionalConfigs.maxDate)
					? undefined
					: this.OptionalConfigs.maxDate,
				minDate: OSUIFramework.Helper.Dates.IsNull(this.OptionalConfigs.minDate)
					? undefined
					: this.OptionalConfigs.minDate,
				dateFormat:
					this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Disable
						? this.ServerDateFormat + ' H:i:s'
						: this.ServerDateFormat,
				showMonths: this.OptionalConfigs.showMonths,
				time_24hr: this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Time24hFormat,
				weekNumbers: this.OptionalConfigs.showWeekNumbers,
			};

			return this._flatpickrOpts;
		}
	}
}
