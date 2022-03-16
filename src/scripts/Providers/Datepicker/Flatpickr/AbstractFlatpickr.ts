// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Datepicker.Flatpickr {
	export abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig>
		extends OSUIFramework.Patterns.DatePicker.AbstractDatePicker<Flatpickr, C>
		implements IFlatpickr
	{
		// Flatpickr onInitialize event
		private _onInitializeCallbackEvent: OSUIFramework.Callbacks.OSGeneric;
		// Store pattern input HTML element reference
		protected _datePickerProviderInputElem: HTMLInputElement;
		// Store the flatpickr input html element that will be added by library
		protected _flatpickrInputElem: HTMLInputElement;
		// Store the provider options
		protected _flatpickrOpts: FlatpickrOptions;
		// Flatpickr onChange (SelectedDate) event
		protected _onChangeCallbackEvent: OSUIFramework.Callbacks.OSDatepickerOnChangeEvent;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnChange = this.onDateSelectedEvent.bind(this);
		}

		// Trigger the jumToDate to now
		private _jumpIntoToday(event: MouseEvent) {
			event.preventDefault();

			this.provider.jumpToDate(this.provider.now);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._datePickerProviderInputElem.nextSibling as HTMLInputElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSUIFramework.Helper.Dom.Attribute.Set(
				this._flatpickrInputElem,
				OSUIFramework.GlobalEnum.HTMLAttributes.DataInput,
				''
			);
		}

		// Method used to set the CSS classes to the pattern HTML elements
		private _setCalendarCssClasses(): void {
			OSUIFramework.Helper.Dom.Styles.AddClass(
				this.provider.calendarContainer,
				OSUIFramework.Patterns.DatePicker.Enum.CssClass.Calendar
			);

			// Check if there are any ExtendedClass to be added into our calendar elements
			if (this.configs.ExtendedClass !== '') {
				OSUIFramework.Helper.Dom.Styles.ExtendedClass(
					this.provider.calendarContainer,
					'',
					this.configs.ExtendedClass
				);
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

		/**
		 * Method used to add the TodayButton at calendar
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected addTodayBtn(): void {
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
			this.provider.calendarContainer.appendChild(todayBtnWrapper);
		}

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected createProviderInstance(): void {
			// Init provider
			this.provider = window.flatpickr(this._datePickerProviderInputElem, this._flatpickrOpts);

			// Set the needed HTML attributes
			this._setAttributes();

			// Since Flatpickr has a native behaviour (by default) if a mobile device is in use, we must ensure we can add our Classes and TodayBtn to it, since if it's native behaviour we can't do it!
			if (
				this.configs.calendarMode === OSUIFramework.Patterns.DatePicker.Enum.Mode.Range ||
				(OSUIFramework.Helper.DeviceInfo.IsDesktop && OSUIFramework.Helper.DeviceInfo.IsNative === false)
			) {
				/* NOTE:
					If it's not a native app, could we add our stuff to the calendar?
						- If RangeDate calendar => We do not have a native behaviour for it, so => YES!
						- If Desktop we also be able to add them
					
					Seams confused but we can be at:
						- iPad Safari (rendered as desktop)
						- iPad Chrome (rendered as native)
				*/

				// Add TodayBtn
				if (this.configs.ShowTodayButton) {
					this.addTodayBtn();
				}

				// Set Calendar CSS classes
				this._setCalendarCssClasses();
			}

			// Trigger platform's InstanceIntializedHandler client Action
			OSUIFramework.Helper.AsyncInvocation(this._onInitializeCallbackEvent, this.widgetId);
		}

		/**
		 * Method that will be responsible to redraw the calendar when it's needed
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected redraw(): void {
			// Destroy the old flatpickr instance
			this.provider.destroy();

			// Create a new flatpickr instance with the updated configs
			OSUIFramework.Helper.AsyncInvocation(this.prepareConfigs.bind(this));
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected unsetCallbacks(): void {
			this.configs.OnChange = undefined;

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
			//Storing the current ExtendedClass, before possibly changing this property.
			//This will enable us to remove the previous added classes to the element.
			const oldExtendedClass = this.configs.ExtendedClass;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.DatePicker.Enum.Properties.FirstWeekDay:
					case OSUIFramework.Patterns.DatePicker.Enum.Properties.MaxDate:
					case OSUIFramework.Patterns.DatePicker.Enum.Properties.MinDate:
					case OSUIFramework.Patterns.DatePicker.Enum.Properties.ShowTodayButton:
						this.redraw();
						break;
					case OSUIFramework.GlobalEnum.CommonPatternsProperties.ExtendedClass:
						// Since Calendar element will be added dynamically by the library outside the pattern context
						OSUIFramework.Helper.Dom.Styles.ExtendedClass(
							this.provider.calendarContainer,
							oldExtendedClass,
							propertyValue as string
						);
						break;
				}
			}
		}

		public clear(): void {
			this.provider.clear();
		}

		public close(): void {
			this.provider.close();
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			if (this.isBuilt) {
				this.unsetCallbacks();
				this.unsetHtmlElements();

				this.provider.destroy();
			}

			super.dispose();
		}

		public open(): void {
			this.provider.open();
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

		protected abstract onDateSelectedEvent(selectedDates: string[], dateStr: string, fp: Flatpickr): void;
		protected abstract prepareConfigs(): void;
	}
}
