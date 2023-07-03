// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/ICallback.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/ICallback.ts
	/**
	 * Defines the interface for objects that going to callback OutSystems
	 *
	 * @export
	 * @interface ICallback
	 */
	export interface ICallback {
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/ICallback.ts
		registerCallback(callback: GlobalCallbacks.OSGeneric): void;
========
		registerCallback(callback: GlobalCallbacks.OSGeneric, eventName?: string): void;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/ICallback.ts
	}
}
