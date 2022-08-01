// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	export interface IProviderEvent {
		callback: GlobalCallbacks.Generic;
		eventName: string;
		uniqueId: string;
	}
}
