// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr {
	export abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig>
		extends OSUIFramework.Patterns.DatePicker.AbstractDatePicker<C>
		implements IFlatpickr, OSUIFramework.Interface.IProviderPattern<Flatpickr>
	{
		// Flatpickr onInitialize event
		private _onInitializeCallbackEvent: OSUIFramework.Callbacks.OSGeneric;
		// Store pattern input HTML element reference
		protected _datePickerProviderInputElem: HTMLInputElement;
		// Store the provider reference
		protected _flatpickr: Flatpickr;
		// Store the flatpickr input html element that will be added by library
		protected _flatpickrInputElem: HTMLInputElement;
		// Store the provider options
		protected _flatpickrOpts: FlatpickrOptions;
		// Flatpickr onChange (SelectedDate) event
		protected _onChangeCallbackEvent: OSUIFramework.Callbacks.OSDatepickerOnChangeEvent;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Trigger the jumToDate to now
		private _jumpIntoToday(event: MouseEvent) {
			event.preventDefault();

			this._flatpickr.jumpToDate(this._flatpickr.now);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._datePickerProviderInputElem.nextSibling as HTMLInputElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSUIFramework.Helper.Attribute.Set(
				this._flatpickrInputElem,
				OSUIFramework.GlobalEnum.HTMLAttributes.DataInput,
				''
			);
		}

		// Method used to set the CSS classes to the pattern HTML elements
		private _setCalendarCssClasses(): void {
			OSUIFramework.Helper.Style.AddClass(
				this._flatpickr.calendarContainer,
				OSUIFramework.Patterns.DatePicker.Enum.CssClass.Calendar
			);

			// Check if there are any ExtendedClass to be added into our calendar elements
			if (this._configs.ExtendedClass !== '') {
				this._updateCalendarExtendedClassSelectors('', this._configs.ExtendedClass);
			}
		}

		// Method to set the html elements used
		private _setHtmllElements(): void {
			// Set the inputHTML element
			this._datePickerProviderInputElem = this._selfElem.querySelector('input.form-control');

			// If the input hasn't be added
			if (!this._datePickerProviderInputElem) {
				throw new Error(`The datepicker input at DatepickerId '${this._widgetId}' is missing`);
			}
		}

		// Since Calendar will be added outside of pattern context,
		// this method will manage the CSS ExtendedClasses into that element accordingly
		private _updateCalendarExtendedClassSelectors(activeCssClass: string, newCssClass: string): void {
			if (activeCssClass !== '') {
				const activeCssClassArray = activeCssClass.split(' ');

				for (const className of activeCssClassArray) {
					this._flatpickr.calendarContainer.classList.remove(className);
				}
			}

			if (newCssClass !== '') {
				const newCssClassArray = newCssClass.split(' ');

				for (const className of newCssClassArray) {
					this._flatpickr.calendarContainer.classList.add(className);
				}
			}
		}

		/**
		 * Method used to add the TodayButton at calendar
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected _addTodayBtn(): void {
			// Create the wrapper container
			const todayBtnWrapper = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Div);
			todayBtnWrapper.classList.add(Enum.CssClasses.TodayBtn);

			// Create the TodayBtn element
			const todayBtn = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Link);
			todayBtn.innerHTML = Enum.TodayButton.Text;
			OSUIFramework.Helper.A11Y.AriaLabel(todayBtn, Enum.TodayButton.AriaLabelText);

			todayBtn.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._jumpIntoToday.bind(this));

			// Append elements to the proper containers
			todayBtnWrapper.appendChild(todayBtn);
			this._flatpickr.calendarContainer.appendChild(todayBtnWrapper);
		}

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected _onReady(): void {
			// Init provider
			this._flatpickr = window.flatpickr(this._datePickerProviderInputElem, this._flatpickrOpts);

			// Set the needed HTML attributes
			this._setAttributes();

			// At phone we've native behaviour, so TodayBtn can't be added
			if (OSUIFramework.Helper.DeviceInfo.IsPhone === false) {
				// Add TodayBtn
				if (this._configs.ShowTodayButton) {
					this._addTodayBtn();
				}

				// Set Calendar CSS classes
				this._setCalendarCssClasses();
			}

			// Trigger platform's InstanceIntializedHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onInitializeCallbackEvent, this.widgetId);
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected unsetCallbacks(): void {
			this._onInitializeCallbackEvent = undefined;
			this._onChangeCallbackEvent = undefined;
		}

		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected unsetHtmlElements(): void {
			this._datePickerProviderInputElem = undefined;
		}

		public build(): void {
			super.build();

			this._setHtmllElements();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			// Since we've an element that will be added dynamically at the body...
			if (this.isBuilt && propertyName === OSUIFramework.GlobalEnum.CommonPatternsProperties.ExtendedClass) {
				this._updateCalendarExtendedClassSelectors(this._configs.ExtendedClass, propertyValue as string);
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
			if (this.isBuilt) {
				this.unsetCallbacks();
				this.unsetHtmlElements();

				this._flatpickr.destroy();
			}

			super.dispose();
		}

		public open(): void {
			this._flatpickr.open();
		}

		// Provider getter
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
			}
		}
	}
}
