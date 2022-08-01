// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.ProviderEvents {
	export interface IProviderEvent {
		callback: GlobalCallbacks.Generic;
		eventName: string;
		uniqueId: string;
	}
}
