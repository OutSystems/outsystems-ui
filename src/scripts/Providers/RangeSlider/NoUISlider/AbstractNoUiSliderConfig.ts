/// <reference path="./AbstractNoUiSlider.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUiSlider {
	/**
	 * Class that represents the custom configurations received by the RangeSlider.
	 *
	 * @export
	 * @abstract
	 * @class AbstractNoUiSliderConfig
	 * @extends {OSUIFramework.Patterns.RangeSlider
	 * 		.AbstractRangeSliderConfig}
	 */
	export abstract class AbstractNoUiSliderConfig extends OSUIFramework.Patterns.RangeSlider
		.AbstractRangeSliderConfig {
		// Store rangeslider mode is in use
		public rangeSliderMode: OSUIFramework.Patterns.RangeSlider.Enum.Mode;

		public getCommonProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				direction: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,
				step: this.Step,
				orientation: this.Orientation,
				range: this.getRangeConfig(),
			};

			//Cleanning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}

		public getRangeConfig(): unknown {
			return {
				min: this.MinValue,
				max: this.MaxValue === this.MinValue ? 100 : this.MaxValue,
			};
		}
	}
}
