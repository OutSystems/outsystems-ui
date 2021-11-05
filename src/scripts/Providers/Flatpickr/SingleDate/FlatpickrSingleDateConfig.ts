/// <reference path="../AbstractFlatpickrConfig.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Flatpickr.SingleDate {
	export class FlatpickrSingleDateConfig extends AbstractFlatpickrConfig {
		public Type: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);

			this.DefaultDate = this.InitalDate;

			console.log('config', config);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let flatpickrSingleDateOpts = {
				defaultDate: OutSystems.OSUI.Utils.IsNullDate(this.DefaultDate) ? undefined : this.DefaultDate,
				mode: OSUIFramework.Patterns.DatePicker.Enum.Type.Single,
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

			console.log('fpOptions', fpOptions);

			//Cleanning undefined properties
			Object.keys(fpOptions).forEach((key) => fpOptions[key] === undefined && delete fpOptions[key]);

			return fpOptions;
		}
	}
}
