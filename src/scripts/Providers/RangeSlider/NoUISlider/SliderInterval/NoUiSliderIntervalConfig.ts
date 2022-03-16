/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUISlider.SliderInterval {
	export class NoUiSliderIntervalConfig extends Providers.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
		constructor(config: JSON) {
			super(config);

			this.rangeSliderMode = OSUIFramework.Patterns.RangeSlider.Enum.Mode.Interval;
		}

		public getProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let rangeSliderOptions = {
				start: [this.StartingValueFrom, this.StartingValueTo],
				connect: true,
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
