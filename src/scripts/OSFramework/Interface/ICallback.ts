// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	/**
	 * Defines the interface for objects that going to callback OutSystems
	 *
	 * @export
	 * @interface ICallback
	 */
	export interface ICallback {
		registerCallback(callback: GlobalCallbacks.OSGeneric): void;
	}
}
