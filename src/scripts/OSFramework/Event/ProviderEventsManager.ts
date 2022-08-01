// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	export class ProviderEventsManager implements IProviderEventManager {
		private _eventsMap = new Map<string, IProviderEvent>();
		private _pendingEventsMap = new Map<string, IProviderEvent>();

		public get eventsMap(): Map<string, IProviderEvent> {
			return this._eventsMap;
		}

		public get pendingEventsMap(): Map<string, IProviderEvent> {
			return this._pendingEventsMap;
		}

		public addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic): void {
			const _uniqueId = Helper.Dom.GenerateUniqueId();
			const newEvent = new ProviderEvent(callback, eventName, _uniqueId);
			this._pendingEventsMap.set(_uniqueId, newEvent);
		}

		public hasEvents(): boolean {
			return this._eventsMap.size > 0;
		}

		public hasPendingEvents(): boolean {
			return this._pendingEventsMap.size > 0;
		}

		public removePendingEvent(uniqueId: string): void {
			const event = this._pendingEventsMap.get(uniqueId);

			if (event) {
				this._pendingEventsMap.delete(uniqueId);
			}
		}

		public saveEvent(eventName: string, callback: GlobalCallbacks.Generic): void {
			const _uniqueId = Helper.Dom.GenerateUniqueId();
			const newEvent = new ProviderEvent(callback, eventName, _uniqueId);
			this._eventsMap.set(_uniqueId, newEvent);
		}
	}
}
