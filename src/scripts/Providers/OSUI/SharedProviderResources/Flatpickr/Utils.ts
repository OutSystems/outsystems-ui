// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.SharedProviderResources.Flatpickr {
	/**
	 * Function that will normalize the ProviderConfigs in order to properly return boolean attributes
	 *
	 * @param flatpickrConfigs All the configs that will be assigned to the provider in order to create it's instance
	 * @returns ProviderConfigs with all boolean as a boolean instead of string
	 */
	export function NormalizeFlatpickrConfigs(flatpickrConfigs: FlatpickrOptions): FlatpickrOptions {
		// HTMLElement provider configs
		const _htmlElementsProps = ['positionElement', 'appendTo'];

		return OutSystems.OSUI.Utils.AbstractNormalizeProviderConfigs(flatpickrConfigs, _htmlElementsProps);
	}
}
