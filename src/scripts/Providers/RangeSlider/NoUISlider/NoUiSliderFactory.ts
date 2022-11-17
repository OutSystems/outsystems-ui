/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUiSlider.Factory {
	export function NewNoUiSlider(
		rangeSliderId: string,
		configs: string,
		mode: OSFramework.Patterns.RangeSlider.Enum.Mode
	): OSFramework.Patterns.RangeSlider.IRangeSlider {
		let _rangeSliderItem = null;

		switch (mode) {
			case OSFramework.Patterns.RangeSlider.Enum.Mode.Single:
				_rangeSliderItem = new Providers.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle(
					rangeSliderId,
					JSON.parse(configs)
				);

				break;

			case OSFramework.Patterns.RangeSlider.Enum.Mode.Interval:
				_rangeSliderItem = new Providers.RangeSlider.NoUISlider.IntervalSlider.OSUINoUiSliderInterval(
					rangeSliderId,
					JSON.parse(configs)
				);

				break;

			default:
				throw new Error(`There is no RangeSlider of ${mode} type`);
		}

		return _rangeSliderItem;
	}
}
