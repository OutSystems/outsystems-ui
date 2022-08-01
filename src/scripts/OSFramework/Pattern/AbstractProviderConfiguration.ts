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
		 * Method to set the provider configs using extensibility
		 *
		 * @protected
		 * @param {ProviderConfigs} defaultConfigs
		 * @param {ProviderConfigs} newConfigs
		 * @param {ProviderInfo} providerInfo
		 * @return {*}  {ProviderConfigs}
		 * @memberof AbstractProviderConfiguration
		 */
		protected setProviderConfig(
			defaultConfigs: ProviderConfigs,
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
					// Check for security vulnerabilites on the callbacks
					if (
						(typeof providerInfo.supportedConfigs[element] === 'object' &&
							typeof newConfigs[element] === 'string') ||
						(typeof providerInfo.supportedConfigs[element] === 'function' &&
							typeof newConfigs[element] === 'string')
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

			// Merged passed configs with internal configs
			const _finalConfigs = { ...defaultConfigs, ...newConfigs };

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

		public abstract getProviderConfig(): void;
	}
}
