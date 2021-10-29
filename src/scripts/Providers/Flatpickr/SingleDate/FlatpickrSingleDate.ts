/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.SingleDate {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		// Store the provider options
		private _flatpickrOptions: FlatpickrOptions;

		// RangeSlider events
		private _onChangeEvent: OSUIFramework.Callbacks.OSDatepickerOnChangeEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));

			// Set the default library Events
			this._configs.OnChange = this._onDateSelected.bind(this);
			// this._configs.OnClose = this._onClose.bind(this);
			this._configs.OnDayCreate = this._onDayCreate.bind(this);
			// this._configs.OnOpen = this._onOpen.bind(this);
			this._configs.OnReady = this._onReady.bind(this);
		}

		// private _addTodayBtn() {
		// 	const myBtn = document.createElement('button');
		// 	myBtn.innerHTML = 'Today';
		// 	myBtn.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._todayClick.bind(this));
		// 	this.Flatpickr.calendarContainer.appendChild(myBtn);
		// }

		// Method that will create the provider
		private _createProviderDatePicker(): void {
			console.log(`_createProviderDatePicker() => ${this._configs.Mode} mode`);

			// Set inital library options
			this._flatpickrOptions = this._configs.getProviderConfig();

			// Init provider
			this._flatpickr = window.flatpickr(this._datePickerProviderElem, this._flatpickrOptions);

			// this._addTodayBtn();
		}

		// Method that will be triggered by library each time calendar is closed
		private _onClose(selectedDates: [], dateStr: string): void {
			console.log('onClose', selectedDates, dateStr);
		}

		// Method that will be triggered by library each time any date is selected
		private _onDateSelected(selectedDates: string[], dateStr: string, fp: Flatpickr): void {
			/* NOTE: dateStr param is not in use since the library has an issue arround it */

			// Trigger platform's onChange callback event
			OSUIFramework.Helper.AsyncInvocation(
				this._onChangeEvent,
				this.widgetId,
				fp.formatDate(selectedDates[0], this._flatpickrOptions.dateFormat)
			);

			console.log('_onDateSelected', fp.formatDate(selectedDates[0], this._flatpickrOptions.dateFormat));
		}

		// Method that will be responsible to show if a day has an Event
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _onDayCreate(dObj: [], dStr: string, fp: Flatpickr, dayElem: any) {
			// Get each day date
			// console.log(fp.formatDate(dayElem.dateObj, this._configs.ServerDateFormat));
		}

		// Method that will be triggered by library each time calendar is opened
		private _onOpen(selectedDates: [], dateStr: string): void {
			console.log('onOpen', selectedDates, dateStr);
		}

		// Method that will be triggered by library each time calendar is ready
		private _onReady(selectedDates: [], dateStr: string): void {
			// console.log('onReady', selectedDates, dateStr);

			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._datePickerProviderElem.nextSibling as HTMLElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSUIFramework.Helper.Attribute.Set(this._flatpickrInputElem, 'data-input', '');

			// Trigger platform's onChange event
			// OSUIFramework.Helper.AsyncInvocation(this._onChangeEvent, this.widgetId);
		}

		// private _todayClick() {
		// 	this.Flatpickr.jumpToDate(this.Flatpickr.now);
		// }

		public build(): void {
			super.build();

			this._createProviderDatePicker();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			console.log(`changeProperty(${propertyName}, ${propertyValue})`);
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			super.dispose();
		}

		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnChange:
					this._onChangeEvent = callback;
					break;
			}
		}
	}
}
