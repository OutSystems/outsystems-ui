// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns {
	/**
	 * Defines the Default props and methods for OutSystemsUI Patterns
	 *
	 * @export
	 * @abstract
	 * @class AbstractPattern
	 * @implements {Interface.IPattern}
	 * @template C
	 */
	export abstract class AbstractProviderPattern<P, C extends AbstractConfiguration>
		extends AbstractPattern<C>
		implements Interface.IProviderPattern<P>
	{
		private _providerConfigInstance: P;
		private _setProviderEventHandler: GlobalCallbacks.Generic;
		protected _provider: P;
		protected _providerInfo: ProviderInfo;
		protected providerEventsManagerInstance: Event.ProviderEvents.IProviderEventManager;

		public get providerInfo(): ProviderInfo {
			return this._providerInfo;
		}

		public set providerInfo(providerInfo: ProviderInfo) {
			this._providerInfo = providerInfo;
		}

		public set provider(p: P) {
			this._provider = p;
		}

		public get provider(): P {
			return this._provider;
		}

		public addProviderEvent(eventName: string, callback: GlobalCallbacks.Generic, saveEvent = true): void {
			if (this.providerEventsManagerInstance === undefined) {
				this.providerEventsManagerInstance = new Event.ProviderEvents.ProviderEventsManager();
			}

			if (this._providerConfigInstance === undefined) {
				this.providerEventsManagerInstance.addPendingEvent(eventName, callback);
				return;
			}

			Helper.AsyncInvocation(this._setProviderEventHandler.bind(this), eventName, callback);

			if (saveEvent) {
				this.providerEventsManagerInstance.saveEvent(eventName, callback);
			}
		}

		public checkAddedProviderEvents(): void {
			if (this.providerEventsManagerInstance?.hasEvents) {
				this.providerEventsManagerInstance.eventsMap.forEach((value) => {
					this.addProviderEvent(value.eventName, value.callback, false); // add provider event
				});
			}
		}

		public checkPendingProviderEvents(): void {
			if (this.providerEventsManagerInstance?.hasPendingEvents) {
				this.providerEventsManagerInstance.pendingEventsMap.forEach((value, key) => {
					this.addProviderEvent(value.eventName, value.callback); // add provider event
					this.providerEventsManagerInstance.removePendingEvent(key);
				});
			}
		}

		public registerProviderEvent(
			eventName: string,
			callback: GlobalCallbacks.Generic,
			providerInstance: P,
			providerEventHandler: GlobalCallbacks.Generic
		): void {
			this._setProviderEventHandler = providerEventHandler;
			this._providerConfigInstance = providerInstance;
			this.addProviderEvent(eventName, callback);
		}
		public abstract registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		public abstract setProviderConfigs(providerConfigs: ProviderConfigs): void;
		public abstract setProviderEvent(eventName: string, callback: OSFramework.GlobalCallbacks.Generic): void;
	}
}
