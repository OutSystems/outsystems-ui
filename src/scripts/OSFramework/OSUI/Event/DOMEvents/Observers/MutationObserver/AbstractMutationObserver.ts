// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers {
	export abstract class AbstractMutationObserver
		extends AbstractObserver<MutationObserverInit>
		implements IObserver<MutationObserverInit, string>
	{
		constructor(observerOptions: MutationObserverInit, observerTarget: HTMLElement) {
			super(observerOptions, observerTarget);
			this.addEvent();
			this.startObserver();
		}

		protected addEvent(): void {
			this.observer = new MutationObserver(this.observerHandler.bind(this));
		}

		protected abstract observerHandler(mutationList: MutationRecord[]): void;
	}
}
