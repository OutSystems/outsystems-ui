// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	/**
	 * Defines the interface for OutSystemsUI Providers
	 */
	export interface IProviderPattern<P> extends Interface.IPattern {
		provider: P;

		registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void;
	}
}
