// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
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
		 * @memberof IProviderPattern
		 */
		provider: P;

		/**
		 * Attribute that keeps the information about the provider version
		 *
		 * @type {ProviderInfo}
		 * @memberof IProviderPattern
		 */
		providerInfo: ProviderInfo;

		addProviderEvent(eventName: string, callback: GlobalCallbacks.Generic): void;

		/**
		 * Enables to register simple callbacks for the platform. Internal use.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof IProviderPattern
		 */
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;

		/**
		 * Method to enable extensibility to provider supported  configs
		 *
		 * @param {ProviderConfigs} newConfigs
		 * @memberof IProviderPattern
		 */
		setProviderConfigs(newConfigs: ProviderConfigs): void;
	}
}
