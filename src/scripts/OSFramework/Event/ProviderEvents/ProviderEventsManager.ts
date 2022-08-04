// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.ProviderEvents {
	export class ProviderEventsManager implements IProviderEventManager {
		// Map with the events added to provider and saved
		private _eventsMap = new Map<string, IProviderEvent>();
		// Map with the pending events to be added when provider is available
		private _pendingEventsMap = new Map<string, IProviderEvent>();

		public get eventsMap(): Map<string, IProviderEvent> {
			return this._eventsMap;
		}

		public get pendingEventsMap(): Map<string, IProviderEvent> {
			return this._pendingEventsMap;
		}

		/**
		 * Method to add a pending event
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.Generic} callback
		 * @param {string} uniqueId
		 * @memberof ProviderEventsManager
		 */
		public addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic, uniqueId: string): void {
			const newEvent = new ProviderEvent(callback, eventName, uniqueId);
			this._pendingEventsMap.set(uniqueId, newEvent);
		}

		/**
		 * Method to check if there're saved events
		 *
		 * @return {*}  {boolean}
		 * @memberof ProviderEventsManager
		 */
		public hasEvents(): boolean {
			return this._eventsMap.size > 0;
		}

		/**
		 * Method to check if there're pending events
		 *
		 * @return {*}  {boolean}
		 * @memberof ProviderEventsManager
		 */
		public hasPendingEvents(): boolean {
			return this._pendingEventsMap.size > 0;
		}

		/**
		 * Method to remove a pending event
		 *
		 * @param {string} uniqueId
		 * @memberof ProviderEventsManager
		 */
		public removePendingEvent(uniqueId: string): void {
			const event = this._pendingEventsMap.has(uniqueId);

			if (event) {
				this._pendingEventsMap.delete(uniqueId);
			} else {
				throw new Error(ErrorCodes.ProviderEventsManager.FailEventRemoval);
			}
		}

		/**
		 * Method to remove a saved event
		 *
		 * @param {string} uniqueId
		 * @memberof ProviderEventsManager
		 */
		public removeSavedEvent(uniqueId: string): void {
			const event = this._eventsMap.has(uniqueId);

			if (event) {
				this._eventsMap.delete(uniqueId);
			} else {
				throw new Error(ErrorCodes.ProviderEventsManager.FailEventRemoval);
			}
		}

		/**
		 * Method to save an event
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.Generic} callback
		 * @param {string} uniqueId
		 * @memberof ProviderEventsManager
		 */
		public saveEvent(eventName: string, callback: GlobalCallbacks.Generic, uniqueId: string): void {
			let _newEvent;

			if (this._pendingEventsMap.has(uniqueId)) {
				_newEvent = this._pendingEventsMap.get(uniqueId);
				this._pendingEventsMap.delete(uniqueId);
			} else {
				_newEvent = new ProviderEvent(callback, eventName, uniqueId);
			}

			this._eventsMap.set(uniqueId, _newEvent);
		}
	}
}
