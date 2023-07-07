// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns {
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
		 * Method to merge Common, Specific and External configs
		 *
		 * @protected
		 * @param {ProviderConfigs} commonConfigs
		 * @param {ProviderConfigs} specificConfigs
		 * @param {ProviderConfigs} extendedConfigs
		 * @return {*}  {ProviderConfigs}
		 * @memberof OSFramework.OSUI.Patterns.AbstractProviderConfiguration
		 */
		protected mergeConfigs(
			commonConfigs: ProviderConfigs,
			specificConfigs: ProviderConfigs,
			extendedConfigs?: ProviderConfigs
		): ProviderConfigs {
			// Set the Common Configs
			let _finalConfigs = commonConfigs;

			// If the SpecificConfigs exist!
			if (specificConfigs !== undefined) {
				_finalConfigs = { ..._finalConfigs, ...specificConfigs };
			}

			//s If the extendedConfig exist!
			if (extendedConfigs !== undefined) {
				_finalConfigs = { ..._finalConfigs, ...extendedConfigs };
			}

			// Clean undefined properties
			Object.keys(_finalConfigs).forEach(
				(key) =>
					(_finalConfigs[key] === undefined ||
						_finalConfigs[key] === null ||
						(Array.isArray(_finalConfigs[key]) && _finalConfigs[key].length === 0)) &&
					delete _finalConfigs[key]
			);

			return _finalConfigs;
		}

		// Common method all providersConfigs must implement
		public abstract getProviderConfig(): ProviderConfigs;
	}
}
