// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.ProviderEvents {
	export class ProviderEvent implements IProviderEvent {
		public callback: GlobalCallbacks.Generic;
		public eventName: string;
		public eventUniqueId: string;

		constructor(callback: GlobalCallbacks.Generic, eventName: string, eventUniqueId: string) {
			this.callback = callback;
			this.eventName = eventName;
			this.eventUniqueId = eventUniqueId;
		}
	}
}
