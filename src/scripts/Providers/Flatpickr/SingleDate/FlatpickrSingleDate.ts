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
		private _onCloseCallbackEvent: OSUIFramework.Callbacks.OSGeneric;
		private _onInitializeCallbackEvent: OSUIFramework.Callbacks.OSGeneric;
		private _onOpenCallbackEvent: OSUIFramework.Callbacks.OSGeneric;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));

			// Set the default library Events
			this._configs.OnChange = this._onDateSelected.bind(this);
			this._configs.OnClose = this._onClose.bind(this);
			this._configs.OnDayCreate = this._onDayCreate.bind(this);
			this._configs.OnOpen = this._onOpen.bind(this);
			this._configs.OnReady = this._onReady.bind(this);
		}

		// Method that will create the provider
		private _createProviderDatePicker(): void {
			console.log(`_createProviderDatePicker() => ${this._configs.Mode} mode`);

			// Set inital library options
			this._flatpickrOpts = this._configs.getProviderConfig();

			// Init provider
			this._flatpickr = window.flatpickr(this._datePickerProviderElem, this._flatpickrOpts);

			// Add TodayBtn
			// this._addTodayBtn();
		}

		// Method that will be triggered by library each time calendar is closed
		private _onClose(): void {
			// Trigger platform's OnCloseHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onCloseCallbackEvent, this.widgetId);
		}

		// Method that will be triggered by library each time any date is selected
		private _onDateSelected(selectedDates: string[], dateStr: string, fp: Flatpickr): void {
			/* NOTE: dateStr param is not in use since the library has an issue arround it */

			// Trigger platform's onChange callback event
			OSUIFramework.Helper.AsyncInvocation(
				this._onChangeCallbackEvent,
				this.widgetId,
				fp.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat)
			);

			console.log('_onDateSelected', fp.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat));
		}

		// Method that will be responsible to show if a day has an Event
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _onDayCreate(dObj: [], dStr: string, fp: Flatpickr, dayElem: any) {
			/* NOTE: dObj and dStr have alwways same value, we must use dayElem.dateObj property to get the proper day Date */
			// Get each day date
			// console.log(fp.formatDate(dayElem.dateObj, this._configs.ServerDateFormat));
		}

		// Method that will be triggered by library each time calendar is opened
		private _onOpen(): void {
			// Trigger platform's OnOpenHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onOpenCallbackEvent, this.widgetId);
		}

		// Method that will be triggered by library each time calendar is ready
		private _onReady(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._datePickerProviderElem.nextSibling as HTMLElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSUIFramework.Helper.Attribute.Set(this._flatpickrInputElem, 'data-input', '');

			// Trigger platform's InstanceIntializedHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onInitializeCallbackEvent, this.widgetId);
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
				case OSUIFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnClose:
					this._onCloseCallbackEvent = callback;
					break;
				case OSUIFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnInitialize:
					this._onInitializeCallbackEvent = callback;
					break;
				case OSUIFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnOpen:
					this._onOpenCallbackEvent = callback;
					break;
				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
					break;
			}
		}
	}
}
