/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.Factory {
	export function NewRangeSlider(
		rangeSliderId: string,
		type: string,
		configs: string
	): Providers.RangeSlider.IRangeSliderProvider {
		let _rangeSliderItem = null;

		switch (type) {
			case OSUIFramework.Patterns.RangeSlider.Enum.RangeSliderTypes.Slider:
				_rangeSliderItem = new Providers.RangeSlider.RangeSlider(rangeSliderId, JSON.parse(configs));

				break;

			default:
				throw new Error(`There is no RangeSlider of ${type} type`);
				break;
		}

		return _rangeSliderItem;
	}
}
