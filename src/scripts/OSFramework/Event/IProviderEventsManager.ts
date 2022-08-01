// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	export interface IProviderEventManager {
		eventsMap: Map<string, IProviderEvent>;
		pendingEventsMap: Map<string, IProviderEvent>;
		handlers: GlobalCallbacks.Generic[];
		addEvent(eventName: string, callback: GlobalCallbacks.Generic): void;
		addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic): void;
		hasEvents(): boolean;
		hasPendingEvents(): boolean;
		removeEvent(uniqueId: string): void;
	}
}
