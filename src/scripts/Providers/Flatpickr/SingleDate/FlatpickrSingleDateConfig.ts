/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.SingleDate {
	export class FlatpickrSingleDateConfig extends AbstractFlatpickrConfig {
		public AdvancedConfigs: FlatPickerAdvancedConfig;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// Check if it's a valid ServerDateFormat
			if (!this._checkServerDateFormat(this.ServerDateFormat)) {
				throw new Error(`The given ServerDateFormat '${this.ServerDateFormat}' it's not allowed.`);
			}

			// eslint-disable-next-line prefer-const
			let flatpickrSingleDateOpts = {
				defaultDate: this.DefaultDate,
				onChange: this.OnChange,
				onClose: this.OnClose,
				onDayCreate: this.OnDayCreate,
				onOpen: this.OnOpen,
				onReady: this.OnReady,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			const fpOptions = {
				...this._flatpickrOpts,
				...flatpickrSingleDateOpts,
			};

			//Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}
	}
}
