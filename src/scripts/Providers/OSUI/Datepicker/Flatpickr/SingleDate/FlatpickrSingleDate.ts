/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Datepicker.Flatpickr.SingleDate {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		// Flag to be used to prevent trigger the OnSelectedDate platform callback when InitialDate is being updated through Client Action!
		private _isUpdatedInitialDateByClientAction = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));
		}

		// Function to check which InitialDate must be defined on Datepicker
		private _checkInitialDate(): void {
			let clearPlatformInput = false;

			// check initial date on Datepicker and plataform input
			if (OSFramework.OSUI.Helper.Dates.IsNull(this.configs.InitialDate)) {
				// Check if the input value is valid and is filled
				if (
					this.datePickerPlatformInputElem.value !== OSFramework.OSUI.Constants.EmptyString &&
					OSFramework.OSUI.Helper.Dates.IsValid(this.datePickerPlatformInputElem.value)
				) {
					this.configs.InitialDate = new Date(this.datePickerPlatformInputElem.value);
				} else {
					// If the date isn't valid, the platform input value will be removed
					clearPlatformInput = true;
				}
			} else if (this.datePickerPlatformInputElem.value !== OSFramework.OSUI.Constants.EmptyString) {
				// If the InitialDate is defined, the platform input value will be removed
				clearPlatformInput = true;
			}

			// Remove the platform input value
			if (clearPlatformInput) {
				OSFramework.OSUI.Helper.Dom.Attribute.Set(
					this.datePickerPlatformInputElem,
					OSFramework.OSUI.GlobalEnum.HTMLAttributes.Value,
					OSFramework.OSUI.Constants.EmptyString
				);
			}

			this.prepareConfigs();
		}

		/**
		 * Method that will be triggered by library each time any date is selected and will also trigger the input update value and also trigger the OnSelectedDate platform event callback!
		 *
		 * @protected
		 * @param {string[]} selectedDates Array of selected dates
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		protected onDateSelectedEvent(selectedDates: Array<Date>): void {
			// Store selected date with the expected dateFormat as a string type
			let _selectedDate = '';

			// Check if any date has been selected, In case of Clear this will return empty array
			if (selectedDates.length > 0) {
				_selectedDate = this.provider.formatDate(
					selectedDates[0],
					this.provider.config.enableTime ? 'Y-m-d H:i:S' : 'Y-m-d'
				);
			}

			// Trigger the platform update attribute value change!
			OSFramework.OSUI.Helper.Dom.SetInputValue(this.datePickerPlatformInputElem, _selectedDate);

			// Check if values are not beeing updated by UpdateInitialDate API Method!
			if (this._isUpdatedInitialDateByClientAction === false) {
				// Trigger platform's onChange callback event
				this.triggerPlatformEventCallback(this.onSelectedCallbackEvent, _selectedDate);
			}

			// Reset Flag value;
			this._isUpdatedInitialDateByClientAction = false;
		}

		/**
		 * The method used to prepare the pattern before being redrawn in order to prevent possible flickering.
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		protected prepareToAndRedraw(): void {
			// Ensure the Flag value is reset at the redraw!
			this._isUpdatedInitialDateByClientAction = false;

			super.prepareToAndRedraw();
		}

		/**
		 * Trigger the jumToDate to now and trigger the Now as a selected Date!
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		protected todayBtnClick(event: MouseEvent): void {
			event.preventDefault();
			// Set the currentDate at the Datepicker
			this.provider.setDate(this.provider.now, true);
			// Trigger the jumpIntoDate!
			this.jumpIntoToday();
		}

		/**
		 * Update platform input attributes in order to maintain consistency with data type!
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		protected updatePlatformInputAttrs(): void {
			// Set the type attribute value accordingly
			const dateType =
				this.configs.TimeFormat === OSFramework.OSUI.Patterns.DatePicker.Enum.TimeFormatMode.Disable
					? OSFramework.OSUI.GlobalEnum.InputTypeAttr.Date
					: OSFramework.OSUI.GlobalEnum.InputTypeAttr.DateTime;

			// Set the type attribute value
			// This is needed once library set it as an hidden by default which can not be since otherwise the updating it's value will not be triggered the local variable update. That said it will be hidden through CSS!
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.datePickerPlatformInputElem,
				OSFramework.OSUI.GlobalEnum.HTMLAttributes.Type,
				dateType
			);
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		public build(): void {
			super.build();
			this._checkInitialDate();
			this.finishBuild();
		}

		/**
		 * Method used to change given propertyName at OnParametersChange platform event
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// Flag to help on dealing with the redraw when InitialDate has been changed
			let redrawAtInitialDateChange = false;
			// Check if the property to be changed is the InitialDate
			if (propertyName === Enum.Properties.InitialDate) {
				// Store the new Date value
				const newDateValue = propertyValue as Date;
				// Store (if exist) the selected date stored at the provider context
				const providerSelectedDate =
					this.provider?.selectedDates.length > 0
						? (new Date(this.provider.selectedDates[0]) as Date)
						: undefined;

				// Check if InitialDate has been "asked" to be changed dynamically without user selected a date at calendar!
				if (providerSelectedDate === undefined || providerSelectedDate.getTime() !== newDateValue.getTime()) {
					redrawAtInitialDateChange = true;
				}
			}

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.DateFormat:
						// Check if any Date was selected
						if (this.provider.selectedDates.length > 0) {
							// Set the new DefaultDate values
							this.configs.InitialDate = this.provider.formatDate(
								this.provider.selectedDates[0],
								this.flatpickrOpts.dateFormat
							);
						}
						this.prepareToAndRedraw();
						break;

					case Enum.Properties.InitialDate:
						// Check if redraw can be occur!
						if (redrawAtInitialDateChange) {
							this.prepareToAndRedraw();
						}
						break;
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.TimeFormat:
						this.prepareToAndRedraw();
						break;
				}
			}
		}

		/**
		 * Method used to toggle the default native behavior of DatePicker
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		public toggleNativeBehavior(isNative: boolean): void {
			// Invert the boolean value of IsNative because of provider option
			if (this.configs.DisableMobile !== !isNative) {
				this.configs.DisableMobile = !isNative;
				this.prepareToAndRedraw();
			}
		}

		/**
		 * Method used to update the InitialDate config value
		 *
		 * @param value The new InitialDate value that will be set
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		public updateInitialDate(value: string): void {
			if (this.datePickerPlatformInputElem.disabled === false) {
				// Enable Flag in order to prevent trigger OnDateSelected platform callback event
				this._isUpdatedInitialDateByClientAction = true;
				// Redefine the Initial date
				this.configs.InitialDate = value;
				// Redefine the value that is assigned to the input, since pattern will be redrawed it will be based on that value as well
				OSFramework.OSUI.Helper.Dom.SetInputValue(
					this.datePickerPlatformInputElem,
					this.provider.formatDate(value, this.flatpickrOpts.dateFormat)
				);
				// Redraw calendar!
				this.prepareToAndRedraw();
			}
		}
	}
}
