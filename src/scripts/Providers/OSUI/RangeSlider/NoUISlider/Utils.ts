// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.RangeSlider.NoUISlider.Utils {
	export function SetRangeValues(providerConfigs: ProviderConfigs): ProviderConfigs {
		const _rangeSliderConfigs = JSON.parse(providerConfigs);

		// Check if the range key is empty. If true, remove from the array
		if (_rangeSliderConfigs.range.length <= 0) {
			delete _rangeSliderConfigs.range;
		} else {
			const _rangeValues = {};

			for (let i = 0; i < _rangeSliderConfigs.range.length; i++) {
				_rangeValues[_rangeSliderConfigs.range[i].key] =
					_rangeSliderConfigs.range[i].value === undefined ? 0 : _rangeSliderConfigs.range[i].value;
			}

			_rangeSliderConfigs.range = _rangeValues;
		}

		return _rangeSliderConfigs;
	}
}
