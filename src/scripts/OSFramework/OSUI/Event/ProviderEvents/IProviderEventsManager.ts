// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.ProviderEvents {
	export interface IProviderEventManager {
		addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void;
		get events(): Map<string, IProviderEvent>;
		get hasEvents(): boolean;
		get hasPendingEvents(): boolean;
		get pendingEvents(): Map<string, IProviderEvent>;
		removePendingEvent(eventUniqueId: string): void;
		removeSavedEvent(eventUniqueId: string): void;
		saveEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void;
	}
}
