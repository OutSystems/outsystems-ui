/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Datepicker.Flatpickr.SingleDate {
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

			this.calendarMode = OSUIFramework.Patterns.DatePicker.Enum.Mode.Single;
		}

		// Method used to set all the config properties for the SingleDate mode type
		public getProviderConfig(): FlatpickrOptions {
			const flatpickrSingleDateOpts = {
				defaultDate: OSUIFramework.Helper.Dates.IsNull(this.InitialDate) ? undefined : this.InitialDate,
				mode: OSUIFramework.Patterns.DatePicker.Enum.Mode.Single,
				onChange: this.OnChange,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let fpOptions = {
				...super.getCommonProviderConfigs(),
				...flatpickrSingleDateOpts,
			};

			// Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.InitialDate:
					validatedValue = false;
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
