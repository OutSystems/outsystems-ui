/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Datepicker.Flatpickr.RangeDate {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrRangeDate extends AbstractFlatpickr<FlatpickrRangeDateConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrRangeDateConfig(configs));
		}

		// Method used to check if there is any selected date before changing the DateFormat
		private _onUpdateDateFormat(): void {
			// Check if any Date was selected
			if (this.provider.selectedDates.length > 0) {
				// Set the new Start DefaultDate value
				this.configs.InitialStartDate = this.provider.formatDate(
					this.provider.selectedDates[0],
					this.flatpickrOpts.dateFormat
				);

				// Set the new End DefaultDate value
				if (this.provider.selectedDates[1]) {
					this.configs.InitialEndDate = this.provider.formatDate(
						this.provider.selectedDates[1],
						this.flatpickrOpts.dateFormat
					);
				}
			}

			this.prepareToAndRedraw();
		}

		// Method used by the ChangeProperties method in order to update InitialStart and/or InitialEnd Dates
		private _updateInitialStartAndEndDates(): void {
			// Check if the given StartDate is minor of Given EndDate in order to prevent redraw on this case!
			if (
				this.configs.InitialStartDate !== undefined &&
				this.configs.InitialEndDate !== undefined &&
				OSFramework.OSUI.Helper.Dates.IsBeforeThan(
					this.configs.InitialStartDate,
					this.configs.InitialEndDate
				) === false
			) {
				// Give a error console message in order to alert developers about this unexpected given dates!
				console.error(
					`Given StartDate:'${this.provider.formatDate(
						this.configs.InitialStartDate,
						this.configs.ServerDateFormat
					)}' can not be greater than given EndDate:'${this.provider.formatDate(
						this.configs.InitialEndDate,
						this.configs.ServerDateFormat
					)}'.`
				);
			} else {
				// Trigger the redraw!
				this.prepareToAndRedraw();
			}
		}

		/**
		 * Method that will be triggered by library each time any date is selected and will also trigger the input update value and also trigger the OnSelectedDate platform event callback!
		 *
		 * @protected
		 * @param {string[]} selectedDates Array of selected dates
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate
		 */
		protected onDateSelectedEvent(selectedDates: Array<Date>): void {
			// Store selected dates with the expected dateFormat as a string type
			const _selectedDate = [];

			// Check if any date has been selected, In case of Clear this will retunr empty array
			if (selectedDates.length > 0) {
				_selectedDate[0] = this.provider.formatDate(selectedDates[0], this.flatpickrOpts.dateFormat);
				if (selectedDates[1]) {
					_selectedDate[1] = this.provider.formatDate(selectedDates[1], this.flatpickrOpts.dateFormat);
				}
			}

			// Ensure user has selected start and end dates before trigger the onSelectedDate callback, or user has clean the seelcted dates!
			if (selectedDates.length === 0 || selectedDates.length === 2) {
				// Trigger the platform update attribute value based on the flatpicker text input value!
				// This can be done on this context since on this case the "hidden" input should be text type!
				OSFramework.OSUI.Helper.Dom.SetInputValue(
					this.datePickerPlatformInputElem,
					this.flatpickrInputElem.value
				);
				// Trigger platform's onChange callback event
				this.triggerPlatformEventCallback(this.onSelectedCallbackEvent, _selectedDate[0], _selectedDate[1]);
			}
		}

		/**
		 * Trigger the jumpToDate to now
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate
		 */
		protected todayBtnClick(event: MouseEvent): void {
			event.preventDefault();
			this.jumpIntoToday();
		}

		/**
		 * Update platform input attributes in order to maintain consistency with data type!
		 *
		 * @protected
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate
		 */
		protected updatePlatformInputAttrs(): void {
			// Set the type attribute value
			// This is needed once library set it as an hidden by default which can not be since otherwise the updating it's value will not be triggered the local variable update. That said it will be hidden through CSS!
			OSFramework.OSUI.Helper.Dom.Attribute.Set(
				this.datePickerPlatformInputElem,
				OSFramework.OSUI.GlobalEnum.HTMLAttributes.Type,
				OSFramework.OSUI.GlobalEnum.InputTypeAttr.Text
			);
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate
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
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.OSUI.Patterns.DatePicker.Enum.Properties.DateFormat:
						// Check if there is any selected date already
						this._onUpdateDateFormat();
						break;
					case Enum.Properties.InitialEndDate:
					case Enum.Properties.InitialStartDate:
						this._updateInitialStartAndEndDates();
						break;
				}
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate
		 */
		public toggleNativeBehavior(): void {
			console.log(OSFramework.OSUI.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method used to update the StartInitialDate and EndInitialDate values
		 *
		 * @param startDate The new StartInitialDate value
		 * @param endDate The new EndInitialDate value
		 * @memberof Providers.OSUI.DatePicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate
		 */
		public updateInitialDate(startDate: string, endDate: string): void {
			// Ensure assigns only occurs if both dates are set!
			if (
				OSFramework.OSUI.Helper.Dates.IsNull(startDate) === false &&
				OSFramework.OSUI.Helper.Dates.IsNull(endDate) === false &&
				this.datePickerPlatformInputElem.disabled === false
			) {
				// Redefine the Initial dates
				this.configs.InitialStartDate = startDate;
				this.configs.InitialEndDate = endDate;

				if (OSFramework.OSUI.Helper.Dates.IsBeforeThan(startDate, endDate)) {
					this.prepareToAndRedraw();
				} else {
					console.error(
						`Given StartDate:'${this.provider.formatDate(
							this.configs.InitialStartDate,
							this.configs.ServerDateFormat
						)}' can not be greater than given EndDate:'${this.provider.formatDate(
							this.configs.InitialEndDate,
							this.configs.ServerDateFormat
						)}'.`
					);
				}
			}
		}
	}
}
