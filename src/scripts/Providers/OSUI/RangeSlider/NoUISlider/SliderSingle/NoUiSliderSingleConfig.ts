/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.RangeSlider.NoUISlider.SliderSingle {
	export class NoUiSliderSingleConfig extends Providers.OSUI.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
		constructor(config: JSON) {
			super(config);

			this.rangeSliderMode = OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode.Single;
		}

		/**
		 * Method to set provider configs for the Single Slider mode
		 *
		 * @return {*}  {NoUiSliderOptions}
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SliderSingle.NoUiSliderSingleConfig
		 */
		public getProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let singleSliderOptions = {
				handleAttributes: [{ 'aria-label': NoUiSlider.Enum.NoUISliderLabels.Handle }],
				start: [this.StartingValueFrom],
				connect: NoUiSlider.Enum.NoUiSliderConnectOptions.Lower,
			};

			return this.mergeConfigs(super.getProviderConfig(), singleSliderOptions, this.providerExtendedOptions);
		}
	}
}
