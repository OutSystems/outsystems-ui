// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.ProviderEvents {
	export interface IProviderEvent {
		callback: GlobalCallbacks.Generic;
		eventName: string;
		eventUniqueId: string;
	}
}
