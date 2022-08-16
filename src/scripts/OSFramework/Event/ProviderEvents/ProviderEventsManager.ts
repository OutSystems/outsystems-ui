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
		 * @param {string} eventUniqueId
		 * @memberof ProviderEventsManager
		 */
		public addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void {
			// Check if we've everything needed to store the event
			if (eventName === '' || callback === undefined || eventUniqueId === '') {
				throw new Error(
					`${ErrorCodes.ProviderEventsManager.FailSavingPendingEvent}: The event can not be saved.`
				);
			}

			const newEvent = new ProviderEvent(callback, eventName, eventUniqueId);
			this._pendingEventsMap.set(eventUniqueId, newEvent);
		}

		/**
		 * Method to remove a pending event
		 *
		 * @param {string} eventUniqueId
		 * @memberof ProviderEventsManager
		 */
		public removePendingEvent(eventUniqueId: string): void {
			const event = this._pendingEventsMap.has(eventUniqueId);

			if (event) {
				this._pendingEventsMap.delete(eventUniqueId);
			} else {
				throw new Error(
					`${ErrorCodes.ProviderEventsManager.FailPendingEventRemoval}: The event with eventId:'${eventUniqueId}' does not exist`
				);
			}
		}

		/**
		 * Method to remove a saved event
		 *
		 * @param {string} eventUniqueId
		 * @memberof ProviderEventsManager
		 */
		public removeSavedEvent(eventUniqueId: string): void {
			const event = this._eventsMap.has(eventUniqueId);

			if (event) {
				this._eventsMap.delete(eventUniqueId);
			} else {
				throw new Error(
					`${ErrorCodes.ProviderEventsManager.FailSavedEventRemoval}: The event with eventId:'${eventUniqueId}' does not exist`
				);
			}
		}

		/**
		 * Method to save an event
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.Generic} callback
		 * @param {string} eventUniqueId
		 * @memberof ProviderEventsManager
		 */
		public saveEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void {
			// Check if we've everything needed to store the event
			if (eventName === '' || callback === undefined || eventUniqueId === '') {
				throw new Error(`${ErrorCodes.ProviderEventsManager.FailSavingEvent}: The event can not be saved.`);
			}

			let _newEvent: IProviderEvent;

			// If the event we are adding was already on the pending ones, get that one
			if (this._pendingEventsMap.has(eventUniqueId)) {
				_newEvent = this._pendingEventsMap.get(eventUniqueId);
				this._pendingEventsMap.delete(eventUniqueId);
			} else {
				// Otherwise create a new one
				_newEvent = new ProviderEvent(callback, eventName, eventUniqueId);
			}

			this._eventsMap.set(eventUniqueId, _newEvent);
		}

		/**
		 * Get all the existing events
		 *
		 * @type {Map<string, IProviderEvent>}
		 * @memberof ProviderEventsManager
		 */
		public get events(): Map<string, IProviderEvent> {
			return this._eventsMap;
		}

		/**
		 * Get all the existing pending events
		 *
		 * @readonly
		 * @type {Map<string, IProviderEvent>}
		 * @memberof ProviderEventsManager
		 */
		public get pendingEvents(): Map<string, IProviderEvent> {
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
