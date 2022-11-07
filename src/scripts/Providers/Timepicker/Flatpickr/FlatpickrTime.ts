// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.TimePicker.Flatpickr {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrTime
		extends OSFramework.Patterns.TimePicker.AbstractTimePicker<Flatpickr, FlatpickrTimeConfig>
		implements IFlatpickrTime
	{
		// Event OnBodyScroll common behaviour
		private _bodyScrollCommonBehaviour: SharedProviderResources.Flatpickr.UpdatePositionOnScroll;
		// Store the provider options
		private _flatpickrOpts: FlatpickrOptions;
		// Flatpickr onInitialize event
		private _onInitializeCallbackEvent: OSFramework.GlobalCallbacks.OSGeneric;
		// Validation of ZIndex position common behavior
		private _zindexCommonBehavior: SharedProviderResources.Flatpickr.UpdateZindex;
		// Store the flatpickr input html element that will be added by library
		protected _flatpickrInputElem: HTMLInputElement;
		// Flatpickr onChange (SelectedTime) event
		protected _onChangeCallbackEvent: OSFramework.Patterns.TimePicker.Callbacks.OSOnChangeEvent;
		// Store pattern input HTML element reference
		protected _timePickerProviderInputElem: HTMLInputElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrTimeConfig(configs));

			// Set the default library Event handler that will be used to set on the provider configs
			this.configs.OnChange = this.onTimeSelectedEvent.bind(this);
		}

		// Method used to set the needed HTML attributes
		private _setAttributes(): void {
			// Since a new input will be added by the flatpickr library, we must address it only at onReady
			this._flatpickrInputElem = this._timePickerProviderInputElem.nextSibling as HTMLInputElement;

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
				OSFramework.Patterns.TimePicker.Enum.CssClass.Dropdown
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

		/**
		 * Method that will be triggered at Flatpickr instance is ready
		 *
		 * @protected
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		protected createProviderInstance(): void {
			/* In order to avoid dateFormat convert issues done by provider when InitialTime was not defined and input has a default time lets clean that value before creating provider instance. This happen when DateFormat is different from YYYY-MM-DD */
			if (this._timePickerProviderInputElem && this._flatpickrOpts.defaultDate === undefined) {
				this._timePickerProviderInputElem.value = '';
			}

			// Init provider
			this.provider = window.flatpickr(this._timePickerProviderInputElem, this._flatpickrOpts);
			// Set the needed HTML attributes
			this._setAttributes();

			// Since Flatpickr has a native behaviour (by default) if a mobile device is in use, we must ensure we can add our Classes and TodayBtn to it, since if it's native behaviour we can't do it!
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
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
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

		// Method that will be triggered by library each time any time is selected
		protected onTimeSelectedEvent(selectedTime: string[]): void {
			/* NOTE: timeStr param is not in use since the library has an issue arround it */
			let _selectedTime = '';

			// Check if any time has been selected, In case of Clear this will return empty string
			if (selectedTime.length > 0) {
				_selectedTime = this.provider.formatDate(selectedTime[0], this._flatpickrOpts.dateFormat);
			}

			// Trigger platform's onChange callback event
			OSFramework.Helper.AsyncInvocation(this._onChangeCallbackEvent, this.widgetId, _selectedTime);
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
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
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		protected setA11YProperties(): void {
			console.warn(OSFramework.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		protected setCallbacks(): void {
			console.log(OSFramework.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		protected setHtmlElements(): void {
			// Set the inputHTML element
			this._timePickerProviderInputElem = this.selfElement.querySelector(
				OSFramework.GlobalEnum.CSSSelectors.InputFormControl
			);

			// If the input hasn't be added
			if (!this._timePickerProviderInputElem) {
				throw new Error(`The timepicker input at TimepickerId '${this.widgetId}' is missing`);
			}
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
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
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		protected unsetHtmlElements(): void {
			this._timePickerProviderInputElem = undefined;
		}

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
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			//Storing the current ExtendedClass, before possibly changing this property.
			//This will enable us to remove the previous added classes to the element.
			const oldExtendedClass = this.configs.ExtendedClass;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.Patterns.TimePicker.Enum.Properties.InitialTime:
					case OSFramework.Patterns.TimePicker.Enum.Properties.Is24Hours:
					case OSFramework.Patterns.TimePicker.Enum.Properties.MaxTime:
					case OSFramework.Patterns.TimePicker.Enum.Properties.MinTime:
					case OSFramework.Patterns.TimePicker.Enum.Properties.TimeFormat:
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
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public clear(): void {
			this.provider.clear();
		}

		/**
		 * Method used to close TimePicker
		 *
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public close(): void {
			this.provider.close();
		}

		/**
		 * Method to remove and destroy TimePicker instance
		 *
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public dispose(): void {
			if (this.isBuilt) {
				this.unsetCallbacks();
				this.unsetHtmlElements();

				if (this._bodyScrollCommonBehaviour !== undefined) {
					this._bodyScrollCommonBehaviour.dispose();
					this._bodyScrollCommonBehaviour = undefined;
				}

				// Wait for _datePickerProviderInputElem be removed from DOM, before detroy the provider instance!
				OSFramework.Helper.AsyncInvocation(this.provider.destroy);
			}

			super.dispose();
		}

		/**
		 * Method used to open TimePicker
		 *
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public open(): void {
			this.provider.open();
		}

		/**
		 * Method used to regist callback events
		 *
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public registerCallback(eventName: string, callback: OSFramework.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.Patterns.TimePicker.Enum.TimePickerEvents.OnChange:
					this._onChangeCallbackEvent = callback;
					break;

				case OSFramework.Patterns.TimePicker.Enum.TimePickerEvents.OnInitialized:
					this._onInitializeCallbackEvent = callback;
					break;

				default:
					throw new Error(`The given '${eventName}' event name it's not defined.`);
			}
		}
		/**
		 * Method used to set the TimePicker as editable on its input
		 *
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public setEditableInput(isEditable: boolean): void {
			if (this.configs.AllowInput !== isEditable) {
				this.configs.AllowInput = isEditable;
				this.redraw();
			}
		}

		/**
		 * Method used to set the TimePicker language
		 *
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
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
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public setProviderConfigs(newConfigs: FlatpickrOptions): void {
			this.configs.setExtensibilityConfigs(newConfigs);

			this.redraw();
		}

		/**
		 * Method used to toggle the default native behavior of TimePicker
		 *
		 * @memberof Providers.TimePicker.Flatpickr.OSUIFlatpickrTime
		 */
		public toggleNativeBehavior(isNative: boolean): void {
			// Invert the boolean value of IsNative because of provider option
			if (this.configs.DisableMobile !== !isNative) {
				this.configs.DisableMobile = !isNative;
				this.redraw();
			}
		}

		/**
		 * Method used to update the InitialTime config value
		 *
		 * @param {string} value The new InitialTime value that will be set
		 * @memberof OSUIFlatpickrTime
		 */
		public updateInitialTime(value: string): void {
			// Redefine the Initial time
			this.configs.InitialTime = value;
			// Trigger the Redraw method in order to update calendar with this new value
			this.redraw();
		}
	}
}
