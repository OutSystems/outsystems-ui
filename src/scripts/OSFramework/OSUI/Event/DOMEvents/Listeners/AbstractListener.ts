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
	export abstract class AbstractListener<T> extends AbstractEvent<T> implements IListener {
		// Store the listener name, to check later if event is supported on the window
		private _eventName: string;
		// Store the listener target
		private _eventTarget: HTMLElement;
		// Store the listener type
		private _eventType: GlobalEnum.HTMLEvent;

		/**
		 * Store the listener callback
		 *
		 * @protected
		 * @type {EventListenerObject}
		 * @memberof AbstractListener
		 */
		protected eventCallback: EventListenerObject;

		/**
		 * Flag to indicate if event will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
		 *
		 * @protected
		 * @memberof AbstractListener
		 */
		protected useCapture = false;

		/**
		 * Creates an instance of AbstractListener.
		 *
		 * @param {unknown} eventTarget, window can be in use, so, HTMLElement can't be the type of the input by default
		 * @param {GlobalEnum.HTMLEvent} eventType
		 * @memberof AbstractListener
		 */
		constructor(eventTarget: unknown, eventType: GlobalEnum.HTMLEvent) {
			super();
			this._eventTarget = eventTarget as HTMLElement;
			this._eventType = eventType;
			this._eventName = GlobalEnum.HTMLEvent.Prefix + this._eventType;

			// Make async call to wait for extended event Class to set tge eventCallback property first
			Helper.AsyncInvocation(this.addEvent.bind(this));
		}

		/**
		 * Method to add a new eventListener
		 *
		 * @memberof AbstractListener
		 */
		public addEvent(): void {
			// Check if event exist in the window
			if (this._eventName in window) {
				this._eventTarget.addEventListener(this._eventType, this.eventCallback, this.useCapture);
			}
		}

		/**
		 * Method to remove a eventListener
		 *
		 * @memberof AbstractListener
		 */
		public removeEvent(): void {
			// Check if event exist in the window
			if (this._eventName in window) {
				this._eventTarget.removeEventListener(this._eventType, this.eventCallback);
			}
		}
	}
}
