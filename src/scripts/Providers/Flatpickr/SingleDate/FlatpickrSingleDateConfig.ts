/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.SingleDate {
	/**
	 * Class that represents the custom configurations received by the Datepicker Single mode.
	 *
	 * @export
	 * @class FlatpickrSingleDateConfig
	 * @extends {AbstractFlatpickrConfig}
	 */
	export class FlatpickrSingleDateConfig extends AbstractFlatpickrConfig {
		// Set the property initialDate
		public InitialDate: string;

		constructor(config: JSON) {
			super(config);

			// Since on this case user could select one date only
			this.DefaultDate[0] = this.InitialDate;
		}

		// Method used to set all the config properties for the SingleDate mode type
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			const flatpickrSingleDateOpts = {
				defaultDate: OSUIFramework.Helper.Dates.IsNull(this.InitialDate) ? undefined : this.DefaultDate,
				mode: Flatpickr.Enum.Mode.Single,
				onChange: this.OnChange,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let fpOptions = {
				...super._getFlatpickrOpts(),
				...flatpickrSingleDateOpts,
			};

			// Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}
	}
}
