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

			// Set the Flatpickr global configs
			this._setFlatpickrOpts();
		}

		// Method used to manage the AM/PM time when it's on use
		private _checkAltFormat(): string {
			let _altFormat = '';

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

			return _altFormat;
		}

		// Method used to check if a given serverDateFormat matches with the expected type
		private _checkServerDateFormat(): void {
			if (Enum.ServerDateFromat[this.ServerDateFormat.replace(/[-/]/g, '')] === undefined) {
				throw new Error(`The given ServerDateFormat '${this.ServerDateFormat}' it's not allowed.`);
			}
		}

		// Method used to get the proper disable dates info, since they could be an array of dates or an array of ranges (from, to) dates
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _getDisableDates(): any[] {
			let _disableDates = [];

			// Check the proper value to set at disable dates
			if (
				this.AdvancedConfigs.flatpickr.disableDates.length > 0 &&
				this.AdvancedConfigs.flatpickr.disableDatesRange.length === 0
			) {
				_disableDates = this.AdvancedConfigs.flatpickr.disableDates;
			} else if (
				this.AdvancedConfigs.flatpickr.disableDates.length === 0 &&
				this.AdvancedConfigs.flatpickr.disableDatesRange.length > 0
			) {
				_disableDates = this.AdvancedConfigs.flatpickr.disableDatesRange;
			}

			return _disableDates;
		}

		// Method used to get the proper enable dates info, since they could be an array of dates or an array of ranges (from, to) dates
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _getEnableDates(): any[] {
			let _enableDates = [];

			// Check the proper value to set at disable dates
			if (
				this.AdvancedConfigs.flatpickr.enableDates.length > 0 &&
				this.AdvancedConfigs.flatpickr.enableDatesRange.length === 0
			) {
				_enableDates = this.AdvancedConfigs.flatpickr.enableDates;
			} else if (
				this.AdvancedConfigs.flatpickr.enableDates.length === 0 &&
				this.AdvancedConfigs.flatpickr.enableDatesRange.length > 0
			) {
				_enableDates = this.AdvancedConfigs.flatpickr.enableDatesRange;
			}

			return _enableDates;
		}

		// Method used to check if for some reason user is passing Enable and Disable dates at the same time
		private _hasEnableAndDisableDates(): void {
			if (
				(this.AdvancedConfigs.flatpickr.disableDates.length > 0 ||
					this.AdvancedConfigs.flatpickr.disableDatesRange.length > 0) &&
				(this.AdvancedConfigs.flatpickr.enableDates.length > 0 ||
					this.AdvancedConfigs.flatpickr.enableDatesRange.length > 0)
			) {
				throw new Error(
					`${OSUIFramework.GlobalEnum.PatternsNames.Datepicker}: Enable and Disable Dates can not be used at the same time.`
				);
			}
		}

		// Method used to set all the global Flatpickr properties across the different types of instances
		private _setFlatpickrOpts(): void {
			// Check the given server date format config
			this._checkServerDateFormat();

			// Chech if Enable and Disable dates are both defined
			this._hasEnableAndDisableDates();

			// eslint-disable-next-line prefer-const
			this._flatpickrOpts = {
				altFormat: this._checkAltFormat(),
				altInput: true,
				disable: this._getDisableDates().length > 0 ? this._getDisableDates() : undefined,
				enable: this._getEnableDates().length > 0 ? this._getEnableDates() : undefined,
				enableTime: this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Disable,
				locale: {
					firstDayOfWeek: this.OptionalConfigs.firstWeekDay,
				},
				maxDate: OutSystems.OSUI.Utils.IsNullDate(this.OptionalConfigs.maxDate)
					? undefined
					: this.OptionalConfigs.maxDate,
				minDate: OutSystems.OSUI.Utils.IsNullDate(this.OptionalConfigs.minDate)
					? undefined
					: this.OptionalConfigs.minDate,
				dateFormat:
					this.TimeFormat !== OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Disable
						? this.ServerDateFormat + ' H:i:s'
						: this.ServerDateFormat,
				showMonths: this.OptionalConfigs.showMonths,
				time_24hr: this.TimeFormat === OSUIFramework.Patterns.DatePicker.Enum.TimeFormat.Time24hFormat,
			};
		}
	}
}
