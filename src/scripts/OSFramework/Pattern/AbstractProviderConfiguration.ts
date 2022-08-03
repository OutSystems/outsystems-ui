// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns {
	/**
	 * Represents the configurations for a provider.
	 * Will have a method to get the configurations in the provider format.
	 *
	 * @export
	 * @abstract
	 * @class AbstractProviderConfiguration
	 * @extends {AbstractConfiguration}
	 */
	export abstract class AbstractProviderConfiguration extends AbstractConfiguration {
		/**
		 * Method to merge internal and external confogs added by extensibility
		 *
		 * @protected
		 * @param {ProviderConfigs} providerOptions
		 * @param {ProviderConfigs} providerExtendedOptions
		 * @return {*}  {ProviderConfigs}
		 * @memberof AbstractProviderConfiguration
		 */
		protected mergeConfigs(
			providerOptions: ProviderConfigs,
			providerExtendedOptions: ProviderConfigs
		): ProviderConfigs {
			// Merged passed configs with internal configs
			const _finalConfigs =
				providerExtendedOptions !== undefined
					? { ...providerOptions, ...providerExtendedOptions }
					: providerOptions;

			// Cleanning undefined properties
			Object.keys(_finalConfigs).forEach(
				(key) =>
					(_finalConfigs[key] === undefined ||
						_finalConfigs[key] === null ||
						(Array.isArray(_finalConfigs[key]) && _finalConfigs[key].length === 0)) &&
					delete _finalConfigs[key]
			);

			return _finalConfigs;
		}

		/**
		 * Method to set the provider configs using extensibility
		 *
		 * @protected
		 * @param {ProviderConfigs} newConfigs
		 * @param {ProviderInfo} providerInfo
		 * @return {*}  {ProviderConfigs}
		 * @memberof AbstractProviderConfiguration
		 */
		protected validateExtensibilityConfigs(
			newConfigs: ProviderConfigs,
			providerInfo: ProviderInfo
		): ProviderConfigs {
			for (const element in newConfigs) {
				// Check if option passed is supported by the provider
				if (providerInfo.supportedConfigs.hasOwnProperty(element) === false) {
					console.warn(
						`The config ${element} is not valid or supported by the ${providerInfo.name} provider, with the version ${providerInfo.version}`
					);

					delete newConfigs[element];
				} else if (
					providerInfo.supportedConfigs[element] !== null &&
					providerInfo.supportedConfigs[element] !== undefined
				) {
					// Check for security vulnerabilites
					if (typeof newConfigs[element] === 'string') {
						// Avoid XSS attack
						Helper.Sanitize(newConfigs[element]);

						// Avoid passing a string on a callback type config
						if (
							typeof providerInfo.supportedConfigs[element] === 'object' ||
							typeof providerInfo.supportedConfigs[element] === 'function'
						) {
							console.warn(
								`The config ${element} is not from the type expected by ${
									providerInfo.name
								} . The passed config is of type ${typeof newConfigs[
									element
								]}, but it should be ${typeof providerInfo.supportedConfigs[element]}!`
							);

							delete newConfigs[element];
						}
					}
				}
			}

			return newConfigs;
		}

		public abstract getProviderConfig(): ProviderConfigs;
	}
}
