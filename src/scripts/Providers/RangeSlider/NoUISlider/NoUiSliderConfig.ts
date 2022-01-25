/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider {
	export class NoUiSliderConfig extends OSUIFramework.Patterns.RangeSlider.AbstractRangeSliderConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				direction: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,
				start: this.IsInterval ? [this.StartingValueStart, this.StartingValueEnd] : [this.StartingValueStart],
				step: this.Step,
				connect: this.IsInterval ? true : Enum.NoUiSliderConnectOptions.Lower,
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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
