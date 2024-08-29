// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Datepicker.Flatpickr {
	export abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig>
		extends OSFramework.OSUI.Patterns.DatePicker.AbstractDatePicker<Flatpickr, C>
		implements IFlatpickr
	{
		// Store container HTML element reference that contains an explanation about how to navigate through calendar with keyboard
		private _a11yInfoContainerElem: HTMLElement;
		// Event OnBodyScroll common behaviour
		private _bodyScrollCommonBehaviour: SharedProviderResources.Flatpickr.UpdatePositionOnScroll;
		/* Flag to store the satus of the platform input */
		private _isPlatformInputDisabled: boolean;
		// Store HtmlElement for the provider focus span target
		private _providerFocusSpanTarget: HTMLElement;
		// Store HtmlElement for the Today Button
		private _todayButtonElem: HTMLElement;
		// Validation of ZIndex position common behavior
		private _zindexCommonBehavior: SharedProviderResources.Flatpickr.UpdateZindex;
		// Store pattern input HTML element reference
		protected datePickerPlatformInputElem: HTMLInputElement;
		// Store the flatpickr input html element that will be added by library
		protected flatpickrInputElem: HTMLInputElement;
		// Store the provider options
		protected flatpickrOpts: FlatpickrOptions;
		// Flatpickr onChange (SelectedDate) event
		protected onSelectedCallbackEvent: OSFramework.OSUI.Patterns.DatePicker.Callbacks.OSOnChangeEvent;
		// Property to store a custom callback called on OnClose Flatpickr event
		public onCloseCustomCallback = undefined;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnChange = this.onDateSelectedEvent.bind(this);

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnClose = this.onDatePickerClose.bind(this);

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnOpen = this.onDatePickerOpen.bind(this);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			if (this.datePickerPlatformInputElem.nextSibling) {
				this.flatpickrInputElem = this.datePickerPlatformInputElem.nextSibling as HTMLInputElement;

				// Added the data-input attribute in order to input be styled as all platform inputs
				OSFramework.OSUI.Helper.Dom.Attribute.Set(
					this.flatpickrInputElem,
					OSFramework.OSUI.GlobalEnum.HTMLAttributes.DataInput,
					''
				);

				// If the provider cloned a disabled platform input, remove the disable attribute form the provider input
				if (this.flatpickrInputElem.disabled) {
					OSFramework.OSUI.Helper.Dom.Attribute.Remove(
						this.flatpickrInputElem,
						OSFramework.OSUI.GlobalEnum.HTMLAttributes.Disabled
					);
				}
			}
		}

		// Method used to set the CSS classes to the pattern HTML elements
		private _setCalendarCssClasses(): void {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(
				this.provider.calendarContainer,
				OSFramework.OSUI.Patterns.DatePicker.Enum.CssClass.Calendar
			);

			// Check if there are any ExtendedClass to be added into our calendar elements
			if (this.configs.ExtendedClass !== '') {
				OSFramework.OSUI.Helper.Dom.Styles.ExtendedClass(
					this.provider.calendarContainer,
					'',
					this.configs.ExtendedClass
				);
			}
		}

		// Set the clientHeight to the parent container as an inline style in order vertical content remains same and avoid content vertical flickering!
		private _setParentMinHeight(): void {
			OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				OSFramework.OSUI.GlobalEnum.InlineStyle.Height,
				this.selfElement.clientHeight + OSFramework.OSUI.GlobalEnum.Units.Pixel
			);
		}

		// Method to handle the keydows event for the Today Button
		private _todayButtonKeydown(e: KeyboardEvent): void {
			switch (e.key) {
				case OSFramework.OSUI.GlobalEnum.Keycodes.Tab:
					// Prevent the flatpickr default behaviour for tab
					return;

				case OSFramework.OSUI.GlobalEnum.Keycodes.Enter:
				case OSFramework.OSUI.GlobalEnum.Keycodes.Space:
					e.preventDefault();
					// Set the currentDate at the Datepicker
					this.provider.setDate(this.provider.now, true);
					// Trigger the jumpIntoDate!
					this.jumpIntoToday();
					break;
			}
		}

		// Remove the clientHeight that has been assigned before the redraw process!
		private _unsetParentMinHeight(): void {
			OSFramework.OSUI.Helper.Dom.Styles.RemoveStyleAttribute(
				this.selfElement,
				OSFramework.OSUI.GlobalEnum.InlineStyle.Height
			);
		}

		// Update certain A11Y properties
		private _updateA11yProperties(): void {
			// Ensure flatpickrInputElem tabindex is updated based on the platform input status
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.flatpickrInputElem,
				OSFramework.OSUI.Constants.A11YAttributes.TabIndex,
				this._isPlatformInputDisabled
					? OSFramework.OSUI.Constants.A11YAttributes.States.TabIndexHidden
					: OSFramework.OSUI.Constants.A11YAttributes.States.TabIndexShow
			);

			// Ensure flatpickrInputElem will also be updated for ScreenReaders
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.flatpickrInputElem,
				OSFramework.OSUI.Constants.A11YAttributes.Aria.Hidden,
				this._isPlatformInputDisabled.toString()
			);
		}

		/**
		 * Method used to add the TodayButton at calendar
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected addTodayBtn(): void {
			// Create the wrapper container
			this._todayButtonElem = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Div);
			this._todayButtonElem.classList.add(Enum.CssClasses.TodayBtn);

			// Create the TodayBtn element
			const todayBtn = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Link);

			// Set the tabindex for the today button
			if (this.provider.isOpen) {
				OSFramework.OSUI.Helper.A11Y.TabIndexTrue(todayBtn);
			} else {
				OSFramework.OSUI.Helper.A11Y.TabIndexFalse(todayBtn);
			}

			const langCode = l10ns.TodayBtn[this.configs.Lang] !== undefined ? this.configs.Lang : 'en';

			todayBtn.innerHTML = l10ns.TodayBtn[langCode].title;
			OSFramework.OSUI.Helper.A11Y.AriaLabel(todayBtn, l10ns.TodayBtn[langCode].ariaLabel);

			todayBtn.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.Click, this.todayBtnClick.bind(this));
			todayBtn.addEventListener(
				OSFramework.OSUI.GlobalEnum.HTMLEvent.keyDown,
				this._todayButtonKeydown.bind(this)
			);

			// Append elements to the proper containers
			this._todayButtonElem.appendChild(todayBtn);
			// Make sure to append this just before the focus trap span from flatpickr
			this._providerFocusSpanTarget = this.provider.calendarContainer.querySelector('.focus-trap-bottom-element');

			if (this._providerFocusSpanTarget) {
				this.provider.calendarContainer.insertBefore(this._todayButtonElem, this._providerFocusSpanTarget);
			} else {
				this.provider.calendarContainer.appendChild(this._todayButtonElem);
			}
		}

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected createProviderInstance(): void {
			// Init provider
			this.provider = window.flatpickr(this.datePickerPlatformInputElem, this.flatpickrOpts);

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Name,
				version: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Version,
				events: this.provider.config,
			});

			// Set the needed HTML attributes
			this._setAttributes();

			// Update the platform input attributes
			this.updatePlatformInputAttrs();

			// Set accessibility stuff
			this.setA11YProperties();

			// Since native behaviour could be enabled, check if the calendar container exist!
			if (this.provider.calendarContainer !== undefined) {
				if (
					this.configs.DisableMobile === true ||
					OSFramework.OSUI.Helper.DeviceInfo.IsDesktop ||
					this.configs.CalendarMode === OSFramework.OSUI.Patterns.DatePicker.Enum.Mode.Range
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

					// set the zindex update position behaviour!
					this._zindexCommonBehavior = new SharedProviderResources.Flatpickr.UpdateZindex(this);
				}
			}

			// Due to platform validations every time a new redraw occurs we must ensure we remove the class based on a clone from the platform input!
			if (this.flatpickrInputElem !== undefined && this.isBuilt) {
				OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
					this.flatpickrInputElem,
					OSFramework.OSUI.GlobalEnum.CssClassElements.InputNotValid
				);
			}

			// Remove inline height value style!
			this._unsetParentMinHeight();

			/**
			 * Trigger Innitialized Event.
			 * - This is needed for the patterns based on a provider since at the Initialized Event at the
			 * Platform side, custom code can be added in order to add customization to the provider.
			 * - This way, Initialized Event will be triggered every time a redraw occurs.
			 */
			this.triggerPlatformInitializedEventCallback();
		}

		/**
		 * Trigger the jumToDate to now
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected jumpIntoToday(): void {
			this.provider.jumpToDate(this.provider.now);
		}

		/**
		 * Method used to update the datepicker value when the selected dates are empty,
		 * to add the custom callback to the OnClose event and remove the tabindex from the today button
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected onDatePickerClose(): void {
			// Clear the provider selected date if the input is empty
			if (this.provider.selectedDates.length === 0) {
				this.onDateSelectedEvent(this.provider.selectedDates);
			}

			// Remove the tabindex from the link inside the today button if it exists
			if (this.configs.ShowTodayButton && this._todayButtonElem) {
				OSFramework.OSUI.Helper.A11Y.TabIndexFalse(
					this._todayButtonElem.querySelector(OSFramework.OSUI.GlobalEnum.HTMLElement.Link)
				);
			}
			// Call the custom callback provided for users to add custom code when a datepicker close
			if (
				this.onCloseCustomCallback !== undefined &&
				typeof this.onCloseCustomCallback === OSFramework.OSUI.Constants.JavaScriptTypes.Function
			) {
				this.onCloseCustomCallback(this.provider);
			}
		}

		/**
		 * Method used to add the custom callback to the OnOpen event and add the tabindex for the today button
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected onDatePickerOpen(): void {
			// Add the tabindex for the link inside the today button if it exists
			if (this.configs.ShowTodayButton && this._todayButtonElem) {
				OSFramework.OSUI.Helper.A11Y.TabIndexTrue(
					this._todayButtonElem.querySelector(OSFramework.OSUI.GlobalEnum.HTMLElement.Link)
				);
			}
		}

		/**
		 * The method used to prepare the pattern before being redrawn in order to prevent possible flickering.
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this.flatpickrOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
		}

		/**
		 * Method used to prepare pattern before being redrawed in order to prevent possible flickerings!
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected prepareToAndRedraw(): void {
			this._setParentMinHeight();
			this.redraw();
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected setA11YProperties(): void {
			// Since native behaviour could be enabled, check if the calendar container exist!
			if (this.provider.calendarContainer !== undefined && this.flatpickrInputElem !== undefined) {
				// This is needed once library set it as an hidden by default which can not be since otherwise the updating it's value will not be triggered the local variable update.
				// Since this will be hidden through css, in terms of accessibility it should not be "visible"!
				OSFramework.OSUI.Helper.Dom.Attribute.Set(
					this.datePickerPlatformInputElem,
					OSFramework.OSUI.Constants.A11YAttributes.TabIndex,
					OSFramework.OSUI.Constants.A11YAttributes.States.TabIndexHidden
				);
				// Ensure datePickerPlatformInputElem will also be hidden for ScreenReaders
				OSFramework.OSUI.Helper.Dom.Attribute.Set(
					this.datePickerPlatformInputElem,
					OSFramework.OSUI.Constants.A11YAttributes.Aria.Hidden,
					OSFramework.OSUI.Constants.A11YAttributes.States.True
				);
				// Ensure A11yContainer will not be direclty visible
				OSFramework.OSUI.Helper.Dom.Attribute.Set(
					this._a11yInfoContainerElem,
					OSFramework.OSUI.Constants.A11YAttributes.Aria.Hidden,
					OSFramework.OSUI.Constants.A11YAttributes.States.True
				);

				this._updateA11yProperties();

				// Set the default aria-label value attribute in case user didn't set it!
				let ariaLabelValue = Enum.Attribute.DefaultAriaLabel as string;

				// Check if aria-label attribute has been added to the default input
				if (
					this.datePickerPlatformInputElem.hasAttribute(OSFramework.OSUI.Constants.A11YAttributes.Aria.Label)
				) {
					ariaLabelValue = this.datePickerPlatformInputElem.getAttribute(
						OSFramework.OSUI.Constants.A11YAttributes.Aria.Label
					);
				}

				// Set the aria-label attribute value
				OSFramework.OSUI.Helper.A11Y.AriaLabel(this.flatpickrInputElem, ariaLabelValue);
				// Set the aria-describedby attribute in order to give more context about how to navigate into calendar using keyboard
				if (OSFramework.OSUI.Helper.DeviceInfo.IsDesktop)
					OSFramework.OSUI.Helper.A11Y.AriaDescribedBy(
						this.flatpickrInputElem,
						this._a11yInfoContainerElem.id
					);

				// Check if lang is not EN (default one)
				if (this.configs.Lang !== OSFramework.OSUI.Constants.Language.short) {
					// Update A11yContainer info based on the given language
					this._a11yInfoContainerElem.innerHTML =
						Datepicker.Flatpickr.l10ns.A11yContainerInfo[this.configs.Lang] !== undefined
							? Datepicker.Flatpickr.l10ns.A11yContainerInfo[this.configs.Lang].htmlTex
							: Datepicker.Flatpickr.l10ns.A11yContainerInfo.en.htmlTex;
				}
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected setCallbacks(): void {
			console.log(OSFramework.OSUI.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected setHtmlElements(): void {
			// Set the inputHTML element
			this.datePickerPlatformInputElem = this.selfElement.querySelector('input.form-control');
			// Store the default state of the input
			this._isPlatformInputDisabled = this.datePickerPlatformInputElem.disabled;
			// Store the reference to the info container about how to use keyboard to navigate through calendar
			this._a11yInfoContainerElem = OSFramework.OSUI.Helper.Dom.TagSelector(
				this.selfElement.parentElement,
				OSFramework.OSUI.Constants.Dot + Enum.CssClasses.AccessibilityContainerInfo
			);

			// If the input hasn't be added
			if (!this.datePickerPlatformInputElem) {
				throw new Error(`The datepicker input at DatepickerId '${this.widgetId}' is missing`);
			}
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected unsetCallbacks(): void {
			this.configs.OnChange = undefined;
			this.onSelectedCallbackEvent = undefined;

			super.unsetCallbacks();
		}

		/**
		 * Unsets the refences to the HTML elements.
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		protected unsetHtmlElements(): void {
			this._a11yInfoContainerElem = undefined;
			this.datePickerPlatformInputElem = undefined;
		}

		/**
		 * Build the Pattern
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
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
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			//Storing the current ExtendedClass, before possibly changing this property.
			//This will enable us to remove the previous added classes to the element.
			const oldExtendedClass = this.configs.ExtendedClass;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.FirstWeekDay:
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.MaxDate:
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.MinDate:
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.ShowTodayButton:
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.ShowWeekNumbers:
						this.prepareToAndRedraw();
						break;
					case OSFramework.OSUI.GlobalEnum.CommonPatternsProperties.ExtendedClass:
						// Since Calendar element will be added dynamically by the library outside the pattern context
						OSFramework.OSUI.Helper.Dom.Styles.ExtendedClass(
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
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public clear(): void {
			const isInputDisable = this.datePickerPlatformInputElem.disabled;
			if (isInputDisable === false) {
				this.provider.clear();
			}
		}

		/**
		 * Method used to close DatePicker
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public close(): void {
			if (this.provider.isOpen) {
				this.provider.close();
				if (this.configs.ShowTodayButton) {
					OSFramework.OSUI.Helper.A11Y.TabIndexFalse(this._todayButtonElem);
				}
			}
		}

		/**
		 * Method used to disable days on DatePicker
		 *
		 * @param disableDays
		 * @memberof Flatpickr.DisableDays
		 */
		public disableDays(disableDays: string[]): void {
			this.configs.DisabledDays = disableDays;
			this.prepareToAndRedraw();
		}

		/**
		 * Method used to disable weekdays on DatePicker
		 *
		 * @param disableWeekDays
		 * @memberof Flatpickr.DisableWeekDays
		 */
		public disableWeekDays(disableWeekDays: number[]): void {
			this.configs.DisabledWeekDays = disableWeekDays;

			this.prepareToAndRedraw();
		}

		/**
		 * Method to remove and destroy DatePicker instance
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public dispose(): void {
			if (this.isBuilt) {
				this.unsetCallbacks();
				this.unsetHtmlElements();

				if (this._bodyScrollCommonBehaviour !== undefined) {
					this._bodyScrollCommonBehaviour.dispose();
					this._bodyScrollCommonBehaviour = undefined;
				}

				// Wait for _datePickerProviderInputElem be removed from DOM, before destroy the provider instance!
				OSFramework.OSUI.Helper.AsyncInvocation(this.provider.destroy);
			}

			super.dispose();
		}

		/**
		 * Method used to update certain properties at OnRender
		 *
		 * @memberof AbstractFlatpickr
		 */
		public onRender(): void {
			// Get the current status of the platform input
			const isInputDisable = this.datePickerPlatformInputElem.disabled;

			// Ensure the platform input status has been updated to prevent multiple calls due to the OnRender event
			if (this._isPlatformInputDisabled !== isInputDisable) {
				this._isPlatformInputDisabled = isInputDisable;
				this._updateA11yProperties();
			}
		}

		/**
		 * Method used to open DatePicker
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public open(): void {
			const isInputDisable = this.datePickerPlatformInputElem.disabled;
			if (this.provider.isOpen === false && isInputDisable === false) {
				this.provider.open();

				// Focus on input element, after the open trigger occur
				if (this.flatpickrInputElem) {
					this.flatpickrInputElem.focus();
				}

				if (this.configs.ShowTodayButton) {
					OSFramework.OSUI.Helper.A11Y.TabIndexTrue(this._todayButtonElem);
				}
			}
		}

		/**
		 * Method used to regist callback events
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.OSUI.Patterns.DatePicker.Enum.DatePickerEvents.OnChange:
					this.onSelectedCallbackEvent = callback;
					break;

				default:
					super.registerCallback(eventName, callback);
					break;
			}
		}

		/**
		 * Method used to set the DatePicker as editable on its input
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public setEditableInput(isEditable: boolean): void {
			if (this.configs.AllowInput !== isEditable) {
				this.configs.AllowInput = isEditable;
				this.prepareToAndRedraw();
			}
		}

		/**
		 * Method used to set the DatePicker language
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public setLanguage(value: string): void {
			// Set the new Language
			this.configs.Lang = value.toLowerCase();

			// If provider has been already defined, calendar must be redrawed!
			if (this.provider !== undefined) {
				this.prepareToAndRedraw();
			}
		}

		/**
		 * Method used to set all the extended Flatpickr properties across the different types of instances
		 *
		 * @param {FlatpickrOptions} newConfigs
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public setProviderConfigs(newConfigs: FlatpickrOptions): void {
			this.configs.setExtensibilityConfigs(newConfigs);
			this.prepareToAndRedraw();
			super.setProviderConfigs(newConfigs);
		}

		/**
		 * Method used to update the prompt message
		 *
		 * @param promptMessage The new prompt message value
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.AbstractFlatpickr
		 */
		public updatePrompt(promptMessage: string): void {
			this.flatpickrInputElem.placeholder = promptMessage;
		}

		// Common methods all DatePickers must implement
		protected abstract onDateSelectedEvent(selectedDates: Array<Date>): void;
		protected abstract todayBtnClick(event: MouseEvent): void;
		protected abstract updatePlatformInputAttrs(): void;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		public abstract updateInitialDate(start: string, end?: string): void;
	}
}
