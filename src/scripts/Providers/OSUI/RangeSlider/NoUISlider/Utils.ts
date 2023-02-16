// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.RangeSlider.NoUISlider.Utils {
	export function SetRangeValues(providerConfigs: ProviderConfigs): ProviderConfigs {
		const rangeSliderConfigs = JSON.parse(providerConfigs);

		// Check if the range key is empty. If true, remove from the array
		if (rangeSliderConfigs.range.length <= 0) {
			delete rangeSliderConfigs.range;
		} else {
			const rangeValues = {};

			for (let i = 0; i < rangeSliderConfigs.range.length; i++) {
				rangeValues[rangeSliderConfigs.range[i].key] =
					rangeSliderConfigs.range[i].value === undefined ? 0 : rangeSliderConfigs.range[i].value;
			}

			rangeSliderConfigs.range = rangeValues;
		}

		return rangeSliderConfigs;
	}
}
