// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents {
	/**
	 * This class is a Manager of events (listeners, observers, etc.)
	 *
	 * @abstract
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
		 * @param eventType Type of the event
		 * @param handler Function to run when the event is triggered
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
		 * Method to check if a given EventType has a given handler
		 *
		 * @param eventType Type of the event
		 * @param handler Function to run when the event is triggered
		 * @returns boolean
		 */
		public hasHandler(eventType: ET, handler: GlobalCallbacks.Generic): boolean {
			let returnValue = false;
			if (this._events.has(eventType)) {
				const event = this._events.get(eventType);
				returnValue = event.hasHandler(handler);
			}
			return returnValue;
		}

		/**
		 * This method will check if a given EventType has assigned callbacks
		 *
		 * @param eventType Type of the event
		 * @returns boolean
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
		 * @param eventType Type of the event
		 * @param handler Function to run when the event is triggered
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
		 * @param eventType Type of the event
		 * @param data Data passed to the handlers
		 * @param args Extra arguments passed to the handlers
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
		 * @param eventType Type of the event that will we need an instance of.
		 * @returns Instance of the event.
		 */
		protected abstract getInstanceOfEventType(eventType: ET): IEvent<D>;
	}
}
