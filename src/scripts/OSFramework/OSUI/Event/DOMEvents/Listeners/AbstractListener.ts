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
		private _eventName: string;
		private _eventTarget: HTMLElement;
		private _eventType: GlobalEnum.HTMLEvent;
		protected eventCallback: EventListenerObject;

		constructor(eventTarget, eventType) {
			super();
			this._eventTarget = eventTarget;
			this._eventType = eventType;
			this._eventName = GlobalEnum.HTMLEvent.Prefix + this._eventType;

			// Make async call to wait for extended event Class to set tge eventCallback property first
			Helper.AsyncInvocation(this.addEvent.bind(this));
		}

		public addEvent(): void {
			if (this._eventName in window) {
				this._eventTarget.addEventListener(this._eventType, this.eventCallback);
			}
		}

		public removeEvent(): void {
			if (this._eventName in window) {
				this._eventTarget.removeEventListener(this._eventType, this.eventCallback);
			}
		}
	}
}
