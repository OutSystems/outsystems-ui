// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.RangeSlider.NoUISlider.Utils {
	export function SetRangeValues(providerConfigs: ProviderConfigs): NoUiSliderOptions {
		const _noUiSliderConfigs = JSON.parse(providerConfigs);

		// Check if the range key is empty. If true, remove from the array
		if (_noUiSliderConfigs.range.length <= 0) {
			delete _noUiSliderConfigs.range;
		} else {
			const _rangeValues = {};

			for (let i = 0; i < _noUiSliderConfigs.range.length; i++) {
				_rangeValues[_noUiSliderConfigs.range[i].key] =
					_noUiSliderConfigs.range[i].value === undefined ? 0 : _noUiSliderConfigs.range[i].value;
			}

			_noUiSliderConfigs.range = _rangeValues;
		}

		return _noUiSliderConfigs;
	}
}
