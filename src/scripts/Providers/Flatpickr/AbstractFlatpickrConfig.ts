/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr {
	export abstract class AbstractFlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		protected _flatpickrOpts: any;

		public DefaultDate: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnChange: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnClose: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnDayCreate: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnOpen: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnReady: any;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);

			// Check the given server date format config
			this._checkServerDateFormat();

			// Set the Flatpickr global configs
			this._setFlatpickrOpts();
		}

		// Method used to check if a given serverDateFormat matches with the expected type
		private _checkServerDateFormat(): void {
			if (Enum.ServerDateFromat[this.ServerDateFormat.replace(/[-/]/g, '')] === undefined) {
				throw new Error(`The given ServerDateFormat '${this.ServerDateFormat}' it's not allowed.`);
			}
		}

		// Method used to set all the global Flatpickr properties across the different types of instances
		private _setFlatpickrOpts(): void {
			let _altFormat = '';

			// Manage the AM/PM time when it's on use
			if (
				this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Disable ||
				this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Time24hFormat
			) {
				// Time must behave in 24h format
				_altFormat = this.InputDateFormat.replace('K', '');
			} else {
				// Time must behave in 12h format with AM/PM
				_altFormat = this.InputDateFormat.replace('H', 'h');
			}

			// eslint-disable-next-line prefer-const
			this._flatpickrOpts = {
				altFormat: _altFormat,
				altInput: true,
				dateFormat:
					this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Disable
						? this.ServerDateFormat + ' H:i:s'
						: this.ServerDateFormat,
				enableTime: this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Disable,
				time_24hr: this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Time24hFormat,
			};
		}
	}
}
