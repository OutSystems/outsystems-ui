// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	/**
	 * This interface is the base to all events. All events (both internal or external)
	 * need to implement it.
	 *
	 * @export
	 * @interface IEvent
	 * @template D this will the type of Data to be passed, by default to the handlers.
	 */
	export interface IEvent<D> {
		addHandler(handler: GlobalCallbacks.OSGeneric, ...args): void;
		hasHandlers(): boolean;
		removeHandler(handler: GlobalCallbacks.OSGeneric): void;
		trigger(data: D, ...args: unknown[]): unknown;
	}
}
