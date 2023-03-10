/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.RangeSlider.NoUiSlider.Factory {
	export function NewNoUiSlider(
		rangeSliderId: string,
		configs: string,
		mode: OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode
	): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider {
		let _rangeSliderItem = null;
		let _patternName: string;

		switch (mode) {
			case OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode.Single:
				_patternName = OSFramework.OSUI.GlobalEnum.PatternName.RangeSlider;

				break;

			case OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode.Interval:
				_patternName = OSFramework.OSUI.GlobalEnum.PatternName.RangeSliderInterval;

				break;

			default:
				throw new Error(`There is no RangeSlider of ${mode} type`);
		}

		_rangeSliderItem = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			_patternName,
			rangeSliderId,
			JSON.parse(configs),
			OSFramework.OSUI.Patterns.RangeSlider.Enum.Provider.NoUiSlider
		) as OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider;

		return _rangeSliderItem;
	}
}
