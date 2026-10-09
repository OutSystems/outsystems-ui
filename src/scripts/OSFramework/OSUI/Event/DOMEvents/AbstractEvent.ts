// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents {
	/**
	 * Abstract class that will be responsible for the basic behaviours of an event, namely storing the handlers and their manipulation.
	 *
	 * @abstract
	 */
	export abstract class AbstractEvent<T> implements IEvent<T> {
		// Array with all handlers for each event
		private _handlers: GlobalCallbacks.OSGeneric[] = [];

		/**
		 * Getter for handlers
		 *
		 * @readonly
		 * @public
		 */
		public get handlers(): GlobalCallbacks.OSGeneric[] {
			return this._handlers;
		}

		/**
		 * Method to add a new handler
		 *
		 * @param handler Function to run when the event is triggered
		 */
		public addHandler(handler: GlobalCallbacks.OSGeneric): void {
			this._handlers.push(handler);
		}

		/**
		 * Method to check if the Array has a given handler
		 *
		 * @param handler Function to run when the event is triggered
		 */
		public hasHandler(handler: GlobalCallbacks.OSGeneric): boolean {
			return this._handlers.includes(handler);
		}

		/**
		 * Method to check if the Array has handlers
		 */
		public hasHandlers(): boolean {
			return this._handlers.length > 0;
		}

		/**
		 * Method to remove a given handler
		 *
		 * @param handler Function to run when the event is triggered
		 */
		public removeHandler(handler: GlobalCallbacks.OSGeneric): void {
			const index = this._handlers.findIndex((hd) => {
				return hd === handler;
			});

			if (index !== -1) {
				this._handlers.splice(index, 1);
			}

			// If this was the last handler, then remove the event
			if (this.hasHandlers() === false) {
				this.removeEvent();
			}
		}

		/**
		 * Method to trigger ahh handlers on the Array
		 *
		 * @param [data] Data passed to the handlers
		 * @param args Extra arguments passed to the handlers
		 */
		public trigger(data?: T, ...args: unknown[]): void {
			this._handlers.slice(0).forEach((h) => Helper.AsyncInvocation(h, data, ...args));
		}

		/**
		 * Mandatory method implemenation to add events. this will be different, if it's a listener or an observer
		 *
		 * @abstract
		 */
		public abstract addEvent(): void;

		/**
		 * Mandatory method implemenation to remove events. this will be different, if it's a listener or an observer
		 *
		 * @abstract
		 */
		public abstract removeEvent(): void;
	}
}
