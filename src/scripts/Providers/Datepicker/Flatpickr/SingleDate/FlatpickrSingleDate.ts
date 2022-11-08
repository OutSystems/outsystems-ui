/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Datepicker.Flatpickr.SingleDate {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		// Flag to be used to prevent trigger the OnSelectedDate platform callback when InitialDate is being updated through Client Action!
		private _isUpdatedInitialDateByClientAction = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));
		}

		/**
		 * Method that will be triggered by library each time any date is selected and will also trigger the input update value and also trigger the OnSelectedDate platform event callback!
		 *
		 * @protected
		 * @param {string[]} selectedDates Array of selected dates
		 * @memberof Providers.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		protected onDateSelectedEvent(selectedDates: string[]): void {
			// Store selected date with the expected dateFormat as a string type
			let _selectedDate = '';

			// Check if any date has been selected, In case of Clear this will retunr empty array
			if (selectedDates.length > 0) {
				_selectedDate = this.provider.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
			}

			// Trigger the platform update attribute value change!
			OSFramework.Helper.Dom.SetInputValue(this._datePickerPlatformInputElem, _selectedDate);

			// Check if values are not beeing updated by UpdateInitialDate API Method!
			if (this._isUpdatedInitialDateByClientAction === false) {
				// Trigger platform's onChange callback event
				OSFramework.Helper.AsyncInvocation(this._onSelectedCallbackEvent, this.widgetId, _selectedDate);
			}

			// Reset Flag value;
			this._isUpdatedInitialDateByClientAction = false;
		}

		/**
		 * Trigger the jumToDate to now and trigger the Now as a selected Date!
		 *
		 * @protected
		 * @memberof Providers.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
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
		 * @memberof Providers.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		protected updatePlatformInputAttrs(): void {
			// Set the type attribute value accordingly
			const dateType =
				this.configs.TimeFormat === OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Disable
					? OSFramework.GlobalEnum.InputTypeAttr.Date
					: OSFramework.GlobalEnum.InputTypeAttr.DateTime;

			// Set the type attribute value
			// This is needed once library set it as an hidden by default which can not be since otherwise the updating it's value will not be triggered the local variable update. That said it will be hidden through CSS!
			OSFramework.Helper.Dom.Attribute.Set(
				this._datePickerPlatformInputElem,
				OSFramework.GlobalEnum.HTMLAttributes.type,
				dateType
			);
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		public build(): void {
			super.build();
			this.prepareConfigs();
			this.finishBuild();
		}

		/**
		 * Method used to change given propertyName at OnParametersChange platform event
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof Providers.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
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
				if (
					(providerSelectedDate === undefined && OSFramework.Helper.Dates.IsNull(newDateValue) === false) ||
					providerSelectedDate.getTime() !== newDateValue.getTime()
				) {
					redrawAtInitialDateChange = true;
				}
			}

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.Patterns.DatePicker.Enum.Properties.DateFormat:
						// Check if any Date was selected
						if (this.provider.selectedDates.length > 0) {
							// Set the new DefaultDate values
							this.configs.InitialDate = this.provider.formatDate(
								this.provider.selectedDates[0],
								this._flatpickrOpts.dateFormat
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
					case OSFramework.Patterns.DatePicker.Enum.Properties.TimeFormat:
						this.prepareToAndRedraw();
						break;
				}
			}
		}

		/**
		 * Method used to update the InitialDate config value
		 *
		 * @param value The new InitialDate value that will be set
		 * @memberof Providers.DatePicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate
		 */
		public updateInitialDate(value: string): void {
			// Enable Flag in order to prevent trigger OnDateSelected platform callback event
			this._isUpdatedInitialDateByClientAction = true;
			// Redefine the Initial date
			this.configs.InitialDate = value;
			// Trigger the onDateSelectedEvent method that will be responsible for setting the input value and trigger the selected event that will after trigger the redraw!
			this.onDateSelectedEvent([this.configs.InitialDate]);
		}
	}
}
