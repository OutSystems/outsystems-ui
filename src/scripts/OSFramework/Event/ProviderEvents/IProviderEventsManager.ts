// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.ProviderEvents {
	export interface IProviderEventManager {
		eventsMap: Map<string, IProviderEvent>;
		pendingEventsMap: Map<string, IProviderEvent>;
		addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic): void;
		hasEvents(): boolean;
		hasPendingEvents(): boolean;
		removePendingEvent(uniqueId: string): void;
		saveEvent(eventName: string, callback: GlobalCallbacks.Generic): void;
	}
}
