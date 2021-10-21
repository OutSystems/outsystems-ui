/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr {
	export class FlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnChange: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnClose: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnOpen: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public OnReady: any;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				// altFormat: '',
				// altInput: '',
				// altInputClass: '',
				// allowInput: '',
				// allowInvalidPreload: '',
				// appendTo: '',
				// ariaDateFormat: '',
				// conjunction: '',
				// clickOpens: '',
				dateFormat: this.DateFormat,
				defaultDate: this.DefaultDate,
				// defaultHour: '',
				// defaultMinute: '',
				// disable: '',
				// disableMobile: '',
				// enable: '',
				// enableTime: '',
				// enableSeconds: '',
				// formatDate: '',
				// hourIncrement: '',
				// inline: true,
				// maxDate: '',
				// minDate: '',
				// minuteIncrement: '',
				// mode: this.Mode,
				mode: 'range',
				// nextArrow: '',
				// noCalendar: '',
				onChange: this.OnChange,
				onClose: this.OnClose,
				onOpen: this.OnOpen,
				onReady: this.OnReady,
				// parseDate: '',
				// position: '',
				// positionElement: '',
				// prevArrow: '',
				// shorthandCurrentMonth: '',
				// static: '',
				// showMonths: '',
				// time_24hr: '',
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
