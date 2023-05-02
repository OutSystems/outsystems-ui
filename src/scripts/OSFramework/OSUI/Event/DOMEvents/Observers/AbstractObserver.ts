// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Observers {
	/**
	 * Abstract Observer Class for all common code shared by all types of observers
	 *
	 * @export
	 * @abstract
	 * @class AbstractObserver
	 * @extends {AbstractEvent<string>}
	 * @implements {IObserver<O, string>}
	 * @template O
	 */
	export abstract class AbstractObserver<O> extends AbstractEvent<string> implements IObserver<O, string> {
		// Store Observer options
		private _observerOptions: O;
		// Store Observer target
		private _observerTarget: HTMLElement;
		// Store Observer object
		protected observer: ResizeObserver | MutationObserver;

		constructor(observerOptions: O, observerTarget: HTMLElement) {
			super();
			this._observerOptions = observerOptions;
			this._observerTarget = observerTarget;
		}

		// Method to start the observer, after it's created
		protected startObserver(): void {
			this.observer.observe(this.observerTarget, this.observerOptions);
		}

		/**
		 * Method to remove an Observer
		 *
		 * @memberof AbstractObserver
		 */
		public removeEvent(): void {
			this.observer.disconnect();
		}

		/**
		 * Getter for observerOptions
		 *
		 * @readonly
		 * @type {O}
		 * @memberof AbstractObserver
		 */
		public get observerOptions(): O {
			return this._observerOptions;
		}

		/**
		 * Getter for observerTarget
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof AbstractObserver
		 */
		public get observerTarget(): HTMLElement {
			return this._observerTarget;
		}
	}
}
