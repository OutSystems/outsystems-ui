// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect.Utils {
	/**
	 * Function that will normalize the ProviderConfigs in order to properly return boolean attributes
	 *
	 * @param virtualSelectConfigs All the configs that will be assigned to the provider in order to create it's instance
	 * @returns ProviderConfigs with all boolean as a boolean instead of string
	 */
	export function NormalizeVirtualSelectConfigs(virtualSelectConfigs: VirtualSelectOpts): VirtualSelectOpts {
		return OutSystems.OSUI.Utils.AbstractNormalizeProviderConfigs(virtualSelectConfigs);
	}
}
