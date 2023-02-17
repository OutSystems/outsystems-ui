// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.RangeSlider.NoUISlider.Utils {
	export function SetRangeValues(providerConfigs: RangeSliderProviderConfigs): RangeSliderProviderConfigs {
		const _noUiSliderConfigs = JSON.parse(providerConfigs);

		// Check if the range key is empty. If true, remove from the array
		if (_noUiSliderConfigs.range.length <= 0) {
			delete _noUiSliderConfigs.range;
		} else {
			const _rangeValues = {};

			// Check the range values and cahnge to a single object
			for (const element of _noUiSliderConfigs.range) {
				_rangeValues[element.key] = element.value === undefined ? 0 : element.value;
			}

			_noUiSliderConfigs.range = _rangeValues;
		}

		return _noUiSliderConfigs;
	}
}
