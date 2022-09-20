/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Datepicker.Flatpickr.RangeDate {
	/**
	 * Class that represents the custom configurations received by the Datepicker RangeDate mode.
	 *
	 * @export
	 * @class FlatpickrRangeDateConfig
	 * @extends {AbstractFlatpickrConfig}
	 */
	export class FlatpickrRangeDateConfig extends AbstractFlatpickrConfig {
		// Set the property EndDate
		public InitialEndDate: string;
		// Set the property StartDate
		public InitialStartDate: string;

		constructor(config: JSON) {
			super(config);

			this.CalendarMode = OSFramework.Patterns.DatePicker.Enum.Mode.Range;
		}

		// Method used to set the default value since we're dealing with on input to be assigned and 2 received dates!
		private _setDefaultDate(): string[] | undefined {
			// Check if any of the given dates are a null date
			if (
				OSFramework.Helper.Dates.IsNull(this.InitialStartDate) ||
				OSFramework.Helper.Dates.IsNull(this.InitialEndDate)
			) {
				return undefined;
			}

			// Check if the Start Date is after than End Date
			if (OSFramework.Helper.Dates.Compare(this.InitialStartDate, this.InitialEndDate) === false) {
				throw new Error(`StartDate '${this.InitialStartDate}' can't be after EndDate '${this.InitialEndDate}'`);
			}

			return [this.InitialStartDate, this.InitialEndDate];
		}

		// Method used to set all the config properties for the RangeDate mode type
		public getProviderConfig(): FlatpickrOptions {
			const flatpickrRangeDateOpts = {
				defaultDate: this._setDefaultDate(),
				mode: OSFramework.Patterns.DatePicker.Enum.Mode.Range,
			};

			return this.mergeConfigs(
				this.getCommonProviderConfigs(),
				flatpickrRangeDateOpts,
				this._providerExtendedOptions
			);
		}

		// Method that validates if a given property can be changed.
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			// Block updating InitialStartDate and InitialEndDate after pattern is built (OnParameters Change)
			if (isBuilt) {
				return key !== Enum.Properties.InitialStartDate && key !== Enum.Properties.InitialEndDate;
			}
			return true;
		}
	}
}
