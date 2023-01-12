// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns {
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
		// Holds the provider info
		protected _providerInfo: ProviderInfo;
		// Holds the providerEvents instance, that manages the provider events
		protected providerEventsManagerInstance: Event.ProviderEvents.IProviderEventManager;

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

		/**
		 * Method that will be responsible to redraw pattern when needed
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		protected redraw(): void {
			// Check if provider has been set!
			if (this._provider !== undefined) {
				// Destroy provider instance
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-expect-error
				this._provider.destroy();

				// Trigger a new instance creation with updated configs
				this.prepareConfigs();
			}
		}

		/**
		 * Trigger platform's InstanceIntializedHandler client Action
		 *
		 * @param {GlobalCallbacks.OSGeneric} platFormCallback
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		protected triggerPlatformEventInitialized(platFormCallback: GlobalCallbacks.OSGeneric): void {
			// Ensure it's only be trigger the first time!
			if (this.isBuilt === false) {
				Helper.AsyncInvocation(platFormCallback, this.widgetId);
			}
		}

		/**
		 * Build the Pattern
		 *
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
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
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
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
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
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
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		public dispose(): void {
			this.providerEventsManagerInstance = undefined;
			super.dispose();
		}

		/**
		 * Method to add a provider event using extensibility
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.Generic} callback
		 * @param {string} uniqueId
		 * @param {boolean} [saveEvent=true]
		 * @return {*}  {void}
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
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
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
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
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
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

		/**
		 * ProviderInfo getter
		 *
		 * @readonly
		 * @type {ProviderInfo}
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		public get providerInfo(): ProviderInfo {
			return this._providerInfo;
		}

		/**
		 * ProviderInfo setter
		 *
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		public set providerInfo(providerInfo: ProviderInfo) {
			this._providerInfo = providerInfo;
		}

		/**
		 * Provider setter
		 *
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		public set provider(p: P) {
			this._provider = p;
		}

		/**
		 * Provider getter
		 *
		 * @readonly
		 * @type {P}
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		public get provider(): P {
			return this._provider;
		}

		// Common methods all providers must implement
		protected abstract prepareConfigs(): void;
		public abstract registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		public abstract setProviderConfigs(providerConfigs: ProviderConfigs): void;
	}
}
