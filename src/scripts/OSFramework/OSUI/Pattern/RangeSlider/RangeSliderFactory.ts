/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.RangeSlider.Factory {
	/**
	 * Create the new RangeSlider instance object according given provider
	 *
	 * @param rangeSliderId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @param mode Range slider mode (single or interval)
	 * @param provider Provider library that implements the range slider
	 */
	export function NewRangeSlider(
		rangeSliderId: string,
		configs: string | Record<string, unknown>,
		mode: Enum.Mode,
		provider: string
	): Patterns.RangeSlider.IRangeSlider {
		let _rangeSliderItem = null;

		switch (provider) {
			case Enum.Provider.NoUiSlider:
				_rangeSliderItem = Providers.OSUI.RangeSlider.NoUiSlider.Factory.NewNoUiSlider(
					rangeSliderId,
					configs,
					mode
				);

				break;

			default:
				throw new Error(`There is no ${GlobalEnum.PatternName.RangeSlider} of the ${provider} provider`);
		}

		return _rangeSliderItem;
	}
}
