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
		private _eventTarget: HTMLElement | Document | Window;
		// Store the listener type
		private _eventType: GlobalEnum.HTMLEvent | GlobalEnum.CustomEvent;

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
		 * @param {(HTMLElement | Document | Window)} eventTarget
		 * @param {(GlobalEnum.HTMLEvent | GlobalEnum.CustomEvent)} eventType
		 * @param {boolean} [isCustomEvent=false]
		 * @memberof AbstractListener
		 */
		constructor(
			eventTarget: HTMLElement | Document | Window,
			eventType: GlobalEnum.HTMLEvent | GlobalEnum.CustomEvent,
			isCustomEvent = false
		) {
			super();
			this._eventTarget = eventTarget;
			this._eventType = eventType;
			// If the event is not custom, it will always have the 'on' prefix used by the window events
			this._eventName = isCustomEvent === false ? GlobalEnum.HTMLEvent.Prefix + this._eventType : this._eventType;

			// Add custom event reference to the window
			if (isCustomEvent) {
				window[this._eventName] = this._eventName;
			}

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
			if (this._eventName in window || window[this._eventName] !== undefined) {
				this._eventTarget.addEventListener(this._eventType, this.eventCallback);
			}
		}

		/**
		 * Method to remove a eventListener
		 *
		 * @memberof AbstractListener
		 */
		public removeEvent(): void {
			// Check if event exist in the window
			if (this._eventName in window || window[this._eventName] !== undefined) {
				this._eventTarget.removeEventListener(this._eventType, this.eventCallback);
			}
		}

		/**
		 * Getter that allows to obtain the eventTarget reference
		 *
		 * @readonly
		 * @type {HTMLElement | Document | Window}
		 * @memberof AbstractListener
		 */
		public get eventTarget(): HTMLElement | Document | Window {
			return this._eventTarget;
		}

		/**
		 * Setter that allows to update the eventTarget reference
		 *
		 * @type {HTMLElement | Document | Window}
		 * @memberof AbstractListener
		 */
		public set eventTarget(el: HTMLElement | Document | Window) {
			this._eventTarget = el;
		}
	}
}
