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
		private _eventTarget: HTMLElement;
		private _eventType: GlobalEnum.HTMLEvent;
		protected eventCallback: EventListenerObject;

		constructor(eventTarget, eventType) {
			super();
			this._eventTarget = eventTarget;
			this._eventType = eventType;

			this.addEvent();
		}

		public addEvent(): void {
			if (this._eventType in window) {
				this._eventTarget.addEventListener(this._eventType, this.eventCallback);
			}
		}

		public removeEvent(): void {
			if (this._eventType in window) {
				this._eventTarget.removeEventListener(this._eventType, this.eventCallback);
			}
		}
	}
}
