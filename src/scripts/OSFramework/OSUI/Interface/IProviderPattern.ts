// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for OutSystemsUI Providers
	 *
	 * @export
	 * @interface IProviderPattern
	 * @extends {Interface.IPattern}
	 * @template P
	 */
	export interface IProviderPattern<P> extends Interface.IPattern {
		/**
		 * Attribute that keeps the instance of the provider of the pattern.
		 *
		 * @type {P}
		 * @memberof OSFramework.Interface.IProviderPattern
		 */
		provider: P;

		/**
		 * Attribute that keeps the information about the provider version
		 *
		 * @type {ProviderInfo}
		 * @memberof OSFramework.Interface.IProviderPattern
		 */
		providerInfo: ProviderInfo;

		/**
		 * Enables to register simple callbacks for the platform. Internal use.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Interface.IProviderPattern
		 */
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;

		/**
		 * Method to enable extensibility to provider supported configs
		 *
		 * @param {ProviderConfigs} newConfigs
		 * @memberof OSFramework.Interface.IProviderPattern
		 */
		setProviderConfigs(newConfigs: ProviderConfigs): void;

		/**
		 * Method to update the provider events API instance and save/pending events
		 *
		 * @param {ProviderInfo} providerInfo
		 * @memberof OSFramework.Interface.IProviderPattern
		 */
		updateProviderEvents(providerInfo: ProviderInfo): void;
	}
}
