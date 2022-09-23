/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Datepicker.Flatpickr.RangeDate {
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
					this._flatpickrOpts.dateFormat
				);

				// Set the new End DefaultDate value
				if (this.provider.selectedDates[1]) {
					this.configs.InitialEndDate = this.provider.formatDate(
						this.provider.selectedDates[1],
						this._flatpickrOpts.dateFormat
					);
				}
			}

			this.redraw();
		}

		/**
		 * Method that will be triggered by library each time any date is selected
		 *
		 * @protected
		 * @memberof Flatpickr.RangeDate
		 */
		protected onDateSelectedEvent(selectedDates: string[]): void {
			/* NOTE: dateStr param is not in use since the library has an issue arround it */
			const _selectedDate = [];

			// Check if any date has been selected, In case of Clear this will retunr empty array
			if (selectedDates.length > 0) {
				_selectedDate[0] = this.provider.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
				if (selectedDates[1]) {
					_selectedDate[1] = this.provider.formatDate(selectedDates[1], this._flatpickrOpts.dateFormat);
				}
			}

			// Trigger platform's onChange callback event
			OSFramework.Helper.AsyncInvocation(
				this._onChangeCallbackEvent,
				this.widgetId,
				_selectedDate[0],
				_selectedDate[1]
			);
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Flatpickr.RangeDate
		 */
		protected prepareConfigs(): void {
			if (this._isUpdatingDefaultDate === false) {
				// Check if any Date was selected
				if (this.provider?.selectedDates.length > 0) {
					// Set the new Start DefaultDate value
					this.configs.InitialStartDate = this.provider.selectedDates[0];

					// Set the new End DefaultDate value
					if (this.provider.selectedDates[1]) {
						this.configs.InitialEndDate = this.provider.selectedDates[1];
					}
				}
			}

			this._isUpdatingDefaultDate = false;
			// Get the library configurations
			this._flatpickrOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
		}

		/**
		 * Trigger the jumToDate to now
		 *
		 * @protected
		 * @memberof Flatpickr.SingleDate
		 */
		protected todayBtnClick(event: MouseEvent): void {
			event.preventDefault();

			this.jumpIntoToday();
		}

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
		 * @memberof Flatpickr.RangeDate
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.Patterns.DatePicker.Enum.Properties.DateFormat:
						// Check if there is any selected date already
						this._onUpdateDateFormat();
						break;
				}
			}
		}

		/**
		 * Method used to update the StartInitialDate and EndInitialDate values
		 *
		 * @param startDate The new StartInitialDate value
		 * @param endDate The new EndInitialDate value
		 * @memberof Flatpickr.RangeDate
		 */
		public updateInitialDate(startDate: string, endDate: string): void {
			this._isUpdatingDefaultDate = true;
			// Redefine the Initial dates
			this.configs.InitialStartDate = startDate;
			this.configs.InitialEndDate = endDate;
			// Trigger the Redraw method in order to update calendar with these new values
			this.redraw();
		}
	}
}
