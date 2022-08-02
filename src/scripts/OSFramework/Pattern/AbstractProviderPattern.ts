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
		// Holds the provider
		protected _provider: P;
		// Holds the provider api used to set events
		protected _providerEventsAPI: ProviderType;
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

		private _getEventIndexFromArray(event: Event.ProviderEvents.IProviderEvent): number {
			const _providerCallback = this._providerEventsAPI[event.eventName].find((item) => {
				return item === event.callback;
			});

			if (_providerCallback === undefined) {
				return undefined;
			}

			return this._providerEventsAPI[event.eventName].findIndex((item) => {
				return item === _providerCallback;
			});
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
					this.setProviderEvent(value.eventName, value.callback, value.uniqueId, false); // add provider event
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
					this.setProviderEvent(value.eventName, value.callback, value.uniqueId); // add provider event
					this.providerEventsManagerInstance.removePendingEvent(key);
				});
			}
		}

		public handleProviderEventsAPI(
			eventName?: string,
			callback?: GlobalCallbacks.Generic,
			addEvent?: boolean,
			event?: Event.ProviderEvents.IProviderEvent
		): void {
			// Add event on provider
			if (Array.isArray(this._providerEventsAPI[eventName])) {
				addEvent
					? this._providerEventsAPI[eventName].push(callback)
					: this._providerEventsAPI[eventName].splice(this._getEventIndexFromArray(event), 1);
			} else if (typeof this._providerEventsAPI.addEventListener === 'function') {
				addEvent
					? this._providerEventsAPI.addEventListener(eventName, callback)
					: this._providerEventsAPI.removeEventListener(eventName, callback);
			} else {
				addEvent
					? this._providerEventsAPI.on(eventName, callback)
					: this._providerEventsAPI.off(eventName, callback);
			}
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
		public setProviderEvent(
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
			if (this.providerInfo.supportedConfigs === undefined) {
				this.providerEventsManagerInstance.addPendingEvent(eventName, callback, uniqueId);
				return;
			}

			// Add event
			this.handleProviderEventsAPI(eventName, callback, true);

			// Save added event
			if (saveEvent) {
				this.providerEventsManagerInstance.saveEvent(eventName, callback, uniqueId);
			}
		}

		/**
		 * Method to remove a provider event using extensibility
		 *
		 * @param {string} eventId
		 * @return {*}  {void}
		 * @memberof AbstractProviderPattern
		 */
		public unsetProviderEvent(eventId: string): void {
			const _event = this.providerEventsManagerInstance?.eventsMap.get(eventId);

			if (_event === undefined) {
				return;
			}

			this.handleProviderEventsAPI(_event.eventName, _event.callback, false, _event);

			if (this.providerEventsManagerInstance) {
				this.providerEventsManagerInstance.removeSavedEvent(eventId);
			}
		}

		public abstract registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		public abstract setProviderConfigs(providerConfigs: ProviderConfigs): void;
	}
}
