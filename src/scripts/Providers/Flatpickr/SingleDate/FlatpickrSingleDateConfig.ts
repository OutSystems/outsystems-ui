/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.SingleDate {
	export class FlatpickrSingleDateConfig extends AbstractFlatpickrConfig {
		public InitialDate: string;
		public Type: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);

			this.DefaultDate[0] = this.InitialDate;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let flatpickrSingleDateOpts = {
				defaultDate: OSUIFramework.Helper.Dates.IsNull(this.InitialDate) ? undefined : this.DefaultDate,
				mode: Flatpickr.Enum.Mode.Single,
				onChange: this.OnChange,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			const fpOptions = {
				...super._getFlatpickrOpts(),
				...flatpickrSingleDateOpts,
			};

			//Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}
	}
}
