// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.MonthPicker.Flatpickr {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrMonth
		extends OSFramework.OSUI.Patterns.MonthPicker.AbstractMonthPicker<Flatpickr, FlatpickrMonthConfig>
		implements IFlatpickrMonth
	{
		// Store container HTML element reference that contains an explanation about how to navigate through calendar with keyboard
		private _a11yInfoContainerElem: HTMLElement;
		// Store the instance of bodyOnClick global event
		private _bodyOnClickGlobalEvent: OSFramework.OSUI.Event.DOMEvents.Listeners.IListener;
		// Event OnBodyScroll common behaviour
		private _bodyScrollCommonBehaviour: SharedProviderResources.Flatpickr.UpdatePositionOnScroll;
		// Store the provider options
		private _flatpickrOpts: FlatpickrOptions;
		// Validation of ZIndex position common behavior
		private _zindexCommonBehavior: SharedProviderResources.Flatpickr.UpdateZindex;
		// Store the flatpickr input html element that will be added by library
		protected flatpickrInputElem: HTMLInputElement;
		// Store pattern input HTML element reference
		protected monthPickerPlatformInputElem: HTMLInputElement;
		// Flatpickr onChange (SelectedMonth) event
		protected onSelectedCallbackEvent: OSFramework.OSUI.Patterns.MonthPicker.Callbacks.OSOnSelectedEvent;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrMonthConfig(configs));

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnChangeEventCallback = this.onMonthSelectedEvent.bind(this);
			this.configs.OnCloseEventCallback = this.onClose.bind(this);
			this.configs.OnOpenEventCallback = this.onOpen.bind(this);
		}

		/**
		 * Method that will get the instance of the Global onBodyClick event.
		 *
		 * @private
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		private _getBodyOnClickGlobalEvent(): void {
			this._bodyOnClickGlobalEvent =
				OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.events.get(
					OSFramework.OSUI.Event.DOMEvents.Listeners.Type.BodyOnClick
				);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this.flatpickrInputElem = this.monthPickerPlatformInputElem.nextSibling as HTMLInputElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.flatpickrInputElem,
				OSFramework.OSUI.GlobalEnum.HTMLAttributes.DataInput,
				OSFramework.OSUI.Constants.EmptyString
			);

			// If the provider cloned a disabled platform input, remove the disable attribute form the provider input
			if (this.flatpickrInputElem.disabled) {
				OSFramework.OSUI.Helper.Dom.Attribute.Remove(
					this.flatpickrInputElem,
					OSFramework.OSUI.GlobalEnum.HTMLAttributes.Disabled
				);
			}
		}

		// Method used to set the CSS classes to the pattern HTML elements
		private _setCalendarCssClasses(): void {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(
				this.provider.calendarContainer,
				OSFramework.OSUI.Patterns.MonthPicker.Enum.CssClass.Dropdown
			);

			if (
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
					this.flatpickrInputElem,
					OSFramework.OSUI.GlobalEnum.InputClassTypes.InputLarge
				)
			) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(
					this.provider.calendarContainer,
					OSFramework.OSUI.Patterns.Dropdown.Enum.CssClass.DropdownLarge
				);
			} else if (
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
					this.flatpickrInputElem,
					OSFramework.OSUI.GlobalEnum.InputClassTypes.InputSmall
				)
			) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(
					this.provider.calendarContainer,
					OSFramework.OSUI.Patterns.Dropdown.Enum.CssClass.DropdownSmall
				);
			}

			// Check if there are any ExtendedClass to be added into our dropdown elements
			if (this.configs.ExtendedClass !== '') {
				OSFramework.OSUI.Helper.Dom.Styles.ExtendedClass(
					this.provider.calendarContainer,
					'',
					this.configs.ExtendedClass
				);
			}
		}

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected createProviderInstance(): void {
			/* In order to avoid dateFormat convert issues done by provider when InitialMonth was not defined and input has a default month lets clean that value before creating provider instance. This happen when DateFormat is different from YYYY-MM-DD */
			if (this.monthPickerPlatformInputElem && this._flatpickrOpts.defaultDate === undefined) {
				this.monthPickerPlatformInputElem.value = OSFramework.OSUI.Constants.EmptyString;
			}

			// Init provider
			this.provider = window.flatpickr(this.monthPickerPlatformInputElem, this._flatpickrOpts);
			// Set the needed HTML attributes
			this._setAttributes();

			// Add our CSS classes to the input
			if (this.provider.calendarContainer !== undefined) {
				// Set Calendar CSS classes
				this._setCalendarCssClasses();

				// set the onBodyScroll update calendar position behaviour!
				this._bodyScrollCommonBehaviour = new SharedProviderResources.Flatpickr.UpdatePositionOnScroll(this);

				// set the zindex update position behaviour!
				this._zindexCommonBehavior = new SharedProviderResources.Flatpickr.UpdateZindex(this);

				// Trigger the platform update attribute value change!
				OSFramework.OSUI.Helper.Dom.SetInputValue(
					this.monthPickerPlatformInputElem,
					(this.monthPickerPlatformInputElem.nextSibling as HTMLInputElement).value
				);
			}

			this.updatePlatformInputAttrs();

			this.setA11YProperties();

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Name,
				version: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Version,
				events: this.provider.config,
			});

			/**
			 * Trigger Innitialized Event.
			 * - This is needed for the patterns based on a provider since at the Initialized Event at the
			 * Platform side, custom code can be added in order to add customization to the provider.
			 * - This way, Initialized Event will be triggered every time a redraw occurs.
			 */
			this.triggerPlatformInitializedEventCallback();
		}

		/**
		 * Method that will be triggered each time MonthPicker will be closed
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected onClose(): void {
			// Check if bodyOnClickEvent exist
			if (this._bodyOnClickGlobalEvent !== undefined) {
				// Enabled it since MonthPicker has been closed
				this._bodyOnClickGlobalEvent.enableBodyClickEvent();
			}
		}

		/**
		 * Method that will be triggered by library each month and year is selected
		 *
		 * @protected
		 * @param {string[]} selectedMonthYear
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected onMonthSelectedEvent(selectedMonthYear: Array<Date>): void {
			// Default values to null values, so that a null date comes from the picker, we pass it correctly as null to the platform
			// and without the need to run the code below
			const _selectedMonthYear = {
				month: OSFramework.OSUI.Constants.EmptyString,
				monthOrder: OSFramework.OSUI.Constants.InvalidNumber,
				year: OSFramework.OSUI.Constants.InvalidNumber,
			};

			// Check if any date has been selected, In case of Clear this will return empty string
			if (selectedMonthYear.length > 0) {
				const _selectedDate = selectedMonthYear[0];
				const _selectedMonthIndex = _selectedDate.getMonth();

				_selectedMonthYear.month = OSFramework.OSUI.Constants.Months[_selectedMonthIndex];
				// Provider works with index starting on 0 but we need to match with real month number, so we increment 1
				_selectedMonthYear.monthOrder = _selectedMonthIndex + 1;
				_selectedMonthYear.year = _selectedDate.getFullYear();
			} else {
				/**
				 * For some reason, platform local var do no gets updated with an empty string, that said, set an empty char to it!
				 * At the next iteraction DOM value will be updated accordingly.
				 */
				OSFramework.OSUI.Helper.Dom.SetInputValue(this.monthPickerPlatformInputElem, ' ');
			}

			// Trigger the platform update attribute value change!
			OSFramework.OSUI.Helper.Dom.SetInputValue(this.monthPickerPlatformInputElem, this.flatpickrInputElem.value);

			// Trigger platform's onChange callback event
			this.triggerPlatformEventCallback(
				this.onSelectedCallbackEvent,
				_selectedMonthYear.month,
				_selectedMonthYear.monthOrder,
				_selectedMonthYear.year
			);
		}

		/**
		 * Method that will be triggered each time MonthPicker will open
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected onOpen(): void {
			// Check if bodyOnClickEvent exist
			if (this._bodyOnClickGlobalEvent !== undefined) {
				// Disabled it since MonthPicker will be open
				this._bodyOnClickGlobalEvent.disableBodyClickEvent();
			}
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this._flatpickrOpts = this.configs.getProviderConfig();
			// Instance will be Created!
			this.createProviderInstance();
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected setA11YProperties(): void {
			// This is needed once library set it as an hidden by default which can not be since otherwise the updating it's value will not be triggered the local variable update.
			// Since this will be hidden through css, in terms of accessibility it should not be "visible"!
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.monthPickerPlatformInputElem,
				OSFramework.OSUI.Constants.A11YAttributes.TabIndex,
				OSFramework.OSUI.Constants.A11YAttributes.States.TabIndexHidden
			);
			// Ensure datePickerPlatformInputElem will also be hidden for ScreenReaders
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.monthPickerPlatformInputElem,
				OSFramework.OSUI.Constants.A11YAttributes.Aria.Hidden,
				OSFramework.OSUI.Constants.A11YAttributes.States.True
			);
			// Ensure A11yContainer will not be direclty visible
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this._a11yInfoContainerElem,
				OSFramework.OSUI.Constants.A11YAttributes.Aria.Hidden,
				OSFramework.OSUI.Constants.A11YAttributes.States.True
			);
			// Ensure flatpickrInputElem has active tabindex
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.flatpickrInputElem,
				OSFramework.OSUI.Constants.A11YAttributes.TabIndex,
				OSFramework.OSUI.Constants.A11YAttributes.States.TabIndexShow
			);

			// Set the default aria-label value attribute in case user didn't set it!
			let ariaLabelValue = Enum.Attribute.DefaultAriaLabel as string;

			// Check if aria-label attribute has been added to the default input
			if (this.monthPickerPlatformInputElem.hasAttribute(OSFramework.OSUI.Constants.A11YAttributes.Aria.Label)) {
				ariaLabelValue = this.monthPickerPlatformInputElem.getAttribute(
					OSFramework.OSUI.Constants.A11YAttributes.Aria.Label
				);
			}

			// Set the aria-label attribute value
			OSFramework.OSUI.Helper.A11Y.AriaLabel(this.flatpickrInputElem, ariaLabelValue);
			// Set the aria-describedby attribute in order to give more context about how to navigate into calendar using keyboard
			OSFramework.OSUI.Helper.A11Y.AriaDescribedBy(this.flatpickrInputElem, this._a11yInfoContainerElem.id);

			// Check if lang is not EN (default one)
			if (this.configs.Lang !== OSFramework.OSUI.Constants.Language.short) {
				// Update A11yContainer info based on the given language
				this._a11yInfoContainerElem.innerHTML =
					MonthPicker.Flatpickr.l10ns.A11yContainerInfo[this.configs.Lang] !== undefined
						? MonthPicker.Flatpickr.l10ns.A11yContainerInfo[this.configs.Lang].htmlTex
						: MonthPicker.Flatpickr.l10ns.A11yContainerInfo.en.htmlTex;
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected setCallbacks(): void {
			console.log(OSFramework.OSUI.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected setHtmlElements(): void {
			// Set the inputHTML element
			this.monthPickerPlatformInputElem = this.selfElement.querySelector(
				OSFramework.OSUI.GlobalEnum.CSSSelectors.InputFormControl
			);

			// Store the reference to the info container about how to use keyboard to navigate through calendar
			this._a11yInfoContainerElem = OSFramework.OSUI.Helper.Dom.TagSelector(
				this.selfElement.parentElement,
				OSFramework.OSUI.Constants.Dot + Enum.CssClasses.AccessibilityContainerInfo
			);

			// If the input hasn't be added
			if (!this.monthPickerPlatformInputElem) {
				throw new Error(`The monthpicker input at MonthpickerId '${this.widgetId}' is missing`);
			}
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected unsetCallbacks(): void {
			this.configs.OnChangeEventCallback = undefined;
			this.configs.OnCloseEventCallback = undefined;
			this.configs.OnOpenEventCallback = undefined;

			this.onSelectedCallbackEvent = undefined;
			super.unsetCallbacks();
		}

		/**
		 * Unsets the references to the HTML elements.
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected unsetHtmlElements(): void {
			this.monthPickerPlatformInputElem = undefined;
		}

		/**
		 * Used to set needed properties to the platform input.
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected updatePlatformInputAttrs(): void {
			// Set the type attribute value
			// This is needed once library set it as an hidden by default which can not be since otherwise the updating it's value will not be triggered the local variable update. That said it will be hidden through CSS!
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.monthPickerPlatformInputElem,
				OSFramework.OSUI.GlobalEnum.HTMLAttributes.Type,
				OSFramework.OSUI.GlobalEnum.InputTypeAttr.Text
			);
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public build(): void {
			super.build();
			this._getBodyOnClickGlobalEvent();
			this.setHtmlElements();
			this.prepareConfigs();
			this.finishBuild();
		}

		/**
		 * Method used to change given propertyName at OnParametersChange platform event
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			//Storing the current ExtendedClass, before possibly changing this property.
			//This will enable us to remove the previous added classes to the element.
			const oldExtendedClass = this.configs.ExtendedClass;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.OSUI.Patterns.MonthPicker.Enum.Properties.InitialMonth:
					case OSFramework.OSUI.Patterns.MonthPicker.Enum.Properties.DateFormat:
					case OSFramework.OSUI.Patterns.MonthPicker.Enum.Properties.MaxMonth:
					case OSFramework.OSUI.Patterns.MonthPicker.Enum.Properties.MinMonth:
						this.redraw();
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
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public clear(): void {
			const isInputDisable = this.monthPickerPlatformInputElem.disabled;
			if (isInputDisable === false) {
				this.provider.clear();
			}
		}

		/**
		 * Method used to close MonthPicker
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public close(): void {
			if (this.provider.isOpen) {
				this.provider.close();
			}
		}

		/**
		 * Method to remove and destroy MonthPicker instance
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public dispose(): void {
			if (this.isBuilt) {
				this.unsetCallbacks();
				this.unsetHtmlElements();

				if (this._bodyScrollCommonBehaviour !== undefined) {
					this._bodyScrollCommonBehaviour.dispose();
					this._bodyScrollCommonBehaviour = undefined;
				}

				// Wait for _monthPickerProviderInputElem be removed from DOM, before detroy the provider instance!
				OSFramework.OSUI.Helper.AsyncInvocation(this.provider.destroy);
			}

			super.dispose();
		}

		/**
		 * Method used to open MonthPicker
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public open(): void {
			const isInputDisable = this.monthPickerPlatformInputElem.disabled;
			if (this.provider.isOpen === false && isInputDisable === false) {
				this.provider.open();
			}
		}

		/**
		 * Method used to regist callback events
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.OSUI.Patterns.MonthPicker.Enum.Events.OnSelected:
					this.onSelectedCallbackEvent = callback;
					break;

				default:
					super.registerCallback(eventName, callback);
					break;
			}
		}

		/**
		 * Method used to set the MonthPicker as editable on its input
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public setEditableInput(isEditable: boolean): void {
			if (this.configs.AllowInput !== isEditable) {
				this.configs.AllowInput = isEditable;
				this.redraw();
			}
		}

		/**
		 * Method used to set the MonthPicker language
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
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
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public setProviderConfigs(newConfigs: FlatpickrOptions): void {
			this.configs.setExtensibilityConfigs(newConfigs);

			this.redraw();

			super.setProviderConfigs(newConfigs);
		}
		/**
		 * Method used to update the InitialMonth config value
		 *
		 * @param {string} value The new InitialMonth value that will be set
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public updateInitialMonth(monthYear: MonthYear): void {
			if (this.monthPickerPlatformInputElem.disabled === false) {
				// Redefine the Initial month
				this.configs.InitialMonth = monthYear;

				// Trigger the Redraw method in order to update calendar with this new value
				this.redraw();
			}
		}

		/**
		 * Method used to update the prompt message
		 *
		 * @param promptMessage The new prompt message value
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public updatePrompt(promptMessage: string): void {
			this.flatpickrInputElem.placeholder = promptMessage;
		}
	}
}
