/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.SingleDate {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));

			// Set the default library Event handlers
			this._configs.OnChange = this._onDateSelectedEvent.bind(this);
		}

		// Method that will create the provider
		private _createProviderDatePicker(): void {
			// Set inital library options
			this._flatpickrOpts = this._configs.getProviderConfig();

			// Instance has been Created!
			super._onReady();
		}

		// Method that will be triggered by library each time any date is selected
		private _onDateSelectedEvent(selectedDates: string[], dateStr: string, fp: Flatpickr): void {
			/* NOTE: dateStr param is not in use since the library has an issue arround it */
			let _selectedDate = '';

			// Check if any date has been selected, In case of Clear this will retunr empty array
			if (selectedDates.length > 0) {
				_selectedDate = fp.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
			}

			// Trigger platform's onChange callback event
			OSUIFramework.Helper.AsyncInvocation(this._onChangeCallbackEvent, this.widgetId, _selectedDate);
		}

		public build(): void {
			super.build();

			this._createProviderDatePicker();

			this.finishBuild();
		}

		// Method used to change given propertyName at OnParametersChange platform event
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			switch (propertyName) {
				case Enum.Properties.InitialDate:
					// Set the DefaultDate values
					this._configs.InitialDate = propertyValue;
					this._configs.DefaultDate[0] = this._configs.InitialDate;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.DateFormat:
					// Check if any Date was selected
					if (this._flatpickr.selectedDates.length > 0) {
						// Set the new DefaultDate values
						this._configs.InitialDate = this._flatpickr.formatDate(
							this._flatpickr.selectedDates[0],
							this._flatpickrOpts.dateFormat
						);
						this._configs.DefaultDate[0] = this._configs.InitialDate;
					}

					// Set the new InputDateFormat
					this._configs.DateFormat = propertyValue;

					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		/* Method that will be responsible to redraw the calendar when it's needed */
		public redraw(): void {
			// Destroy the old flatpickr instance
			if (this.isBuilt) {
				this._flatpickr.destroy();

				// Create a new flatpickr instance with the updated configs
				OSUIFramework.Helper.AsyncInvocation(this._createProviderDatePicker.bind(this), '');
			}
		}
	}
}
