/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.RangeSlider.Factory {
	/**
	 * Create the new RangeSlider instance object according given provider
	 *
	 * @export
	 * @param {string} rangeSliderId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IRangeSlider}
	 */
	export function NewRangeSlider(
		rangeSliderId: string,
		configs: string,
		mode: Enum.Mode,
		provider: string
	): OSUIFramework.Patterns.RangeSlider.IRangeSlider {
		let _rangeSliderItem = null;

		switch (provider) {
			case Enum.Provider.NoUiSlider:
				_rangeSliderItem = Providers.RangeSlider.NoUiSlider.Factory.NewNoUiSlider(rangeSliderId, configs, mode);

				break;

			default:
				throw new Error(
					`There is no ${OSUIFramework.GlobalEnum.PatternName.RangeSlider} of the ${provider} provider`
				);
		}

		return _rangeSliderItem;
	}
}