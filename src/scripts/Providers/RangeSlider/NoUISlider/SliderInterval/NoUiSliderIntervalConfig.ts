/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUISlider.SliderInterval {
	export class NoUiSliderIntervalConfig extends Providers.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
		constructor(config: JSON) {
			super(config);

			this.rangeSliderMode = OSFramework.Patterns.RangeSlider.Enum.Mode.Interval;
		}

		/**
		 * Method to set provider configs for the Interval Slider mode
		 *
		 * @return {*}  {NoUiSliderOptions}
		 * @memberof NoUiSliderIntervalConfig
		 */
		public getProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let rangeSliderOptions = {
				start: [this.StartingValueFrom, this.StartingValueTo],
				connect: true,
			};

			return this.mergeConfigs(this.getCommonProviderConfig(), rangeSliderOptions, this._providerExtendedOptions);
		}
	}
}
