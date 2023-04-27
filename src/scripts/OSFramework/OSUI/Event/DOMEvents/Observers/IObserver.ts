// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers {
	export interface IObserver<O, D> extends IEvent<D> {
		observerOptions: O;
		observerTarget: HTMLElement;
	}
}
