// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Datepicker.Flatpickr {
	export abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig>
		extends OSFramework.Patterns.DatePicker.AbstractDatePicker<Flatpickr, C>
		implements IFlatpickr
	{
		// Store container HTML element reference that contains an explanation about how to navigate through calendar with keyboard
		private _a11yInfoContainerElem: HTMLElement;
		// Event OnBodyScroll common behaviour
		private _bodyScrollCommonBehaviour: SharedProviderResources.Flatpickr.UpdatePositionOnScroll;
		// Flatpickr onInitialize event
		private _onInitializeCallbackEvent: OSFramework.GlobalCallbacks.OSGeneric;
		// Store pattern input HTML element reference
		protected _datePickerPlatformInputElem: HTMLInputElement;
		// Store the flatpickr input html element that will be added by library
		protected _flatpickrInputElem: HTMLInputElement;
		// Store the provider options
		protected _flatpickrOpts: FlatpickrOptions;
		// Store on a flag status when the picker is updating the default date;
		protected _isUpdatingDefaultDate = false;
		// Flatpickr onChange (SelectedDate) event
		protected _onSelectedCallbackEvent: OSFramework.Patterns.DatePicker.Callbacks.OSOnChangeEvent;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnChange = this.onDateSelectedEvent.bind(this);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			if (this._datePickerPlatformInputElem.nextSibling) {
				this._flatpickrInputElem = this._datePickerPlatformInputElem.nextSibling as HTMLInputElement;

				// Added the data-input attribute in order to input be styled as all platform inputs
				OSFramework.Helper.Dom.Attribute.Set(
					this._flatpickrInputElem,
					OSFramework.GlobalEnum.HTMLAttributes.DataInput,
					''
				);
			}
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

		/**
		 * Method used to add the TodayButton at calendar
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
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
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected createProviderInstance(): void {
			/* In order to avoid dateFormat convert issues done by provider when InitialDate was not defined and input has a default date lets clean that value before creating provider instance. This happen when DateFormat is different from YYYY-MM-DD */
			if (this._datePickerPlatformInputElem && this._flatpickrOpts.defaultDate === undefined) {
				this._datePickerPlatformInputElem.value = '';
			}

			// Init provider
			this.provider = window.flatpickr(this._datePickerPlatformInputElem, this._flatpickrOpts);

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Name,
				version: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Version,
				events: this.provider.config,
			});

			// Set the needed HTML attributes
			this._setAttributes();

			// Set accessibility stuff
			this.setA11YProperties();

			// Since native behaviour could be enabled, check if the calendar container exist!
			if (this.provider.calendarContainer !== undefined) {
				if (
					this.configs.DisableMobile === true ||
					OSFramework.Helper.DeviceInfo.IsDesktop ||
					this.configs.CalendarMode === OSFramework.Patterns.DatePicker.Enum.Mode.Range
				) {
					// Add TodayBtn
					if (this.configs.ShowTodayButton) {
						this.addTodayBtn();
					}

					// Set Calendar CSS classes
					this._setCalendarCssClasses();

					// set the onBodyScroll update calendar position behaviour!
					this._bodyScrollCommonBehaviour = new SharedProviderResources.Flatpickr.UpdatePositionOnScroll(
						this
					);
				}
			}

			// Due to platform validations every time a new redraw occurs we must ensure we remove the class based on a clone from the platform input!
			if (this._flatpickrInputElem !== undefined && this.isBuilt) {
				OSFramework.Helper.Dom.Styles.RemoveClass(this._flatpickrInputElem, Enum.CssClasses.InputNotValid);
			}

			// Trigger platform's InstanceIntializedHandler client Action
			this.triggerPlatformEventInitialized(this._onInitializeCallbackEvent);
		}

		/**
		 * Trigger the jumToDate to now
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected jumpIntoToday(): void {
			this.provider.jumpToDate(this.provider.now);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected setA11YProperties(): void {
			// Since native behaviour could be enabled, check if the calendar container exist!
			if (this.provider.calendarContainer !== undefined && this._flatpickrInputElem !== undefined) {
				// Set the default aria-label value attribute in case user didn't set it!
				let ariaLabelValue = Enum.Attribute.DefaultAriaLabel as string;

				// Check if aria-label attribute has been added to the default input
				if (this._datePickerPlatformInputElem.hasAttribute(OSFramework.Constants.A11YAttributes.Aria.Label)) {
					ariaLabelValue = this._datePickerPlatformInputElem.getAttribute(
						OSFramework.Constants.A11YAttributes.Aria.Label
					);
				}

				// Set the aria-label attribute value
				OSFramework.Helper.A11Y.AriaLabel(this._flatpickrInputElem, ariaLabelValue);
				// Set the aria-describedby attribute in order to give more context about how to navigate into calendar using keyboard
				OSFramework.Helper.A11Y.AriaDescribedBy(this._flatpickrInputElem, this._a11yInfoContainerElem.id);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected setCallbacks(): void {
			console.log(OSFramework.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected setHtmlElements(): void {
			// Set the inputHTML element
			this._datePickerPlatformInputElem = this.selfElement.querySelector('input.form-control');
			// Store the reference to the info container about how to use keyboard to navigate through calendar
			this._a11yInfoContainerElem = OSFramework.Helper.Dom.TagSelector(
				this.selfElement.parentElement,
				OSFramework.Constants.Dot + Enum.CssClasses.AccessibilityContainerInfo
			);

			// If the input hasn't be added
			if (!this._datePickerPlatformInputElem) {
				throw new Error(`The datepicker input at DatepickerId '${this.widgetId}' is missing`);
			}
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected unsetCallbacks(): void {
			this.configs.OnChange = undefined;

			this._onInitializeCallbackEvent = undefined;
			this._onSelectedCallbackEvent = undefined;
		}

		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected unsetHtmlElements(): void {
			this._a11yInfoContainerElem = undefined;
			this._datePickerPlatformInputElem = undefined;
		}

		/**
		 * Build the Pattern
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();
		}

		/**
		 * Method used to change given propertyName at OnParametersChange platform event
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
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
					case OSFramework.Patterns.DatePicker.Enum.Properties.ShowWeekNumbers:
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
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public clear(): void {
			this.provider.clear();
		}

		/**
		 * Method used to close DatePicker
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
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
		 * Method used to disable weekdays on DatePicker
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
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public dispose(): void {
			if (this.isBuilt) {
				/* In order to avoid platform warnings due to DateFormat changes when DateFormat different from YYYY-MM-DD,
				remove the input element value, this will avoid library update it's value into a date with a different date format! */
				this._datePickerPlatformInputElem.value = '';

				this.unsetCallbacks();
				this.unsetHtmlElements();

				if (this._bodyScrollCommonBehaviour !== undefined) {
					this._bodyScrollCommonBehaviour.dispose();
					this._bodyScrollCommonBehaviour = undefined;
				}

				// Wait for _datePickerProviderInputElem be removed from DOM, before destroy the provider instance!
				OSFramework.Helper.AsyncInvocation(this.provider.destroy);
			}

			super.dispose();
		}

		/**
		 * Method used to open DatePicker
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public open(): void {
			this.provider.open();
		}

		/**
		 * Method used to regist callback events
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public registerCallback(eventName: string, callback: OSFramework.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.Patterns.DatePicker.Enum.DatePickerEvents.OnChange:
					this._onSelectedCallbackEvent = callback;
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
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
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
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
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
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public setProviderConfigs(newConfigs: FlatpickrOptions): void {
			this.configs.setExtensibilityConfigs(newConfigs);

			this.redraw();
		}

		/**
		 * Method used to toggle the default native behavior of DatePicker
		 *
		 * @memberof Providers.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public toggleNativeBehavior(isNative: boolean): void {
			// Invert the boolean value of IsNative because of provider option
			if (this.configs.DisableMobile !== !isNative) {
				this.configs.DisableMobile = !isNative;
				this.redraw();
			}
		}

		// Common methods all DatePickers must implement
		protected abstract onDateSelectedEvent(selectedDates: string[], dateStr: string, fp: Flatpickr): void;
		protected abstract prepareConfigs(): void;
		protected abstract todayBtnClick(event: MouseEvent): void;
		public abstract updateInitialDate(start: string, end?: string): void;
	}
}
