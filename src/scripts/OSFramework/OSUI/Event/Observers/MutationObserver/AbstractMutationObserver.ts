// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.Observer {
	export abstract class AbstractMutationObserver
		extends AbstractObserver<MutationObserverInit>
		implements IObserver<MutationObserverInit, string>
	{
		constructor(observerOptions: MutationObserverInit, observerTarget: HTMLElement) {
			super(observerOptions, observerTarget);
			this.createObserver();
			this.startObserver();
		}

		protected createObserver(): void {
			this.observer = new MutationObserver(this.observerHandler.bind(this));
		}

		protected abstract observerHandler(mutationList: MutationRecord[]): void;
	}
}
