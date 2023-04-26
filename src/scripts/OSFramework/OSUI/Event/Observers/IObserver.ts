// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.Observer {
	export interface IObserver<O, D> {
		observerOptions: O;
		observerTarget: HTMLElement;

		addHandler(handler: GlobalCallbacks.OSGeneric, ...args): void;
		hasHandlers(): boolean;
		removeHandler(handler: GlobalCallbacks.OSGeneric): void;
		trigger(observer: D, ...args: unknown[]): unknown;
	}
}
