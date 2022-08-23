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

			this.CalendarMode = OSFramework.Patterns.DatePicker.Enum.Mode.Single;
		}

		// Method used to set all the config properties for the SingleDate mode type
		public getProviderConfig(): FlatpickrOptions {
			const flatpickrSingleDateOpts = {
				defaultDate: OSFramework.Helper.Dates.IsNull(this.InitialDate) ? undefined : this.InitialDate,
				mode: OSFramework.Patterns.DatePicker.Enum.Mode.Single,
				enableTime: this.TimeFormat !== OSFramework.Patterns.DatePicker.Enum.TimeFormatMode.Disable,
				onChange: this.OnChange,
			};

			return this.mergeConfigs(
				this.getCommonProviderConfigs(),
				flatpickrSingleDateOpts,
				this._providerExtendedOptions
			);
		}

		// Method that validates if a given property can be changed.
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			// Block updating InitialDate after pattern is built (OnParameters Change)!
			if (isBuilt) {
				return key !== Enum.Properties.InitialDate;
			}
			return true;
		}
	}
}
