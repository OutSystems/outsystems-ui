// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.MonthPicker.Flatpickr {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrMonth
		extends OSFramework.Patterns.MonthPicker.AbstractMonthPicker<Flatpickr, FlatpickrMonthConfig>
		implements IFlatpickrMonth
	{
		protected _flatpickrInputElem: HTMLInputElement;
		// Store the provider options
		protected _flatpickrOpts: FlatpickrOptions;
		// Store pattern input HTML element reference
		protected _monthPickerProviderInputElem: HTMLInputElement;
		// Flatpickr onInitialize event
		protected _onInitializedCallbackEvent: OSFramework.GlobalCallbacks.OSGeneric;
		// Flatpickr onChange (SelectedMonth) event
		protected _onSelectedCallbackEvent: OSFramework.Patterns.MonthPicker.Callbacks.OSOnSelectedEvent;

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
			OSFramework.Helper.Dom.Attribute.Set(
				this._flatpickrInputElem,
				OSFramework.GlobalEnum.HTMLAttributes.DataInput,
				OSFramework.Constants.EmptyString
			);
		}

		// Method used to set the CSS classes to the pattern HTML elements
		private _setCalendarCssClasses(): void {
			OSFramework.Helper.Dom.Styles.AddClass(
				this.provider.calendarContainer,
				OSFramework.Patterns.MonthPicker.Enum.CssClass.Dropdown
			);

			if (
				OSFramework.Helper.Dom.Styles.ContainsClass(
					this._flatpickrInputElem,
					OSFramework.GlobalEnum.InputTypes.InputLarge
				)
			) {
				OSFramework.Helper.Dom.Styles.AddClass(
					this.provider.calendarContainer,
					OSFramework.Patterns.Dropdown.Enum.CssClass.DropdownLarge
				);
			} else if (
				OSFramework.Helper.Dom.Styles.ContainsClass(
					this._flatpickrInputElem,
					OSFramework.GlobalEnum.InputTypes.InputSmall
				)
			) {
				OSFramework.Helper.Dom.Styles.AddClass(
					this.provider.calendarContainer,
					OSFramework.Patterns.Dropdown.Enum.CssClass.DropdownSmall
				);
			}

			// Check if there are any ExtendedClass to be added into our dropdown elements
			if (this.configs.ExtendedClass !== '') {
				OSFramework.Helper.Dom.Styles.ExtendedClass(
					this.provider.calendarContainer,
					'',
					this.configs.ExtendedClass
				);
			}
		}

		// Method to set the html elements used
		private _setHtmlElements(): void {
			// Set the inputHTML element
			this._monthPickerProviderInputElem = this._selfElem.querySelector(
				OSFramework.GlobalEnum.CSSSelectors.InputFormControl
			);

			// If the input hasn't be added
			if (!this._monthPickerProviderInputElem) {
				throw new Error(`The monthpicker input at MonthpickerId '${this._widgetId}' is missing`);
			}
		}

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
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
			}

			this.createdInstance();
		}

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected createdInstance(): void {
			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Name,
				version: SharedProviderResources.Flatpickr.Enum.ProviderInfo.Version,
				events: this.provider.config,
			});

			// Trigger platform's InstanceIntializedHandler client Action
			this.triggerPlatformEventInitialized(this._onInitializedCallbackEvent);
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
				month: OSFramework.Constants.EmptyString,
				year: OSFramework.Constants.InvalidNumber,
			};

			// Check if any date has been selected, In case of Clear this will return empty string
			if (selectedMonthYear.length > 0) {
				const _selectedDate = new Date(selectedMonthYear[0]);
				_selectedMonthYear.month = OSFramework.Constants.Months[_selectedDate.getMonth()];
				_selectedMonthYear.year = _selectedDate.getFullYear();
			}

			// Trigger platform's onChange callback event
			OSFramework.Helper.AsyncInvocation(
				this._onSelectedCallbackEvent,
				this.widgetId,
				_selectedMonthYear.month,
				_selectedMonthYear.year
			);
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Flatpickr.Month
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this._flatpickrOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
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

			this._onInitializedCallbackEvent = undefined;
			this._onSelectedCallbackEvent = undefined;
		}

		/**
		 * Unsets the references to the HTML elements.
		 *
		 * @protected
		 * @memberof AbstractFlatpickr
		 */
		protected unsetHtmlElements(): void {
			this._monthPickerProviderInputElem = undefined;
		}
		public build(): void {
			super.build();

			this._setHtmlElements();

			this.prepareConfigs();

			this.finishBuild();
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
					case OSFramework.Patterns.MonthPicker.Enum.Properties.InitialMonth:
					case OSFramework.Patterns.MonthPicker.Enum.Properties.DateFormat:
					case OSFramework.Patterns.MonthPicker.Enum.Properties.MaxMonth:
					case OSFramework.Patterns.MonthPicker.Enum.Properties.MinMonth:
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
		 * Method used to close MonthPicker
		 *
		 * @memberof AbstractFlatpickr
		 */
		public close(): void {
			this.provider.close();
		}

		/**
		 * Method to remove and destroy MonthPicker instance
		 *
		 * @memberof AbstractFlatpickr
		 */
		public dispose(): void {
			if (this.isBuilt) {
				// Wait for _monthPickerProviderInputElem be removed from DOM, before detroy the provider instance!
				OSFramework.Helper.AsyncInvocation(this.provider.destroy);
			}

			super.dispose();
		}

		/**
		 * Method used to open MonthPicker
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
				case OSFramework.Patterns.MonthPicker.Enum.Events.OnSelected:
					this._onSelectedCallbackEvent = callback;
					break;

				case OSFramework.Patterns.MonthPicker.Enum.Events.OnInitialized:
					this._onInitializedCallbackEvent = callback;
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}

		/**
		 * Method used to set the MonthPicker language
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
	}
}
