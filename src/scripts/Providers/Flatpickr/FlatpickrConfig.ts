/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr {
	export class FlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		public AdvancedConfigs: FlatPickerAdvancedConfig;
		public Mode: string;
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
		}

		// Method used to check if a given serverDateFormat matches with the expected type
		private _checkServerDateFormat(dateFormat: string): boolean {
			return Enum.ServerDateFromat[dateFormat.replace(/[-/]/g, '')] !== undefined;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// Check if it's a valid ServerDateFormat
			if (!this._checkServerDateFormat(this.ServerDateFormat)) {
				throw new Error(`The given ServerDateFormat '${this.ServerDateFormat}' it's not allowed.`);
			}

			// eslint-disable-next-line prefer-const
			let providerOptions = {
				altFormat: this.Show24HourFormat
					? this.InputDateFormat.replace('K', '')
					: this.InputDateFormat.replace('H', 'h'),
				altInput: true,
				// altInputClass: '',
				// allowInput: true,
				// allowInvalidPreload: '',
				// appendTo: '',
				// ariaDateFormat: '',
				// conjunction: '',
				// clickOpens: '',
				dateFormat: this.ShowTime ? this.ServerDateFormat + ' H:i:s' : this.ServerDateFormat,
				defaultDate: this.Mode === Enum.FlatPickerMode.Single ? this.DefaultDate : this.DefaultDate.split(','),
				// defaultHour: '',
				// defaultMinute: '',
				// disable: '',
				// disableMobile: '',
				// enable: '',
				enableTime: this.ShowTime,
				// enableTime: true,
				// enableSeconds: '',
				// formatDate: '',
				// hourIncrement: '',
				// inline: true,
				// maxDate: '',
				// minDate: '',
				// minuteIncrement: '',
				mode: this.Mode,
				// nextArrow: '',
				// noCalendar: true,
				onChange: this.OnChange,
				onClose: this.OnClose,
				onDayCreate: this.OnDayCreate,
				onOpen: this.OnOpen,
				onReady: this.OnReady,
				// parseDate: '',
				// position: '',
				// positionElement: '',
				// prevArrow: '',
				// shorthandCurrentMonth: '',
				// static: true,
				// showMonths: true,
				time_24hr: this.Show24HourFormat,
				// weekNumbers: '',
				// wrap: '',
				// monthSelectorType: '',
			};

			//Cleanning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}
	}
}
