/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.RangeDate {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrRangeDate extends AbstractFlatpickr<FlatpickrRangeDateConfig> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlatpickrRangeDateConfig(configs));

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
			const _selectedDate = [];

			// Check if any date has been selected, In case of Clear this will retunr empty array
			if (selectedDates.length > 0) {
				_selectedDate[0] = fp.formatDate(selectedDates[0], this._flatpickrOpts.dateFormat);
				if (selectedDates[1]) {
					_selectedDate[1] = fp.formatDate(selectedDates[1], this._flatpickrOpts.dateFormat);
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

		// Method used to check if tehre is any seelcted date before changing the DateFormat
		private _onUpdateDateFormat(): void {
			// Check if any Date was selected
			if (this._flatpickr.selectedDates.length > 0) {
				// Set the new Start DefaultDate value
				this._configs.DefaultDate[0] = this._flatpickr.formatDate(
					this._flatpickr.selectedDates[0],
					this._flatpickrOpts.dateFormat
				);

				// Set the new End DefaultDate value
				if (this._flatpickr.selectedDates[1]) {
					this._configs.DefaultDate[1] = this._flatpickr.formatDate(
						this._flatpickr.selectedDates[1],
						this._flatpickrOpts.dateFormat
					);
				}
			}
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
				case Enum.Properties.StartDate:
					// Set the DefaultDate values
					this._configs.StartDate = propertyValue;
					this._configs.DefaultDate[0] = this._configs.StartDate;

					break;

				case Enum.Properties.EndDate:
					// Set the DefaultDate values
					this._configs.EndDate = propertyValue;
					this._configs.DefaultDate[1] = this._configs.EndDate;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.DateFormat:
					// Check if there is any selected date already
					this._onUpdateDateFormat();
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
