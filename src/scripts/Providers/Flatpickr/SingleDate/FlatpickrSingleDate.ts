/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.SingleDate {
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
				_selectedDate = this._flatpickr.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
			}

			// Trigger platform's onChange callback event
			OSUIFramework.Helper.AsyncInvocation(this._onChangeCallbackEvent, this.widgetId, _selectedDate);
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
			super.createProviderInstance();
		}

		public build(): void {
			super.build();

			this.prepareConfigs();

			this.finishBuild();
		}

		// Method used to change given propertyName at OnParametersChange platform event
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// If InitialDate we'll be set a property that doesn't exist as a global pattern config property
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.InitialDate:
						// Check if redraw must run
						if (this.configs.InitialDate !== propertyValue) {
							super.redraw();
						}
						break;

					case OSUIFramework.Patterns.DatePicker.Enum.Properties.DateFormat:
						// Check if any Date was selected
						if (this._flatpickr.selectedDates.length > 0) {
							// Set the new DefaultDate values
							this.configs.InitialDate = this._flatpickr.formatDate(
								this._flatpickr.selectedDates[0],
								this._flatpickrOpts.dateFormat
							);
						}

						break;
				}

				// Trigger the redraw method in order to recreate the instance according new received properties values
				if (
					propertyName !== OSUIFramework.GlobalEnum.CommonPatternsProperties.ExtendedClass &&
					propertyName !== Enum.Properties.InitialDate
				) {
					super.redraw();
				}
			}
		}
	}
}
