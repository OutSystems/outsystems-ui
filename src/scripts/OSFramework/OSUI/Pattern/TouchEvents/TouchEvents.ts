// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TouchEvents {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TouchEvents extends AbstractPattern<TouchEventsConfig> implements ITouchEvents {
		//Stores the current position
		private _currentX: number;
		private _currentY: number;

		// Stores the touch event with bind(this)
		private _endEvent: GlobalCallbacks.Generic;
		//Stores the callback to be triggered
		private _endEventCallback: GlobalCallbacks.Generic;
		//Stores the callback to be triggered
		private _eventMoveCallback: GlobalCallbacks.Generic;
		//Stores the callback to be triggered
		private _eventStartCallback: GlobalCallbacks.Generic;
		// Stores the touch event with bind(this)
		private _moveEvent: GlobalCallbacks.Generic;
		// Stores the touch event with bind(this)
		private _startEvent: GlobalCallbacks.Generic;
		// Stores the moment when the touch began
		private _startTime: number;
		// Stores the start position
		private _startX: number;
		private _startY: number;
		// Stores the moment when the touch finished.
		private _timeTaken: number;
		// Controls if we're "touching" the element
		private _touchingElement: boolean;
		// The element to which we have bound this pattern
		private _trackableElement: HTMLElement;
		// Stores the touch movement position
		private _translateX: number;
		private _translateY: number;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TouchEventsConfig(configs));
			this._startX = 0;
			this._startY = 0;
			this._currentX = 0;
			this._currentY = 0;
			this._touchingElement = false;
		}

		// Detects if the "touch" has ended
		private _eventTouchEnd(): void {
			if (this._touchingElement) {
				this._touchingElement = false;
				this._translateX = this._currentX - this._startX;
				this._translateY = this._currentY - this._startY;

				this._timeTaken = new Date().getTime() - this._startTime;

				this._triggerTouchEnd();
			}
		}

		// Detects if the "touch" is moving
		private _eventTouchMove(evt: TouchEvent): void {
			if (this._touchingElement) {
				this._currentX = evt.changedTouches[0].pageX;
				this._currentY = evt.changedTouches[0].pageY;
				this._translateX = this._currentX - this._startX;
				this._translateY = this._currentY - this._startY;

				this._triggerTouchMove(evt);
			}
		}

		// Detects if the "touch" has started
		private _eventTouchStart(evt: TouchEvent): void {
			this._startTime = new Date().getTime();
			this._startX = evt.changedTouches[0].pageX;
			this._currentX = this._startX;

			this._startY = evt.changedTouches[0].pageY;
			this._currentY = this._startY;

			this._touchingElement = true;

			this._triggerTouchStart();
		}

		// Remove Events
		private _removeEventListeners(): void {
			if (this._trackableElement) {
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		// Set Events
		private _setEventListeners(): void {
			if (this._trackableElement) {
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		// Method that triggers the TouchEnd event on the platform
		private _triggerTouchEnd(): void {
			if (this._endEventCallback) {
				Helper.AsyncInvocation(
					this._endEventCallback,
					this._currentX,
					this._currentY,
					this._translateX,
					this._translateY,
					this._timeTaken
				);
			}
		}

		// Method that triggers the TouchMove event on the platform
		private _triggerTouchMove(event: TouchEvent): void {
			if (this._eventMoveCallback) {
				Helper.AsyncInvocation(
					this._eventMoveCallback,
					this._currentX,
					this._currentY,
					this._translateX,
					this._translateY,
					event
				);
			}
		}

		// Method that triggers the TouchStart event on the platform
		private _triggerTouchStart(): void {
			if (this._eventStartCallback) {
				Helper.AsyncInvocation(this._eventStartCallback, this._startX, this._startY);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		protected setA11YProperties(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Sets the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		protected setCallbacks(): void {
			this._endEvent = this._eventTouchEnd.bind(this);
			this._moveEvent = this._eventTouchMove.bind(this);
			this._startEvent = this._eventTouchStart.bind(this);

			this._setEventListeners();
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		protected setHtmlElements(): void {
			this._trackableElement = document.getElementById(this.configs.WidgetId);
		}

		/**
		 * Removes event listeners and callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		protected unsetCallbacks(): void {
			this._removeEventListeners();

			this._endEvent = undefined;
			this._moveEvent = undefined;
			this._startEvent = undefined;
		}

		/**
		 * Release references to HTML elements.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		protected unsetHtmlElements(): void {
			this._trackableElement = undefined;
		}

		/**
		 * Method to build the TouchEvents
		 *
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setCallbacks();
			this.finishBuild();
		}

		/**
		 * Destroy TouchEvents
		 *
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		public dispose(): void {
			super.dispose();
			this.unsetCallbacks();
			this.unsetHtmlElements();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {GlobalCallbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSFramework.Patterns.TouchEvents.TouchEvents
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.TouchEvents.Enum.Events.End:
					this._endEventCallback = callback;
					break;
				case Patterns.TouchEvents.Enum.Events.Move:
					this._eventMoveCallback = callback;
					break;
				case Patterns.TouchEvents.Enum.Events.Start:
					this._eventStartCallback = callback;
					break;
			}
		}
	}
}
