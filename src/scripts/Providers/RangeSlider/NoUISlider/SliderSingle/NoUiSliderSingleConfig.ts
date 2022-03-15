/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUISlider.SliderSingle {
	export class NoUiSliderSingleConfig extends Providers.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
		constructor(config: JSON) {
			super(config);
		}

		public getProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let rangeSliderOptions = {
				start: [this.StartingValueFrom],
				connect: NoUiSlider.Enum.NoUiSliderConnectOptions.Lower,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let noUiSliderOptions = {
				...super.getCommonProviderConfig(),
				...rangeSliderOptions,
			};

			//Cleanning undefined properties
			Object.keys(noUiSliderOptions).forEach(
				(key) => noUiSliderOptions[key] === undefined && delete noUiSliderOptions[key]
			);

			return noUiSliderOptions;
		}
	}
}
