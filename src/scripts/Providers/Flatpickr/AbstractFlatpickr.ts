// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr {
	export abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig>
		extends OSUIFramework.Patterns.DatePicker.AbstractDatePicker<C>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements IFlatpickr, OSUIFramework.Interface.IProviderPattern<Flatpickr>
	{
		// RangeSlider events
		private _onCloseCallbackEvent: OSUIFramework.Callbacks.OSGeneric;
		private _onInitializeCallbackEvent: OSUIFramework.Callbacks.OSGeneric;
		private _onOpenCallbackEvent: OSUIFramework.Callbacks.OSGeneric;

		// Store the provider target element
		protected _datePickerProviderInputElem: HTMLInputElement;
		// Store the provider reference
		protected _flatpickr: Flatpickr;
		// Store the flatpickr html element that will be added by library
		protected _flatpickrInputElem: HTMLInputElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Trigger the jumToDate to now
		private _jumpIntoToday() {
			this._flatpickr.jumpToDate(this._flatpickr.now);
		}

		// Method to set the html elements used
		private _setHtmllElements(): void {
			// Set the inputHTML element
			this._datePickerProviderInputElem = document.getElementById(
				this._configs.InputWidgetId
			) as HTMLInputElement;
		}

		// Method that will be used to set the CSS ExtendedClasses into input and calendar
		private _updateExtendedClassSelectors(activeCssClass: string, newCssClass: string): void {
			if (activeCssClass !== '') {
				const activeCssClassArray = activeCssClass.split(' ');

				for (let i = 0; i < activeCssClassArray.length; ++i) {
					this._flatpickrInputElem.classList.remove(activeCssClassArray[i]);
					this._flatpickr.calendarContainer.classList.remove(activeCssClassArray[i]);
				}
			}

			if (newCssClass !== '') {
				const newCssClassArray = newCssClass.split(' ');

				for (let i = 0; i < newCssClassArray.length; ++i) {
					this._flatpickrInputElem.classList.add(newCssClassArray[i]);
					this._flatpickr.calendarContainer.classList.add(newCssClassArray[i]);
				}
			}
		}

		// Method used to add the TodayButton at calendar
		protected _addTodayBtn(): void {
			const todayBtn = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Link);
			todayBtn.innerHTML = Enum.TodayBtn.Text;
			todayBtn.classList.add(Enum.CssClasses.TodayBtn);
			todayBtn.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._jumpIntoToday.bind(this));
			this._flatpickr.calendarContainer.appendChild(todayBtn);
		}

		// Method that will be triggered each time calendar is closed
		protected _onClose(): void {
			// Trigger platform's OnCloseHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onCloseCallbackEvent, this.widgetId);
		}

		// Method that will be used to add a custom selector to all days that has an Event
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		protected _onDayCreated(fp: Flatpickr, dayElem: any): void {
			/* NOTE: dObj and dStr have alwways same value, we must use dayElem.dateObj property to get the proper day Date */
			// Get each day date
			// console.log(fp.formatDate(dayElem.dateObj, this._configs.ServerDateFormat));
		}

		// Method that will be triggered each time calendar is opened
		protected _onOpen(): void {
			// Trigger platform's OnOpenHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onOpenCallbackEvent, this.widgetId);
		}

		// Method that will be triggered at Flatpickr is ready
		protected _onReady(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._datePickerProviderInputElem.nextSibling as HTMLInputElement;

			// Check if the default date is an OutSystems null date, if so, clear the input
			if (OutSystems.OSUI.Utils.IsNullDate(this._configs.InitalDate)) {
				// Update the Calendar date
				this._jumpIntoToday();
				// Clear the input
				this._flatpickrInputElem.value = '';
			}

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSUIFramework.Helper.Attribute.Set(this._flatpickrInputElem, 'data-input', '');

			// Check if there are any ExtendedClass to be added into our calendar elements
			if (this._configs.ExtendedClass !== '') {
				this._updateExtendedClassSelectors('', this._configs.ExtendedClass);
			}

			// Trigger platform's InstanceIntializedHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onInitializeCallbackEvent, this.widgetId);
		}

		// Method used to regist callback events
		protected _registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
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

		public build(): void {
			super.build();

			this._setHtmllElements();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case OSUIFramework.GlobalEnum.CommonPatternsProperties.ExtendedClass:
					this._updateExtendedClassSelectors(this._configs.ExtendedClass, propertyValue);

					// Update the property at the _selfElem
					super.changeProperty(propertyName, propertyValue);

					break;
			}
		}

		public clear(): void {
			this._flatpickr.clear();
			this._jumpIntoToday();
		}

		public close(): void {
			this._flatpickr.close();
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				this._flatpickr.destroy();
			}

			super.dispose();
		}

		public open(): void {
			this._flatpickr.open();
		}

		// Provider getter
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		public get provider(): Flatpickr {
			return this._flatpickr;
		}

		public abstract registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void;
	}
}
