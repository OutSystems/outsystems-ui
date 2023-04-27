// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Abstract class that will be responsible for the basic behaviours of a listener, namely storing the callbacks.
	 *
	 * @export
	 * @abstract
	 * @class AbstractListener
	 * @implements {IListener<T>}
	 * @template T
	 */
	export abstract class AbstractListener<T> extends AbstractEvent<T> implements IListener {}
}
