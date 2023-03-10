// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.MonthPicker.Flatpickr {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrMonth
		extends OSFramework.OSUI.Patterns.MonthPicker.AbstractMonthPicker<Flatpickr, FlatpickrMonthConfig>
		implements IFlatpickrMonth
	{
		// Event OnBodyScroll common behaviour
		private _bodyScrollCommonBehaviour: SharedProviderResources.Flatpickr.UpdatePositionOnScroll;
		// Store the provider options
		private _flatpickrOpts: FlatpickrOptions;
		// Flatpickr onInitialize event
		private _onInitializeCallbackEvent: OSFramework.OSUI.GlobalCallbacks.OSGeneric;
		// Validation of ZIndex position common behavior
		private _zindexCommonBehavior: SharedProviderResources.Flatpickr.UpdateZindex;
		// Store the flatpickr input html element that will be added by library
		protected _flatpickrInputElem: HTMLInputElement;
		// Store pattern input HTML element reference
		protected _monthPickerProviderInputElem: HTMLInputElement;
		// Flatpickr onChange (SelectedMonth) event
		protected _onSelectedCallbackEvent: OSFramework.OSUI.Patterns.MonthPicker.Callbacks.OSOnSelectedEvent;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrMonthConfig(configs));

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnChange = this.onMonthSelectedEvent.bind(this);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._monthPickerProviderInputElem.nextSibling as HTMLInputElement;

			// Added the data-input attribute in order to input be styled as all platform inputs
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this._flatpickrInputElem,
				OSFramework.OSUI.GlobalEnum.HTMLAttributes.DataInput,
				OSFramework.OSUI.Constants.EmptyString
			);
		}

		// Method used to set the CSS classes to the pattern HTML elements
		private _setCalendarCssClasses(): void {
			OSFramework.OSUI.Helper.Dom.Styles.AddClass(
				this.provider.calendarContainer,
				OSFramework.OSUI.Patterns.MonthPicker.Enum.CssClass.Dropdown
			);

			if (
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
					this._flatpickrInputElem,
					OSFramework.OSUI.GlobalEnum.InputClassTypes.InputLarge
				)
			) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(
					this.provider.calendarContainer,
					OSFramework.OSUI.Patterns.Dropdown.Enum.CssClass.DropdownLarge
				);
			} else if (
				OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
					this._flatpickrInputElem,
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
			if (this._monthPickerProviderInputElem && this._flatpickrOpts.defaultDate === undefined) {
				this._monthPickerProviderInputElem.value = '';
			}

			// Init provider
			this.provider = window.flatpickr(this._monthPickerProviderInputElem, this._flatpickrOpts);
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
			}

			this.createdInstance();
		}

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected createdInstance(): void {
			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Name,
				version: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Version,
				events: this.provider.config,
			});

			// Trigger platform's InstanceIntializedHandler client Action
			this.triggerPlatformEventInitialized(this._onInitializeCallbackEvent);
		}

		/**
		 * Method that will be triggered by library each month and year is selected
		 *
		 * @protected
		 * @param {string[]} selectedMonthYear
		 * @memberof OSUIFlatpickrMonth
		 */
		protected onMonthSelectedEvent(selectedMonthYear: string[]): void {
			// Default values to null values, so that a null date comes from the picker, we pass it correctly as null to the platform
			// and without the need to run the code below
			const _selectedMonthYear = {
				month: OSFramework.OSUI.Constants.EmptyString,
				monthOrder: OSFramework.OSUI.Constants.InvalidNumber,
				year: OSFramework.OSUI.Constants.InvalidNumber,
			};

			// Check if any date has been selected, In case of Clear this will return empty string
			if (selectedMonthYear.length > 0) {
				const _selectedDate = new Date(selectedMonthYear[0]);
				const _selectedMonthIndex = _selectedDate.getMonth();

				_selectedMonthYear.month = OSFramework.OSUI.Constants.Months[_selectedMonthIndex];
				// Provider works with index starting on 0 but we need to match with real month number, so we increment 1
				_selectedMonthYear.monthOrder = _selectedMonthIndex + 1;
				_selectedMonthYear.year = _selectedDate.getFullYear();
			}

			// Trigger platform's onChange callback event
			OSFramework.OSUI.Helper.AsyncInvocation(
				this._onSelectedCallbackEvent,
				this.widgetId,
				_selectedMonthYear.month,
				_selectedMonthYear.monthOrder,
				_selectedMonthYear.year
			);
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
			console.warn(OSFramework.OSUI.GlobalEnum.WarningMessages.MethodNotImplemented);
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
			this._monthPickerProviderInputElem = this.selfElement.querySelector(
				OSFramework.OSUI.GlobalEnum.CSSSelectors.InputFormControl
			);

			// If the input hasn't be added
			if (!this._monthPickerProviderInputElem) {
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
			this.configs.OnChange = undefined;

			this._onInitializeCallbackEvent = undefined;
			this._onSelectedCallbackEvent = undefined;
		}

		/**
		 * Unsets the references to the HTML elements.
		 *
		 * @protected
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		protected unsetHtmlElements(): void {
			this._monthPickerProviderInputElem = undefined;
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth
		 */
		public build(): void {
			super.build();

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
			this.provider.clear();
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
			const isInputDisable = this._monthPickerProviderInputElem.disabled;
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
					this._onSelectedCallbackEvent = callback;
					break;

				case OSFramework.OSUI.Patterns.MonthPicker.Enum.Events.OnInitialized:
					this._onInitializeCallbackEvent = callback;
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
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
		}
	}
}
