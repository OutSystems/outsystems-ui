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
		protected _onChangeCallbackEvent: OSUIFramework.Callbacks.OSDatepickerOnChangeEvent;

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
			this._datePickerProviderInputElem = this._selfElem.querySelector('input.form-control') as HTMLInputElement;

			// If the input hasn't be added
			if (!this._datePickerProviderInputElem) {
				throw new Error(`The datepicker input at DatepickerId '${this._widgetId}' is missing`);
			}
		}

		// Method that will be used to set the CSS ExtendedClasses into input and calendar
		private _updateExtendedClassSelectors(activeCssClass: string, newCssClass: string): void {
			if (activeCssClass !== '') {
				const activeCssClassArray = activeCssClass.split(' ');

				for (let i = 0; i < activeCssClassArray.length; ++i) {
					this._flatpickr.calendarContainer.classList.remove(activeCssClassArray[i]);
				}
			}

			if (newCssClass !== '') {
				const newCssClassArray = newCssClass.split(' ');

				for (let i = 0; i < newCssClassArray.length; ++i) {
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

		// Method that will be triggered at Flatpickr instance is ready
		protected _onReady(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._datePickerProviderInputElem.nextSibling as HTMLInputElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSUIFramework.Helper.Attribute.Set(this._flatpickrInputElem, 'data-input', '');

			// Check if there are any ExtendedClass to be added into our calendar elements
			if (this._configs.ExtendedClass !== '') {
				this._updateExtendedClassSelectors('', this._configs.ExtendedClass);
			}

			// Trigger platform's InstanceIntializedHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onInitializeCallbackEvent, this.widgetId);
		}

		public build(): void {
			super.build();

			this._setHtmllElements();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case OSUIFramework.GlobalEnum.CommonPatternsProperties.ExtendedClass:
					// Since we've an element that will be added dynamically at the body...
					this._updateExtendedClassSelectors(this._configs.ExtendedClass, propertyValue);

					// Update the property at the _selfElem
					super.changeProperty(propertyName, propertyValue);

					break;
				default:
					throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
					break;
			}
		}

		public clear(): void {
			this._flatpickr.clear();
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

		// Method used to regist callback events
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnChange:
					this._onChangeCallbackEvent = callback;
					break;

				case OSUIFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnInitialize:
					this._onInitializeCallbackEvent = callback;
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
					break;
			}
		}
	}
}
