/// <reference path="../AbstractFlatpickr.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr.SingleDate {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
		// Store the provider options
		private _flatpickrOpts: FlatpickrOptions;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlatpickrSingleDateConfig(configs));

			// Set the default library Event handlers
			this._configs.OnChange = this._onDateSelectedEvent.bind(this);
		}

		// Method that will create the provider
		private _createProviderDatePicker(): void {
			console.log(`_createProviderDatePicker() => '${this._configs.Type}' Type`);

			// Set inital library options
			this._flatpickrOpts = this._configs.getProviderConfig();
			// console.log('this._configs', this._configs);
			// console.log('this._flatpickrOpts', this._flatpickrOpts);

			// Init provider
			this._flatpickr = window.flatpickr(this._datePickerProviderInputElem, this._flatpickrOpts);

			// Add TodayBtn
			if (this._configs.ShowTodayButton) {
				this._addTodayBtn();
			}

			// Instance has been Created!
			super._onReady();
		}

		// Method that will be triggered by library each time calendar is closed
		private _onCloseEvent(): void {
			super._onClose();
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

			console.log('_onDateSelected', _selectedDate);
		}

		// Method that will be triggered by library each time calendar is opened
		private _onOpenEvent(): void {
			super._onOpen();
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
				case OSUIFramework.Patterns.DatePicker.Enum.Properties.InitialDate:
					// Set the DefaultDate values
					this._configs.InitialDate = propertyValue;
					this._configs.DefaultDate = this._configs.InitialDate;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.DateFormat:
					// Check if any Date was selected
					if (this._flatpickr.selectedDates.length > 0) {
						// Set the new DefaultDate values
						this._configs.InitialDate = this._flatpickr.formatDate(
							this._flatpickr.selectedDates[0],
							this._flatpickrOpts.dateFormat
						);
						this._configs.DefaultDate = this._configs.InitialDate;
					}

					// Set the new InputDateFormat
					this._configs.DateFormat = propertyValue;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.TimeFormat:
					// Set the new Timeformat value
					this._configs.TimeFormat = propertyValue;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.ShowTodayButton:
					// Set the new ShowTodayButton value
					this._configs.ShowTodayButton = propertyValue;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.FirstWeekDay:
					// Set the new FirstWeekDay value
					this._configs.OptionalConfigs.firstWeekDay = propertyValue;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.MinDate:
					// Set the new MinDate value
					this._configs.OptionalConfigs.minDate = propertyValue;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.MaxDate:
					// Set the new MaxDate value
					this._configs.OptionalConfigs.maxDate = propertyValue;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.ShowMonths:
					// Set the new ShowMonths value
					this._configs.OptionalConfigs.showMonths = propertyValue;

					break;

				case OSUIFramework.Patterns.DatePicker.Enum.Properties.ShowWeekNumbers:
					// Set the new ShowMonths value
					this._configs.OptionalConfigs.showWeekNumbers = propertyValue;

					break;

				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			super.dispose();
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
