// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.Observer {
	export abstract class AbstractObserver<O> extends Event.AbstractEvent<string> implements IObserver<O, string> {
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

		protected endObserver(): void {
			this.observer.disconnect();
		}

		protected startObserver(): void {
			this.observer.observe(this.observerTarget, this.observerOptions);
		}

		protected abstract createObserver(): void;
	}
}
