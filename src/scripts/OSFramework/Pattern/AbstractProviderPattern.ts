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
		// Holds the callback for the onInitialized event
		private _platformEventInitialized: GlobalCallbacks.OSGeneric;
		// Holds the callback for the provider config applied event
		private _platformEventProviderConfigsAppliedCallback: GlobalCallbacks.OSGeneric;
		// Holds the provider
		protected _provider: P;
		// Holds the provider info
		protected _providerInfo: ProviderInfo;
		// Holds the providerEvents instance, that manages the provider events
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

		// Method to get an event index from an array
		private _getEventIndexFromArray(event: Event.ProviderEvents.IProviderEvent): number {
			// Get callback from array
			const _providerCallback = this.providerInfo.events[event.eventName].find((item) => {
				return item === event.callback;
			});

			if (_providerCallback === undefined) {
				throw Error(
					ErrorCodes.AbstractProviderPattern.FailProviderEventRemoval.code +
						': ' +
						ErrorCodes.AbstractProviderPattern.FailProviderEventRemoval.message
				);
			}

			// Get the index, using the callback
			return this.providerInfo.events[event.eventName].findIndex((item) => {
				return item === _providerCallback;
			});
		}

		// Method to check the provider events api type and add/ remove events
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _handleProviderEventsAPI(
			eventName: string,
			callback: GlobalCallbacks.Generic,
			addEvent: boolean,
			event?: Event.ProviderEvents.IProviderEvent
		): void {
			const events = this.providerInfo.events;

			// Check if is array
			if (Array.isArray(events[eventName])) {
				if (addEvent) {
					events[eventName].push(callback);
				} else {
					events[eventName].splice(this._getEventIndexFromArray(event), 1);
				}
			}
			// Check if addEventListener is valid
			else if (typeof events.addEventListener === Constants.JavaScriptTypes.Function) {
				if (addEvent) {
					events.addEventListener(eventName, callback);
				} else {
					events.removeEventListener(eventName, callback);
				}
			}
			// Check if instance.on is valid
			else if (typeof events.on === Constants.JavaScriptTypes.Function) {
				if (addEvent) {
					events.on(eventName, callback);
				} else {
					events.off(eventName, callback);
				}
			} else {
				const errorMessage = addEvent
					? ErrorCodes.AbstractProviderPattern.FailProviderEventSet.message
					: ErrorCodes.AbstractProviderPattern.FailProviderEventRemoval.message;

				throw new Error(`${eventName}: ${errorMessage}`);
			}
		}

		// Trigger platform's InstanceIntializedHandler client Action
		protected triggerPlatformEventInitialized(): void {
			// Ensure it's only be trigger the first time!
			if (this.isBuilt === false) {
				this.triggerPlatformEventplatformCallback(this._platformEventInitialized);
			}
		}

		protected triggerPlatformEventplatformCallback(
			platFormCallback: GlobalCallbacks.OSGeneric,
			...args: unknown[]
		): void {
			if (platFormCallback !== undefined) {
				Helper.AsyncInvocation(platFormCallback, this.widgetId, ...args);
			}
		}

		/**
		 * Unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSUISplide
		 */
		protected unsetCallbacks(): void {
			this._platformEventInitialized = undefined;
			this._platformEventProviderConfigsAppliedCallback = undefined;
		}

		/**
		 * Method to build the pattern
		 *
		 * @memberof AbstractProviderPattern
		 */
		public build(): void {
			this.providerInfo = {
				name: undefined,
				version: undefined,
				events: undefined,
			};
			super.build();
		}

		/**
		 * Method to check for pending events to be added
		 *
		 * @memberof AbstractProviderPattern
		 */
		public checkAddedProviderEvents(): void {
			if (this.providerEventsManagerInstance?.hasEvents) {
				// check if there're events pending
				this.providerEventsManagerInstance.events.forEach((value) => {
					this.setProviderEvent(value.eventName, value.callback, value.eventUniqueId, false); // add provider event
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
				this.providerEventsManagerInstance.pendingEvents.forEach((value, key) => {
					this.setProviderEvent(value.eventName, value.callback, value.eventUniqueId); // add provider event
					this.providerEventsManagerInstance.removePendingEvent(key);
				});
			}
		}

		/**
		 * Method to destroy created instance
		 *
		 * @memberof AbstractProviderPattern
		 */
		public dispose(): void {
			super.dispose();
		}

		/**
		 * Register the default events for provider based patterns.
		 *
		 * @abstract
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof AbstractProviderPattern
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case GlobalEnum.ProviderEvents.Initialized:
					if (this._platformEventInitialized === undefined) {
						this._platformEventInitialized = callback;
					}
					break;
				case GlobalEnum.ProviderEvents.OnProviderConfigsApplied:
					if (this._platformEventProviderConfigsAppliedCallback === undefined) {
						this._platformEventProviderConfigsAppliedCallback = callback;
					}
					break;
				default:
					throw new Error(
						`The pattern with id '${this.widgetId}' does not have the event '${eventName}' defined.`
					);
			}
		}

		/**
		 * Method used to set all the provider configs. In the AbstractProviderPattern, it
		 * will simply trigger the callback to warn that the configs have been applied to the provider.
		 * @param {ProviderConfigs} providerConfigs
		 * @memberof AbstractProviderPattern
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public setProviderConfigs(providerConfigs: unknown): void {
			this.triggerPlatformEventplatformCallback(this._platformEventProviderConfigsAppliedCallback);
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
			if (this.providerInfo.events === undefined) {
				this.providerEventsManagerInstance.addPendingEvent(eventName, callback, uniqueId);
				return;
			}

			// Add event
			this._handleProviderEventsAPI(eventName, callback, true);

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
			// Get event from saved events map
			const _event = this.providerEventsManagerInstance?.events.get(eventId);

			if (_event === undefined) {
				throw Error(
					ErrorCodes.AbstractProviderPattern.FailProviderEventRemoval.code +
						': ' +
						ErrorCodes.AbstractProviderPattern.FailProviderEventRemoval.message
				);
			}

			// Call the method that will handle the removal of this event
			this._handleProviderEventsAPI(_event.eventName, _event.callback, false, _event);

			// Removed from the saved events map
			if (this.providerEventsManagerInstance) {
				this.providerEventsManagerInstance.removeSavedEvent(eventId);
			}
		}

		/**
		 * Method to update the provider events API instance and save/pending events
		 *
		 * @param {ProviderInfo} providerInfo
		 * @memberof AbstractProviderPattern
		 */
		public updateProviderEvents(providerInfo: ProviderInfo): void {
			// Update provider instance reference
			this.providerInfo.events = providerInfo.events;

			if (this.isBuilt) {
				// Check if there're any pending events to be added by the SetProviderEvent API
				Helper.AsyncInvocation(this.checkPendingProviderEvents.bind(this));
				// and/or add them again after a destroy has ocurred
				Helper.AsyncInvocation(this.checkAddedProviderEvents.bind(this));
			} else {
				// These won't change, so they can be updated only once
				this.providerInfo.name = providerInfo.name;
				this.providerInfo.version = providerInfo.version;
			}
		}
	}
}
