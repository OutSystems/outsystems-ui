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
	export function AbstractNormalizeProviderConfigs(
		providerConfigs: ProviderConfigs,
		htmlElementsProps?: Array<string>
	): ProviderConfigs {
		// Go through all given provider configs and check for string ones to check if it should be converted into a boolean one!
		for (const keyName of Object.keys(providerConfigs)) {
			let keyValue = providerConfigs[keyName];

			if (typeof keyValue !== 'string') {
				continue;
			}

			keyValue = keyValue.toLowerCase().trim();

			if (keyValue === 'true' || keyValue === 'false') {
				providerConfigs[keyName] = keyValue === 'true';
			}

			// Check if type is HTMLElement, if so then get the Element from the DOM, using the elementId passed
			if (htmlElementsProps?.indexOf(keyName) > -1) {
				providerConfigs[keyName] = OSFramework.OSUI.Helper.Dom.GetElementById(keyValue);
			}
		}

		return providerConfigs;
	}
}
