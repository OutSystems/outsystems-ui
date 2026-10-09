// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for OutSystemsUI Providers
	 */
	export interface IProviderPattern<P> extends Interface.IPattern {
		/**
		 * Attribute that keeps the instance of the provider of the pattern.
		 */
		provider: P;

		/**
		 * Attribute that keeps the information about the provider version
		 */
		providerInfo: ProviderInfo;

		/**
		 * Method to enable extensibility to provider supported configs
		 *
		 * @param newConfigs
		 */
		setProviderConfigs(newConfigs: ProviderConfigs): void;

		/**
		 * Method to update the provider events API instance and save/pending events
		 *
		 * @param providerInfo
		 */
		updateProviderEvents(providerInfo: ProviderInfo): void;
	}
}
