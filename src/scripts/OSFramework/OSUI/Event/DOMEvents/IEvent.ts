// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents {
	/**
	 * This interface is the base to all events. All events need to implement it.
	 *
	 * @export
	 * @interface IEvent
	 * @template D this will the type of Data to be passed, by default to the handlers.
	 */
	export interface IEvent<D> {
		handlers: GlobalCallbacks.OSGeneric[];
		addEvent(): void;
		addHandler(handler: GlobalCallbacks.OSGeneric, ...args): void;
		hasHandlers(): boolean;
		removeEvent(): void;
		removeHandler(handler: GlobalCallbacks.OSGeneric): void;
		trigger(data: D, ...args: unknown[]): unknown;
	}
}
