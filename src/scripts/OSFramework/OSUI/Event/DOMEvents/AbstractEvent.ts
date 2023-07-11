// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents {
	/**
	 * Abstract class that will be responsible for the basic behaviours of an event, namely storing the handlers and their manipulation.
	 *
	 * @export
	 * @abstract
	 * @class AbstractEvent
	 * @implements {IEvent<T>}
	 * @template T
	 */
	export abstract class AbstractEvent<T> implements IEvent<T> {
		// Array with all handlers for each event
		private _handlers: GlobalCallbacks.OSGeneric[] = [];

		/**
		 * Getter for handlers
		 *
		 * @readonly
		 * @public
		 * @type {GlobalCallbacks.OSGeneric[]}
		 * @memberof AbstractEvent
		 */
		public get handlers(): GlobalCallbacks.OSGeneric[] {
			return this._handlers;
		}

		/**
		 * Method to add a new handler
		 *
		 * @param {GlobalCallbacks.OSGeneric} handler
		 * @memberof AbstractEvent
		 */
		public addHandler(handler: GlobalCallbacks.OSGeneric): void {
			this._handlers.push(handler);
		}

		/**
		 * Method to check if the Array has handlers
		 *
		 * @return {*}  {boolean}
		 * @memberof AbstractEvent
		 */
		public hasHandlers(): boolean {
			return this._handlers.length > 0;
		}

		/**
		 * Method to remove a given handler
		 *
		 * @param {GlobalCallbacks.OSGeneric} handler
		 * @memberof AbstractEvent
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
		 * @param {T} [data]
		 * @param {...unknown[]} args
		 * @memberof AbstractEvent
		 */
		public trigger(data?: T, ...args: unknown[]): void {
			this._handlers.slice(0).forEach((h) => Helper.AsyncInvocation(h, data, ...args));
		}

		/**
		 * Mandatory method implemenation to add events. this will be different, if it's a listener or an observer
		 *
		 * @abstract
		 * @memberof AbstractEvent
		 */
		public abstract addEvent(): void;

		/**
		 * Mandatory method implemenation to remove events. this will be different, if it's a listener or an observer
		 *
		 * @abstract
		 * @memberof AbstractEvent
		 */
		public abstract removeEvent(): void;
	}
}
