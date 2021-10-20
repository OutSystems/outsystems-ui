/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr {
	export class FlatpickrConfig extends OSUIFramework.Patterns.DatePicker.AbstractDatePickerConfig {
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
				// dateFormat: '',
				// defaultDate: '',
				// defaultHour: '',
				// defaultMinute: '',
				// disable: '',
				// disableMobile: '',
				// enable: '',
				// enableTime: '',
				// enableSeconds: '',
				// formatDate: '',
				// hourIncrement: '',
				// inline: '',
				// maxDate: '',
				// minDate: '',
				// minuteIncrement: '',
				// mode: '',
				// nextArrow: '',
				// noCalendar: '',
				// onChange: '',
				// onClose: '',
				// onOpen: '',
				// onReady: '',
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
