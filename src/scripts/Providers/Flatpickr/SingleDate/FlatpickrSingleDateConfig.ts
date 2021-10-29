/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.SingleDate {
	export class FlatpickrSingleDateConfig extends AbstractFlatpickrConfig {
		public AdvancedConfigs: FlatPickerAdvancedConfig;
		public Mode: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// Check if it's a valid ServerDateFormat
			if (!this._checkServerDateFormat(this.ServerDateFormat)) {
				throw new Error(`The given ServerDateFormat '${this.ServerDateFormat}' it's not allowed.`);
			}

			// eslint-disable-next-line prefer-const
			let fpSingleDateOpts = {
				// altInputClass: '',
				// allowInput: true,
				// allowInvalidPreload: '',
				// appendTo: '',
				// ariaDateFormat: '',
				// conjunction: '',
				// clickOpens: '',
				defaultDate: this.DefaultDate,
				// defaultHour: '',
				// defaultMinute: '',
				// disable: '',
				// disableMobile: '',
				// enable: '',
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
				// weekNumbers: '',
				// wrap: '',
				// monthSelectorType: '',
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			const fpOptions = {
				...this._flatpickrOpts,
				...fpSingleDateOpts,
			};

			//Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}
	}
}
