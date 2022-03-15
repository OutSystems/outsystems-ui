/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.RangeSlider.NoUiSlider.Factory {
	export function NewNoUiSlider(
		rangeSliderId: string,
		configs: string,
		mode: OSUIFramework.Patterns.RangeSlider.Enum.Mode
	): OSUIFramework.Patterns.RangeSlider.IRangeSlider {
		let _rangeSliderItem = null;

		switch (mode) {
			case OSUIFramework.Patterns.RangeSlider.Enum.Mode.Single:
				_rangeSliderItem = new Providers.Datepicker.Flatpickr.SingleDate.OSUIFlatpickrSingleDate(
					rangeSliderId,
					JSON.parse(configs)
				);

				break;

			case OSUIFramework.Patterns.RangeSlider.Enum.Mode.Interval:
				_rangeSliderItem = new Providers.Datepicker.Flatpickr.RangeDate.OSUIFlatpickrRangeDate(
					rangeSliderId,
					JSON.parse(configs)
				);

				break;

			default:
				throw new Error(`There is no Flatpickr of ${mode} type`);
		}

		return _rangeSliderItem;
	}
}
