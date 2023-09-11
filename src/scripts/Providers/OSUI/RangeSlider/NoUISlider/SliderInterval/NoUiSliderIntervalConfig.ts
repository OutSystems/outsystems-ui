/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.RangeSlider.NoUISlider.SliderInterval {
	export class NoUiSliderIntervalConfig extends Providers.OSUI.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
		constructor(config: JSON) {
			super(config);

			this.rangeSliderMode = OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode.Interval;
		}

		/**
		 * Method to set provider configs for the Interval Slider mode
		 *
		 * @return {*}  {NoUiSliderOptions}
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SliderInterval.NoUiSliderIntervalConfig
		 */
		public getProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let rangeSliderOptions = {
				handleAttributes: [
					{ 'aria-label': NoUiSlider.Enum.NoUISliderLabels.Handle },
					{ 'aria-label': NoUiSlider.Enum.NoUISliderLabels.Handle },
				],
				start: [this.StartingValueFrom, this.StartingValueTo],
				connect: true,
			};

			return this.mergeConfigs(super.getProviderConfig(), rangeSliderOptions, this.providerExtendedOptions);
		}
	}
}
