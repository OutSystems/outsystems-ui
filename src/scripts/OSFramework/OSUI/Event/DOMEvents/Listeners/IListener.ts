// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * This interface is the base to all listeners. All listeners need to implement it.
	 *
	 * @export
	 * @interface IListener
	 * @extends {IEvent<unknown>}
	 */
	export interface IListener extends IEvent<unknown> {
		// These next two methods are only used for body click, but added here as optional, for TS to be able to detect these methods on Patterns scope
		disableBodyClickEvent?(): void;
		enableBodyClickEvent?(): void;
	}
}
