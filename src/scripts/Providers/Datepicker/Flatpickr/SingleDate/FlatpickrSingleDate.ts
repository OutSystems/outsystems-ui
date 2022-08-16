/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Datepicker.Flatpickr.SingleDate {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));
		}

		// Method that will be triggered by library each time any date is selected
		protected onDateSelectedEvent(selectedDates: string[]): void {
			/* NOTE: dateStr param is not in use since the library has an issue arround it */
			let _selectedDate = '';

			// Check if any date has been selected, In case of Clear this will retunr empty array
			if (selectedDates.length > 0) {
				_selectedDate = this.provider.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
			}

			// Trigger platform's onChange callback event
			OSFramework.Helper.AsyncInvocation(this._onChangeCallbackEvent, this.widgetId, _selectedDate);
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Flatpickr.SingleDate
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this._flatpickrOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
		}

		/**
		 * Trigger the jumToDate to now and trigger the Now as a selected Date!
		 *
		 * @protected
		 * @memberof Flatpickr.SingleDate
		 */
		protected todayBtnClick(event: MouseEvent): void {
			event.preventDefault();
			// Set the currentDate at the Datepicker
			this.provider.setDate(this.provider.now, true);
			// Trigger the jumpIntoDate!
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
		 * @memberof Flatpickr.SingleDate
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
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
						this.redraw();
						break;

					case OSFramework.Patterns.DatePicker.Enum.Properties.TimeFormat:
						this.redraw();
						break;
				}
			}
		}

		/**
		 * Method used to update the InitialDate config value
		 *
		 * @param value The new InitialDate value that will be set
		 * @memberof Flatpickr.SingleDate
		 */
		public updateInitialDate(value: string): void {
			// Redefine the Initial date
			this.configs.InitialDate = value;
			// Trigger the Redraw method in order to update calendar with this new value
			this.redraw();
		}
	}
}
