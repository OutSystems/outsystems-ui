// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Datepicker.Flatpickr {
	export abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig>
		extends OSFramework.Patterns.DatePicker.AbstractDatePicker<Flatpickr, C>
		implements IFlatpickr
	{
		// Flatpickr onInitialize event
		private _onInitializeCallbackEvent: OSFramework.GlobalCallbacks.OSGeneric;
		// Store pattern input HTML element reference
		protected _datePickerProviderInputElem: HTMLInputElement;
		// Store the flatpickr input html element that will be added by library
		protected _flatpickrInputElem: HTMLInputElement;
		// Store the provider options
		protected _flatpickrOpts: FlatpickrOptions;
		// Flatpickr onChange (SelectedDate) event
		protected _onChangeCallbackEvent: OSFramework.Patterns.DatePicker.Callbacks.OSOnChangeEvent;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnChange = this.onDateSelectedEvent.bind(this);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._datePickerProviderInputElem.nextSibling as HTMLInputElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSFramework.Helper.Dom.Attribute.Set(
				this._flatpickrInputElem,
				OSFramework.GlobalEnum.HTMLAttributes.DataInput,
				''
			);
		}

		// Method used to set the CSS classes to the pattern HTML elements
		private _setCalendarCssClasses(): void {
			OSFramework.Helper.Dom.Styles.AddClass(
				this.provider.calendarContainer,
				OSFramework.Patterns.DatePicker.Enum.CssClass.Calendar
			);

			// Check if there are any ExtendedClass to be added into our calendar elements
			if (this.configs.ExtendedClass !== '') {
				OSFramework.Helper.Dom.Styles.ExtendedClass(
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
			const todayBtnWrapper = document.createElement(OSFramework.GlobalEnum.HTMLElement.Div);
			todayBtnWrapper.classList.add(Enum.CssClasses.TodayBtn);

			// Create the TodayBtn element
			const todayBtn = document.createElement(OSFramework.GlobalEnum.HTMLElement.Link);
			todayBtn.innerHTML = l10ns.TodayBtn[this.configs.Lang].title;
			OSFramework.Helper.A11Y.AriaLabel(todayBtn, l10ns.TodayBtn[this.configs.Lang].ariaLabel);

			todayBtn.addEventListener(OSFramework.GlobalEnum.HTMLEvent.Click, this.todayBtnClick.bind(this));

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
			/* In order to avoid dateFormat convert issues done by provider when InitialDate was not defined and input has a default date lets clean that value before creating provider instance. This happen when DateFormat is different from YYYY-MM-DD */
			if (this._datePickerProviderInputElem && this._flatpickrOpts.defaultDate === undefined) {
				this._datePickerProviderInputElem.value = '';
			}

			// Init provider
			this.provider = window.flatpickr(this._datePickerProviderInputElem, this._flatpickrOpts);

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: Enum.ProviderInfo.Name,
				version: Enum.ProviderInfo.Version,
				events: this.provider.config,
			});

			// Set the needed HTML attributes
			this._setAttributes();

			// Since Flatpickr has a native behaviour (by default) if a mobile device is in use, we must ensure we can add our Classes and TodayBtn to it, since if it's native behaviour we can't do it!
			if (this.provider.calendarContainer !== undefined) {
				if (
					this.configs.CalendarMode === OSFramework.Patterns.DatePicker.Enum.Mode.Range ||
					(OSFramework.Helper.DeviceInfo.IsDesktop && OSFramework.Helper.DeviceInfo.IsNative === false)
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
			}

			// Trigger platform's InstanceIntializedHandler client Action
			this.triggerPlatformEventInitialized(this._onInitializeCallbackEvent);
		}

		/**
		 * Trigger the jumToDate to now
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected jumpIntoToday(): void {
			this.provider.jumpToDate(this.provider.now);
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
			OSFramework.Helper.AsyncInvocation(this.prepareConfigs.bind(this));
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

		/**
		 * Method used to change given propertyName at OnParametersChange platform event
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof AbstractFlatpickr
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			//Storing the current ExtendedClass, before possibly changing this property.
			//This will enable us to remove the previous added classes to the element.
			const oldExtendedClass = this.configs.ExtendedClass;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.Patterns.DatePicker.Enum.Properties.FirstWeekDay:
					case OSFramework.Patterns.DatePicker.Enum.Properties.MaxDate:
					case OSFramework.Patterns.DatePicker.Enum.Properties.MinDate:
					case OSFramework.Patterns.DatePicker.Enum.Properties.ShowTodayButton:
						this.redraw();
						break;
					case OSFramework.GlobalEnum.CommonPatternsProperties.ExtendedClass:
						// Since Calendar element will be added dynamically by the library outside the pattern context
						OSFramework.Helper.Dom.Styles.ExtendedClass(
							this.provider.calendarContainer,
							oldExtendedClass,
							propertyValue as string
						);
						break;
				}
			}
		}

		/**
		 * Method used to clear the selected date
		 *
		 * @memberof AbstractFlatpickr
		 */
		public clear(): void {
			this.provider.clear();
		}

		/**
		 * Method used to close DatePicker
		 *
		 * @memberof AbstractFlatpickr
		 */
		public close(): void {
			this.provider.close();
		}

		/**
		 * Method used to disable days on DatePicker
		 *
		 * @param disableDays
		 * @memberof Flatpickr.DisableDays
		 */
		public disableDays(disableDays: string[]): void {
			this.configs.DisabledDays = disableDays;
			this.redraw();
		}

		/**
		 * Method used to disbale weekdays on DatePicker
		 *
		 * @param disableWeekDays
		 * @memberof Flatpickr.DisableWeekDays
		 */
		public disableWeekDays(disableWeekDays: number[]): void {
			this.configs.DisabledWeekDays = disableWeekDays;
			this.redraw();
		}

		/**
		 * Method to remove and destroy DatePicker instance
		 *
		 * @memberof AbstractFlatpickr
		 */
		public dispose(): void {
			if (this.isBuilt) {
				/* In order to avoid platform warnings due to DateFormat changes when DateFormar different from YYYY-MM-DD,
				remove the input element value, this will avoid library update it's value into a date with a different date format! */
				this._datePickerProviderInputElem.value = '';

				this.unsetCallbacks();
				this.unsetHtmlElements();

				// Wait for _datePickerProviderInputElem be removed from DOM, before detroy the provider instance!
				OSFramework.Helper.AsyncInvocation(this.provider.destroy);
			}

			super.dispose();
		}

		/**
		 * Method used to open DatePicker
		 *
		 * @memberof AbstractFlatpickr
		 */
		public open(): void {
			this.provider.open();
		}

		/**
		 * Method used to regist callback events
		 *
		 * @memberof AbstractFlatpickr
		 */
		public registerCallback(eventName: string, callback: OSFramework.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnChange:
					this._onChangeCallbackEvent = callback;
					break;

				case OSFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnInitialize:
					this._onInitializeCallbackEvent = callback;
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}

		/**
		 * Method used to set the DatePicker as editable on its input
		 *
		 * @memberof AbstractFlatpickr
		 */
		public setEditableInput(isEditable: boolean): void {
			if (this.configs.AllowInput !== isEditable) {
				this.configs.AllowInput = isEditable;
				this.redraw();
			}
		}

		/**
		 * Method used to set the DatePicker language
		 *
		 * @memberof AbstractFlatpickr
		 */
		public setLanguage(value: string): void {
			// Set the new Language
			this.configs.Lang = value.toLowerCase();

			// If provider has been already defined, calendar must be redrawed!
			if (this.provider !== undefined) {
				this.redraw();
			}
		}

		/**
		 * Method used to set all the extended Flatpickr properties across the different types of instances
		 *
		 * @param {FlatpickrOptions} newConfigs
		 * @memberof AbstractFlatpickr
		 */
		public setProviderConfigs(newConfigs: FlatpickrOptions): void {
			this.configs.setExtensibilityConfigs(newConfigs);

			this.redraw();
		}

		/**
		 * Method used to toggle the default native behavior of DatePicker
		 *
		 * @memberof AbstractFlatpickr
		 */
		public toggleNativeBehavior(isNative: boolean): void {
			// Invert the boolean value of IsNative because of provider option
			if (this.configs.DisableMobile !== !isNative) {
				this.configs.DisableMobile = !isNative;
				this.redraw();
			}
		}

		protected abstract onDateSelectedEvent(selectedDates: string[], dateStr: string, fp: Flatpickr): void;
		protected abstract prepareConfigs(): void;
		protected abstract todayBtnClick(event: MouseEvent): void;
		public abstract updateInitialDate(start: string, end?: string): void;
	}
}
