/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.RangeDate {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrRangeDate extends AbstractFlatpickr<FlatpickrRangeDateConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new FlatpickrRangeDateConfig(configs));
		}

		// Method used to check if there is any selected date before changing the DateFormat
		private _onUpdateDateFormat(): void {
			// Check if any Date was selected
			if (this._flatpickr.selectedDates.length > 0) {
				// Set the new Start DefaultDate value
				this.configs.StartDate = this._flatpickr.formatDate(
					this._flatpickr.selectedDates[0],
					this._flatpickrOpts.dateFormat
				);

				// Set the new End DefaultDate value
				if (this._flatpickr.selectedDates[1]) {
					this.configs.EndDate = this._flatpickr.formatDate(
						this._flatpickr.selectedDates[1],
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
				_selectedDate[0] = this._flatpickr.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
				if (selectedDates[1]) {
					_selectedDate[1] = this._flatpickr.formatDate(selectedDates[1], this._flatpickrOpts.dateFormat);
				}
			}

			// Trigger platform's onChange callback event
			OSUIFramework.Helper.AsyncInvocation(
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
			// Get the library configurations
			this._flatpickrOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			super.createProviderInstance();
		}

		public build(): void {
			super.build();

			this.prepareConfigs();

			this.finishBuild();
		}

		// Method used to change given propertyName at OnParametersChange platform event
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.DatePicker.Enum.Properties.DateFormat:
						// Check if there is any selected date already
						this._onUpdateDateFormat();
						break;
				}
			}
		}
	}
}
