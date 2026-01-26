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
		// Holds the id of the asyncInvocation that will turn redraw async
		private _asyncInvocationId = 0;
		// Holds the callback for the provider config applied event
		private _platformEventProviderConfigsAppliedCallback: GlobalCallbacks.OSGeneric;
		// Holds the provider
		private _provider: P;
		// Holds the provider info
		private _providerInfo: ProviderInfo;
		// Holds the callback for the redraw event
		private _redrawCallback: GlobalCallbacks.Generic;
		// Holds the providerEvents instance, that manages the provider events
		protected providerEventsManagerInstance: Event.ProviderEvents.IProviderEventManager;

		/**
		 * Creates an instance of AbstractProviderPattern.
		 *
		 * @param {string} uniqueId
		 * @param {C} configs
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			this.isProviderBased = true;
		}

		// Method that will check if there is already a redraw process runing in order to cancel it
		private _cancelRedraw(): void {
			if (this._asyncInvocationId !== 0) {
				clearTimeout(this._asyncInvocationId);
			}
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

		// Method that will execute the redraw process
		private _handleRedraw(): void {
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
		 * Method that will be responsible to redraw pattern when needed
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		protected redraw(): void {
			/* If a redraw has been trigger before the previous occured, 
			cancel the previous one and restart a new redraw process, 
			this way multiple redraws will be prevented.  */
			this._cancelRedraw();

			this._asyncInvocationId = OSUI.Helper.AsyncInvocation(() => {
				this._handleRedraw();
			});
		}

		/**
		 * Unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		protected unsetCallbacks(): void {
			this._platformEventProviderConfigsAppliedCallback = undefined;
		}

		/**
		 * Method to build the pattern
		 *
		 * @memberof OSFramework.Patterns.AbstractProviderPattern
		 */
		public build(): void {
			this.providerInfo = {
				name: undefined,
				version: undefined,
				events: undefined,
			};

			// Force provider redraw/update when rtl is changed in runtime
			this._redrawCallback = this.redraw.bind(this);

			OSFramework.OSUI.Event.DOMEvents.Observers.GlobalObserverManager.Instance.addHandler(
				Event.DOMEvents.Observers.ObserverEvent.Language,
				this._redrawCallback
			);

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
			OSFramework.OSUI.Event.DOMEvents.Observers.GlobalObserverManager.Instance.removeHandler(
				Event.DOMEvents.Observers.ObserverEvent.Language,
				this._redrawCallback
			);

			this._redrawCallback = undefined;

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
				case GlobalEnum.ProviderEvents.OnProviderConfigsApplied:
					if (this._platformEventProviderConfigsAppliedCallback === undefined) {
						this._platformEventProviderConfigsAppliedCallback = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
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
			this.triggerPlatformEventCallback(this._platformEventProviderConfigsAppliedCallback);
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
	}
}
