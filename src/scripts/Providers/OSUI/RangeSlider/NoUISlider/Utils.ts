// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.RangeSlider.NoUISlider.Utils {
	// Function to prepare the range values arrays to be passed to the provider
	function _setRangeValues(providerConfigs: RangeSliderProviderConfigs): RangeSliderProviderConfigs {
		const _noUiSliderConfigs = providerConfigs;

		// Check if the range key is empty. If true, remove from the array
		if (_noUiSliderConfigs.range !== undefined && _noUiSliderConfigs.range.length <= 0) {
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

	/**
	 * Function that will normalize the ProviderConfigs in order to properly return boolean attributes
	 *
	 * @param noUiSliderConfigs All the configs that will be assigned to the provider in order to create it's instance
	 * @returns ProviderConfigs with all boolean as a boolean instead of string
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function NormalizeNoUISliderConfigs(noUiSliderConfigs: FlatpickrOptions): FlatpickrOptions {
		const finalConfigs = _setRangeValues(noUiSliderConfigs);
		return OutSystems.OSUI.Utils.AbstractNormalizeProviderConfigs(finalConfigs);
	}
}
