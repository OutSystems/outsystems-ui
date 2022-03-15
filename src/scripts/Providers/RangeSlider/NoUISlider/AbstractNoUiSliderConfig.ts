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
		public getCommonProviderConfig(): NoUiSliderOptions {
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				direction: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,
				start: this.IsInterval ? [this.StartingValueFrom, this.StartingValueTo] : [this.StartingValueFrom],
				step: this.Step,
				connect: this.IsInterval ? true : NoUiSlider.Enum.NoUiSliderConnectOptions.Lower,
				orientation: this.Orientation,
				range: this.getRangeConfig(),
				tooltips: this.setTooltipVisibility(this.ShowFloatingLabel),
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

		public setTooltipVisibility(showTooltip: boolean): number[] {
			const tooltipValue = showTooltip ? window.wNumb({ decimals: 0 }) : false;
			return this.IsInterval ? [tooltipValue, tooltipValue] : [tooltipValue];
		}
	}
}
