/**
 * Namespace for all public methods to access and use the OutSystemsUI components.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Function that will normalize the ProviderConfigs in order to properly return boolean attributes
	 *
	 * @param providerConfigs All the configs that will be assigned to the provider in order to create it's instance
	 * @returns ProviderConfigs with all boolean as a boolean instead of string
	 */
	export function NormalizeProviderConfigs(providerConfigs: ProviderConfigs): ProviderConfigs {
		// Go through all given provider configs and check for string ones to check if it should be converted into a boolean one!
		for (const keyName of Object.keys(providerConfigs)) {
			let keyValue = providerConfigs[keyName];

			if (typeof keyValue !== 'string') {
				break;
			}

			keyValue = keyValue.toLowerCase().trim();
			if (keyValue === 'true' || keyValue === 'false') {
				providerConfigs[keyName] = keyValue === 'true';
			}
		}

		return providerConfigs;
	}
}
