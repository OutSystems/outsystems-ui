/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr {
	export abstract class AbstractFlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		protected _flatpickrOpts: any;
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

			this._setFlatpickrOpts();
		}

		// Method used to set all the global Flatpickr properties across the different types of instances
		private _setFlatpickrOpts(): void {
			// eslint-disable-next-line prefer-const
			this._flatpickrOpts = {
				altFormat: this.Show24HourFormat
					? this.InputDateFormat.replace('K', '')
					: this.InputDateFormat.replace('H', 'h'),
				altInput: true,
				dateFormat: this.ShowTime ? this.ServerDateFormat + ' H:i:s' : this.ServerDateFormat,
				enableTime: this.ShowTime,
				time_24hr: this.Show24HourFormat,
			};
		}

		// Method used to check if a given serverDateFormat matches with the expected type
		protected _checkServerDateFormat(dateFormat: string): boolean {
			return Enum.ServerDateFromat[dateFormat.replace(/[-/]/g, '')] !== undefined;
		}
	}
}
