// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.ProviderEvents {
	export class ProviderEventsManager implements IProviderEventManager {
		// Map with the events added to provider and saved
		private _eventsMap = new Map<string, IProviderEvent>();
		// Map with the pending events to be added when provider is available
		private _pendingEventsMap = new Map<string, IProviderEvent>();

		/**
		 * Method to add a pending event
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.Generic} callback
		 * @param {string} uniqueId
		 * @memberof ProviderEventsManager
		 */
		public addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic, uniqueId: string): void {
			// Check if we've everything needed to store the event
			if (eventName === '' || callback === undefined || uniqueId === '') {
				throw new Error(
					`${ErrorCodes.ProviderEventsManager.FailSavingPendingEvent}: The event can not be saved.`
				);
			}

			const newEvent = new ProviderEvent(callback, eventName, uniqueId);
			this._pendingEventsMap.set(uniqueId, newEvent);
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
				throw new Error(
					`${ErrorCodes.ProviderEventsManager.FailPendingEventRemoval}: The event with eventId:'${uniqueId}' does not exist`
				);
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
				throw new Error(
					`${ErrorCodes.ProviderEventsManager.FailSavedEventRemoval}: The event with eventId:'${uniqueId}' does not exist`
				);
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
			// Check if we've everything needed to store the event
			if (eventName === '' || callback === undefined || uniqueId === '') {
				throw new Error(`${ErrorCodes.ProviderEventsManager.FailSavingEvent}: The event can not be saved.`);
			}

			let _newEvent: IProviderEvent;

			// If the event we are adding was already on the pending ones, get that one
			if (this._pendingEventsMap.has(uniqueId)) {
				_newEvent = this._pendingEventsMap.get(uniqueId);
				this._pendingEventsMap.delete(uniqueId);
			} else {
				// Otherwise create a new one
				_newEvent = new ProviderEvent(callback, eventName, uniqueId);
			}

			this._eventsMap.set(uniqueId, _newEvent);
		}

		/**
		 * Get all the existing events
		 *
		 * @type {Map<string, IProviderEvent>}
		 * @memberof ProviderEventsManager
		 */
		public get eventsMap(): Map<string, IProviderEvent> {
			return this._eventsMap;
		}

		/**
		 * Get all the existing pending events
		 *
		 * @readonly
		 * @type {Map<string, IProviderEvent>}
		 * @memberof ProviderEventsManager
		 */
		public get pendingEventsMap(): Map<string, IProviderEvent> {
			return this._pendingEventsMap;
		}

		/**
		 * Check if there're saved events
		 *
		 * @return {*}  {boolean}
		 * @memberof ProviderEventsManager
		 */
		public get hasEvents(): boolean {
			return this._eventsMap.size > 0;
		}

		/**
		 * Check if there're pending events
		 *
		 * @return {*}  {boolean}
		 * @memberof ProviderEventsManager
		 */
		public get hasPendingEvents(): boolean {
			return this._pendingEventsMap.size > 0;
		}
	}
}
