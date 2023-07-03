// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Event/IEvent.ts
namespace OSFramework.Event {
========
namespace OSFramework.OSUI.Event.DOMEvents {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Event/DOMEvents/IEvent.ts
	/**
	 * This interface is the base to all events. All events need to implement it.
	 *
	 * @export
	 * @interface IEvent
	 * @template D this will the type of Data to be passed, by default to the handlers.
	 */
	export interface IEvent<D> {
<<<<<<<< HEAD:src/scripts/OSFramework/Event/IEvent.ts
		addHandler(handler: GlobalCallbacks.OSGeneric, ...args): void;
		hasHandlers(): boolean;
========
		addEvent(): void;
		addHandler(handler: GlobalCallbacks.OSGeneric, ...args): void;
		hasHandlers(): boolean;
		removeEvent(): void;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Event/DOMEvents/IEvent.ts
		removeHandler(handler: GlobalCallbacks.OSGeneric): void;
		trigger(data: D, ...args: unknown[]): unknown;
	}
}
