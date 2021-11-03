/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.SingleDate {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		// Store the provider options
		private _flatpickrOpts: FlatpickrOptions;

		// RangeSlider events
		private _onChangeCallbackEvent: OSUIFramework.Callbacks.OSDatepickerOnChangeEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));

			// Set the default library Event handlers
			this._configs.OnChange = this._onDateSelectedEvent.bind(this);
			this._configs.OnClose = this._onCloseEvent.bind(this);
			this._configs.OnDayCreate = this._onDayCreateEvent.bind(this);
			this._configs.OnOpen = this._onOpenEvent.bind(this);
		}

		// Method that will create the provider
		private _createProviderDatePicker(): void {
			console.log(`_createProviderDatePicker() => '${this._configs.Type}' Type`);

			// Set inital library options
			this._flatpickrOpts = this._configs.getProviderConfig();

			// Init provider
			this._flatpickr = window.flatpickr(this._datePickerProviderElem, this._flatpickrOpts);

			// Add TodayBtn
			if (this._configs.ShowTodayButton) {
				this._addTodayBtn();
			}

			// Instance has been Created!
			super._onReady();
		}

		// Method that will be triggered by library each time calendar is closed
		private _onCloseEvent(): void {
			super._onClose();
		}

		// Method that will be triggered by library each time any date is selected
		private _onDateSelectedEvent(selectedDates: string[], dateStr: string, fp: Flatpickr): void {
			/* NOTE: dateStr param is not in use since the library has an issue arround it */
			let _selectedDate = '';

			// Check if any date has been selected, In case of Clear this will retunr empty array
			if (selectedDates.length > 0) {
				_selectedDate = fp.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
			}

			// Trigger platform's onChange callback event
			OSUIFramework.Helper.AsyncInvocation(this._onChangeCallbackEvent, this.widgetId, _selectedDate);

			console.log('_onDateSelected', _selectedDate);
		}

		// Trigger the method that will check if a given day should have an Event
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _onDayCreateEvent(dObj: [], dStr: string, fp: Flatpickr, dayElem: any) {
			super._onDayCreated(fp, dayElem);
		}

		// Method that will be triggered by library each time calendar is opened
		private _onOpenEvent(): void {
			super._onOpen();
		}

		public build(): void {
			super.build();

			this._createProviderDatePicker();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			console.log(`changeProperty(${propertyName}, ${propertyValue})`);
			// switch (propertyName) {
			// 	case 'PROP':
			// 		console.log('Stuff @here!');
			// 		break;

			// 	default:
			// 		super.changeProperty(propertyName, propertyValue);
			// 		break;
			// }
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			super.dispose();
		}

		// Method used to regist callback events
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnChange:
					this._onChangeCallbackEvent = callback;
					break;
				default:
					super._registerProviderCallback(eventName, callback);
					break;
			}
		}
	}
}
