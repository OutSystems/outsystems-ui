/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUISlider.SliderSingle {
	export class NoUiSliderSingleConfig extends Providers.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
		constructor(config: JSON) {
			super(config);

			this.rangeSliderMode = OSUIFramework.Patterns.RangeSlider.Enum.Mode.Single;
		}

		public getProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let singleSliderOptions = {
				start: [this.StartingValueFrom],
				connect: NoUiSlider.Enum.NoUiSliderConnectOptions.Lower,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let noUiSliderOptions = {
				...super.getCommonProviderConfig(),
				...singleSliderOptions,
			};

			//Cleanning undefined properties
			Object.keys(noUiSliderOptions).forEach(
				(key) => noUiSliderOptions[key] === undefined && delete noUiSliderOptions[key]
			);

			return noUiSliderOptions;
		}
	}
}
