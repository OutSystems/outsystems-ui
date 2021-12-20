/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.SingleDate {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		constructor(uniqueId: string, configs: JSON) {
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

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Flatpickr.SingleDate
		 */
		protected unsetCallbacks(): void {
			this._configs.OnChange = undefined;
		}

		public build(): void {
			super.build();

			this._createProviderDatePicker();

			this.finishBuild();
		}

		// Method used to change given propertyName at OnParametersChange platform event
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// If InitialDate we'll be set a property that doesn't exist as a global pattern config property
			if (propertyName !== Enum.Properties.InitialDate) {
				super.changeProperty(propertyName, propertyValue);
			}

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.InitialDate:
						// Set the DefaultDate values
						this.configs.InitialDate = propertyValue as string;
						this._configs.DefaultDate[0] = this.configs.InitialDate;

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

						break;
				}
			}
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			if (this.isBuilt) {
				this.unsetCallbacks();
			}

			super.dispose();
		}

		/* Method that will be responsible to redraw the calendar when it's needed */
		public redraw(): void {
			if (this.isBuilt) {
				// Destroy the old flatpickr instance only
				this._flatpickr.destroy();

				// Create a new flatpickr instance with the updated configs
				OSUIFramework.Helper.AsyncInvocation(this._createProviderDatePicker.bind(this), '');
			}
		}
	}
}
