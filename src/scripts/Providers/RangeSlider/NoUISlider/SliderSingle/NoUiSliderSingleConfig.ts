/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUISlider.SliderSingle {
	export class NoUiSliderSingleConfig extends Providers.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
		constructor(config: JSON) {
			super(config);

			this.rangeSliderMode = OSFramework.Patterns.RangeSlider.Enum.Mode.Single;
		}

		/**
		 * Method to set provider configs for the Single Slider mode
		 *
		 * @return {*}  {NoUiSliderOptions}
		 * @memberof NoUiSliderSingleConfig
		 */
		public getProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let singleSliderOptions = {
				start: [this.StartingValueFrom],
				connect: NoUiSlider.Enum.NoUiSliderConnectOptions.Lower,
			};

			return this.mergeConfigs(
				this.getCommonProviderConfig(),
				singleSliderOptions,
				this._providerExtendedOptions
			);
		}
	}
}
