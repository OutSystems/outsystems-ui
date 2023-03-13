/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.RangeSlider.NoUiSlider.Factory {
	export function NewNoUiSlider(
		rangeSliderId: string,
		configs: string,
		mode: OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode
	): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider {
		let _rangeSliderItem = null;

		switch (mode) {
			case OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode.Single:
				_rangeSliderItem = new Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle(
					rangeSliderId,
					JSON.parse(configs)
				);

				break;

			case OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode.Interval:
				_rangeSliderItem = new Providers.OSUI.RangeSlider.NoUISlider.IntervalSlider.OSUINoUiSliderInterval(
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
