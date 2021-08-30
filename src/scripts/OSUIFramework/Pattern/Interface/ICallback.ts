// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	/**
	 * Defines the interface for objects that going to callback OutSystems
	 */
	export interface ICallback {
		registerCallback(callback: Callbacks.OSGeneric): void;
	}
}
