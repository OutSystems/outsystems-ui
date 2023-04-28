// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers {
	/**
	 * This interface is the base to all observers. All observers need to implement it.
	 *
	 * @export
	 * @interface IObserver
	 * @extends {IEvent<D>}
	 * @template O
	 * @template D
	 */
	export interface IObserver<O, D> extends IEvent<D> {
		observerOptions: O;
		observerTarget: HTMLElement;
	}
}
