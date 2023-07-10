// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents {
	/**
	 * This class is a Manager of events (listeners, observers, etc.)
	 *
	 * @export
	 * @abstract
	 * @class AbstractEventsManager
	 * @template ET EventType
	 * @template D Event object
	 */
	export abstract class AbstractEventsManager<ET, D> {
		// Store all events
		private _events: Map<ET, IEvent<D>>;

		constructor() {
			this._events = new Map<ET, IEvent<D>>();
		}

		/**
		 * This method is used to add assign a new callback to a given EventType
		 *
		 * @param eventType
		 * @param handler
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public addHandler(eventType: ET, handler: GlobalCallbacks.Generic): void {
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

		/**
		 * This method will check if a given EventType has assigned callbacks
		 *
		 * @param eventType
		 * @returns boolean
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public hasHandlers(eventType: ET): boolean {
			let returnValue = false;
			if (this._events.has(eventType)) {
				const event = this._events.get(eventType);
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
		public removeHandler(eventType: ET, handler: GlobalCallbacks.Generic): void {
			if (this._events.has(eventType)) {
				const event = this._events.get(eventType);
				event.removeHandler(handler);

				// If this was the last handler, then remove this eventType
				if (event.handlers.length === 0) {
					this._events.delete(eventType);
				}
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
		public trigger(eventType: ET, data?: D, ...args: unknown[]): void {
			if (this._events.has(eventType)) {
				this._events.get(eventType).trigger(data, args);
			}
		}

		/**
		 * Getter that allows to obtain the list of events
		 *
		 * @readonly
		 * @type {Map<ET, IEvent<D>>}
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		public get events(): Map<ET, IEvent<D>> {
			return this._events;
		}

		/**
		 * This method will be responsible for creating the correct instance of the Event
		 * based in the EventType that is passed.
		 *
		 * @protected
		 * @abstract
		 * @param {ET} eventType Type of the event that will we need an instance of.
		 * @returns {*}  {IEvent<D>} Instance of the event.
		 * @memberof OSFramework.Event.AbstractEventsManager
		 */
		protected abstract getInstanceOfEventType(eventType: ET): IEvent<D>;
	}
}
