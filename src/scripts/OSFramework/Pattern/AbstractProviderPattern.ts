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
		// Hold the provider API instance path to add events
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _providerEventsAPI: ProviderConfigs;
		// Hold the pattern's callback that add the provider events
		private _setProviderEventHandler: GlobalCallbacks.Generic;
		// Holds the provider
		protected _provider: P;
		// Holds the provider info
		protected _providerInfo: ProviderInfo;
		// HOlds the providerEvents instance, that manages the provider events
		protected providerEventsManagerInstance: Event.ProviderEvents.IProviderEventManager;

		/**
		 * ProviderInfo getter
		 *
		 * @type {ProviderInfo}
		 * @memberof AbstractProviderPattern
		 */
		public get providerInfo(): ProviderInfo {
			return this._providerInfo;
		}

		/**
		 * ProviderInfo setter
		 *
		 * @memberof AbstractProviderPattern
		 */
		public set providerInfo(providerInfo: ProviderInfo) {
			this._providerInfo = providerInfo;
		}

		/**
		 * Provider setter
		 *
		 * @memberof AbstractProviderPattern
		 */
		public set provider(p: P) {
			this._provider = p;
		}

		/**
		 * Provider getter
		 *
		 * @type {P}
		 * @memberof AbstractProviderPattern
		 */
		public get provider(): P {
			return this._provider;
		}

		/**
		 * Method to add a provider event using extensibility
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.Generic} callback
		 * @param {string} uniqueId
		 * @param {boolean} [saveEvent=true]
		 * @return {*}  {void}
		 * @memberof AbstractProviderPattern
		 */
		public addProviderEvent(
			eventName: string,
			callback: GlobalCallbacks.Generic,
			uniqueId: string,
			saveEvent = true
		): void {
			// If there's no instance yet, create one
			if (this.providerEventsManagerInstance === undefined) {
				this.providerEventsManagerInstance = new Event.ProviderEvents.ProviderEventsManager();
			}

			// If the providerEventsAPI is not available, add this one to the pending events
			if (this._providerEventsAPI === undefined) {
				this.providerEventsManagerInstance.addPendingEvent(eventName, callback, uniqueId);
				return;
			}

			// Trigger the pattern's callback that will add the provider events
			Helper.AsyncInvocation(this._setProviderEventHandler.bind(this), eventName, callback);

			// Save added event
			if (saveEvent) {
				this.providerEventsManagerInstance.saveEvent(eventName, callback, uniqueId);
			}
		}

		/**
		 * Method to check for pending events to be added
		 *
		 * @memberof AbstractProviderPattern
		 */
		public checkAddedProviderEvents(): void {
			if (this.providerEventsManagerInstance?.hasEvents) {
				// check if there're events pending
				this.providerEventsManagerInstance.eventsMap.forEach((value) => {
					this.addProviderEvent(value.eventName, value.callback, value.uniqueId, false); // add provider event
				});
			}
		}

		/**
		 * Method to check for saved events to be added after a destroy/init cycle
		 *
		 * @memberof AbstractProviderPattern
		 */
		public checkPendingProviderEvents(): void {
			if (this.providerEventsManagerInstance?.hasPendingEvents) {
				// check if there're events saved
				this.providerEventsManagerInstance.pendingEventsMap.forEach((value, key) => {
					this.addProviderEvent(value.eventName, value.callback, value.uniqueId); // add provider event
					this.providerEventsManagerInstance.removePendingEvent(key);
				});
			}
		}

		/**
		 * Method to register providerEvent properties and events
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.Generic} callback
		 * @param {string} uniqueId
		 * @param {ProviderConfigs} providerEventsAPI
		 * @param {GlobalCallbacks.Generic} providerEventHandler
		 * @memberof AbstractProviderPattern
		 */
		public registerProviderEvent(
			eventName: string,
			callback: GlobalCallbacks.Generic,
			uniqueId: string,
			providerEventsAPI: ProviderConfigs,
			providerEventHandler: GlobalCallbacks.Generic
		): void {
			// Set the handler for future reference
			this._setProviderEventHandler = providerEventHandler;
			// Set the providerInstanceAPI for future reference
			this._providerEventsAPI = providerEventsAPI;
			// Add this event
			this.addProviderEvent(eventName, callback, uniqueId);
		}

		public abstract registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		public abstract setProviderConfigs(providerConfigs: ProviderConfigs): void;
		public abstract setProviderEvent(
			eventName: string,
			callback: OSFramework.GlobalCallbacks.Generic,
			uniqueId: string
		): void;
		public abstract setProviderEventHandler(eventName: string, callback: OSFramework.GlobalCallbacks.Generic): void;
	}
}
