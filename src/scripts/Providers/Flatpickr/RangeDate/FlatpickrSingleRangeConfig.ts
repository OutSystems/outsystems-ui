/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.RangeDate {
	export class FlatpickrRangeDateConfig extends AbstractFlatpickrConfig {
		public EndDate: string;
		public StartDate: string;
		public Type: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}

		// method used to set the default value since we're dealing with on input to be assigned and 2 received dates!
		private _setDefaultDate(): string[] | undefined {
			// Check if any of the given dates are a null date
			if (OSUIFramework.Helper.Dates.IsNull(this.StartDate) || OSUIFramework.Helper.Dates.IsNull(this.EndDate)) {
				return undefined;
			}

			// Check if the Start Date is lower that End Date
			if (!OSUIFramework.Helper.Dates.Compare(this.StartDate, this.EndDate)) {
				throw new Error(`Start Date '${this.StartDate}' can't be after End Date '${this.EndDate}'`);
			}

			this.DefaultDate[0] = this.StartDate;
			this.DefaultDate[1] = this.EndDate;

			return this.DefaultDate;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			this._setDefaultDate();
			// eslint-disable-next-line prefer-const
			let flatpickrRangeDateOpts = {
				defaultDate: this._setDefaultDate(),
				mode: Flatpickr.Enum.Type.Range,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			const fpOptions = {
				...super._getFlatpickrOpts(),
				...flatpickrRangeDateOpts,
			};

			//Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}
	}
}
