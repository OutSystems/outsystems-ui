// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.ProviderEvents {
	export class ProviderEvent implements IProviderEvent {
		public callback: GlobalCallbacks.Generic;
		public eventName: string;
		public uniqueId: string;

		constructor(callback: GlobalCallbacks.Generic, eventName: string, uniqueId: string) {
			this.callback = callback;
			this.eventName = eventName;
			this.uniqueId = uniqueId;
		}
	}
}
