// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
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
		public abstract getProviderConfig(): void;
	}
}
