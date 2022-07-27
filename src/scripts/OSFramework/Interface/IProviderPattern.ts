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
		 * Enables to register simple callbacks for the platform. Internal use.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof IProviderPattern
		 */
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
	}
}
