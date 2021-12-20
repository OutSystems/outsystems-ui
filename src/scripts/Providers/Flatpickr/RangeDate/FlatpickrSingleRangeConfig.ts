/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.RangeDate {
	/**
	 * Class that represents the custom configurations received by the Datepicker RangeDate mode.
	 *
	 * @export
	 * @class FlatpickrRangeDateConfig
	 * @extends {AbstractFlatpickrConfig}
	 */
	export class FlatpickrRangeDateConfig extends AbstractFlatpickrConfig {
		// Set the property EndDate
		public EndDate: string;
		// Set the property StartDate
		public StartDate: string;

		constructor(config: JSON) {
			super(config);
		}

		// Method used to set the default value since we're dealing with on input to be assigned and 2 received dates!
		private _setDefaultDate(): string[] | undefined {
			// Check if any of the given dates are a null date
			if (OSUIFramework.Helper.Dates.IsNull(this.StartDate) || OSUIFramework.Helper.Dates.IsNull(this.EndDate)) {
				return undefined;
			}

			// Check if the Start Date is after than End Date
			if (OSUIFramework.Helper.Dates.Compare(this.StartDate, this.EndDate) === false) {
				throw new Error(`StartDate '${this.StartDate}' can't be after EndDate '${this.EndDate}'`);
			}

			this.DefaultDate[0] = this.StartDate;
			this.DefaultDate[1] = this.EndDate;

			return this.DefaultDate;
		}

		// Method used to set all the config properties for the RangeDate mode type
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			const flatpickrRangeDateOpts = {
				defaultDate: this._setDefaultDate(),
				mode: Flatpickr.Enum.Mode.Range,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let fpOptions = {
				...super._getFlatpickrOpts(),
				...flatpickrRangeDateOpts,
			};

			// Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}
	}
}
