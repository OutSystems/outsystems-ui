// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	export class ProviderEventsManager implements IProviderEventManager {
		private _eventsMap = new Map<string, IProviderEvent>();
		private _pendingEventsMap = new Map<string, IProviderEvent>();
		private _handlers: GlobalCallbacks.Generic[] = [];

		public get handlers(): GlobalCallbacks.Generic[] {
			return this._handlers;
		}

		public get eventsMap(): Map<string, IProviderEvent> {
			return this._eventsMap;
		}

		public get pendingEventsMap(): Map<string, IProviderEvent> {
			return this._pendingEventsMap;
		}

		public addEvent(eventName: string, callback: GlobalCallbacks.Generic): void {
			const _uniqueId = Helper.Dom.GenerateUniqueId();
			const newEvent = new ProviderEvent(callback, eventName, _uniqueId);
			this._handlers.push(newEvent.callback);
			this._eventsMap.set(_uniqueId, newEvent);
		}

		public addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic): void {
			const _uniqueId = Helper.Dom.GenerateUniqueId();
			const newEvent = new ProviderEvent(callback, eventName, _uniqueId);
			this._pendingEventsMap.set(_uniqueId, newEvent);
		}

		public hasEvents(): boolean {
			return this._handlers.length > 0;
		}

		public hasPendingEvents(): boolean {
			return this._pendingEventsMap.size > 0;
		}

		public removeEvent(uniqueId: string): void {
			const event = this._eventsMap.get(uniqueId);

			if (event) {
				this._eventsMap.delete(uniqueId);
			}
		}
	}
}
