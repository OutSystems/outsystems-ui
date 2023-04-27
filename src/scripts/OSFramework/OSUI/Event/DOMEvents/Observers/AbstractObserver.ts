// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers {
	export abstract class AbstractObserver<O> extends AbstractEvent<string> implements IObserver<O, string> {
		private _observerOptions: O;
		private _observerTarget: HTMLElement;
		protected observer: ResizeObserver | MutationObserver;

		public get observerOptions(): O {
			return this._observerOptions;
		}

		public get observerTarget(): HTMLElement {
			return this._observerTarget;
		}

		constructor(observerOptions: O, observerTarget: HTMLElement) {
			super();
			this._observerOptions = observerOptions;
			this._observerTarget = observerTarget;
		}

		protected startObserver(): void {
			this.observer.observe(this.observerTarget, this.observerOptions);
		}

		public removeEvent(): void {
			this.observer.disconnect();
		}
	}
}
