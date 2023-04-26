// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.Observer {
	export abstract class AbstractObserverManager<OT, D> {
		private _observers: Map<OT, IObserver<unknown, D>>;

		constructor() {
			this._observers = new Map<OT, IObserver<OT, D>>();
		}

		/**
		 * This method is used to add assign a new callback to a given EventType
		 *
		 * @param eventType
		 * @param handler
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public addHandler(eventType: OT, handler: GlobalCallbacks.Generic): void {
			if (this._observers && this._observers.has(eventType)) {
				this._observers.get(eventType).addHandler(handler);
			} else {
				const ev = this.getInstanceOfEventType(eventType);
				if (ev !== undefined) {
					ev.addHandler(handler);
					this._observers.set(eventType, ev);
				}
			}
		}

		/**
		 * This method will check if a given EventType has assigned callbacks
		 *
		 * @param eventType
		 * @returns boolean
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public hasHandlers(eventType: OT): boolean {
			let returnValue = false;
			if (this._observers.has(eventType)) {
				const event = this._observers.get(eventType);
				returnValue = event.hasHandlers();
			}
			return returnValue;
		}

		/**
		 * Remove the given event type
		 *
		 * @param eventType
		 * @param handler
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public removeHandler(eventType: OT, handler: GlobalCallbacks.Generic): void {
			if (this._observers.has(eventType)) {
				const event = this._observers.get(eventType);
				event.removeHandler(handler);
			}
		}

		/**
		 * This method will trigger the callback assigned to the given eventType
		 *
		 * @param eventType
		 * @param data
		 * @param args
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public trigger(eventType: OT, data?: D, ...args: unknown[]): void {
			if (this._observers.has(eventType)) {
				this._observers.get(eventType).trigger(data, args);
			}
		}

		/**
		 * Getter that allows to obtain the list of events
		 *
		 * @readonly
		 * @type {Map<OT, IEvent<D>>}
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public get observers(): Map<OT, IObserver<unknown, D>> {
			return this._observers;
		}
		/**
		 * This method will be responsible for creating the correct instance of the Event
		 * based in the EventType that is passed.
		 *
		 * @protected
		 * @abstract
		 * @param {OT} eventType Type of the event that will we need an instance of.
		 * @returns {*}  {IEvent<D>} Instance of the event.
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		protected abstract getInstanceOfEventType(eventType: OT): IObserver<unknown, unknown>;
	}
}
