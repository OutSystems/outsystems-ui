// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * This class is a Manager of events. It will be used by the Map/Marker/etc in order to support
	 * the listenning of the different events supported by the parent element.
	 * You can almost think of it, as the object that works underneath "document.addEventListener()" API - which will
	 * be equivalent to out "MapAPI.MapManager.Events.Subscribe()".
	 *
	 * @export
	 * @abstract
	 * @class AbstractEventsManager
	 * @template ET type events that this manager will be handling (e.g. MapEventType, MarkerEventTypes, ...)
	 * @template D  this will the type of Data to be passed, by default to the handlers.
	 */
	export abstract class AbstractEventsManager<ET, D> {
		private _events: Map<ET, IEvent<D>>;

		constructor() {
			this._events = new Map<ET, IEvent<D>>();
		}

		public get events(): Map<ET, IEvent<D>> {
			return this._events;
		}

		public addHandler(eventType: ET, handler: Callbacks.Generic): void {
			if (this._events && this._events.has(eventType)) {
				this._events.get(eventType).addHandler(handler);
			} else {
				const ev = this.getInstanceOfEventType(eventType);
				if (ev !== undefined) {
					ev.addHandler(handler);
					this._events.set(eventType, ev);
				}
			}
		}

		public hasHandlers(eventType: ET): boolean {
			let returnValue = false;
			if (this._events.has(eventType)) {
				const event = this._events.get(eventType);
				returnValue = event.hasHandlers();
			}
			return returnValue;
		}

		public removeHandler(eventType: ET, handler: Callbacks.OSGeneric): void {
			if (this._events.has(eventType)) {
				const event = this._events.get(eventType);
				event.removeHandler(handler);
			}
		}

		public trigger(eventType: ET, data?: D, ...args: unknown[]): void {
			if (this._events.has(eventType)) {
				this._events.get(eventType).trigger(data, args);
			}
		}

		/**
		 * This method will be responsible for creating the correct instance of the Event
		 * based in the EventType that is passed.
		 *
		 * @protected
		 * @abstract
		 * @param {ET} eventType Type of the event that will we need an instance of.
		 * @returns {*}  {IEvent<D>} Instance of the event.
		 * @memberof AbstractEventsManager
		 */
		protected abstract getInstanceOfEventType(eventType: ET): IEvent<D>;
	}
}
