// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class GestureEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export abstract class GestureEvent {
		// Stores the end touch event with bind(this)
		private _endEvent: Callbacks.Generic;
		private _endTriggerCallback: Callbacks.Generic;
		// Stores the move touch event with bind(this)
		private _moveEvent: Callbacks.Generic;
		private _moveTriggerCallback: Callbacks.Generic;
		// Stores the start touch event with bind(this)
		private _startEvent: Callbacks.Generic;
		private _startTriggerCallback: Callbacks.Generic;
		// Store the target element that receives the lsiteners
		private _targetElement: HTMLElement;

		/**
		 * Holds all the neccessary values on the start, move, end events lifecycle
		 *
		 * @protected
		 * @memberof GestureEvent
		 */
		protected readonly gestureParams = {
			CurrentX: 0,
			CurrentY: 0,
			StartTime: 0,
			StartX: 0,
			StartY: 0,
			TimeTaken: 0,
			TouchingElement: false,
			OffsetX: 0,
			OffsetY: 0,
			Event: undefined,
		};

		constructor(target: HTMLElement) {
			this._targetElement = target;
		}

		// Callback method for the ontouchend event, that triggers the passed callback to the target
		private _eventTouchEnd(): void {
			if (this.gestureParams.TouchingElement) {
				this.gestureParams.TouchingElement = false;
				this.gestureParams.OffsetX = this.gestureParams.CurrentX - this.gestureParams.StartX;
				this.gestureParams.OffsetY = this.gestureParams.CurrentY - this.gestureParams.StartY;
				this.gestureParams.TimeTaken = new Date().getTime() - this.gestureParams.StartTime;

				if (this._endTriggerCallback) {
					this._endTriggerCallback(
						this.gestureParams.OffsetX,
						this.gestureParams.OffsetY,
						this.gestureParams.TimeTaken
					);
				}
			}
		}

		// Callback method for the ontouchmove event, that triggers the passed callback to the target
		private _eventTouchMove(evt: TouchEvent): void {
			if (this.gestureParams.TouchingElement) {
				this.gestureParams.CurrentX = evt.changedTouches[0].pageX;
				this.gestureParams.CurrentY = evt.changedTouches[0].pageY;
				this.gestureParams.OffsetX = this.gestureParams.CurrentX - this.gestureParams.StartX;
				this.gestureParams.OffsetY = this.gestureParams.CurrentY - this.gestureParams.StartY;
				// Prevent scrolling the page while doing gesture
				evt.preventDefault();
				if (this._moveTriggerCallback !== undefined) {
					this._moveTriggerCallback(
						this.gestureParams.CurrentX,
						this.gestureParams.CurrentY,
						this.gestureParams.OffsetX,
						this.gestureParams.OffsetY,
						this.gestureParams.Event
					);
				}
			}
		}

		// Callback method for the ontouchstart event, that triggers the passed callback to the target
		private _eventTouchStart(evt: TouchEvent): void {
			this.gestureParams.StartTime = new Date().getTime();
			this.gestureParams.StartX = evt.changedTouches[0].pageX;
			this.gestureParams.CurrentX = this.gestureParams.StartX;
			this.gestureParams.StartY = evt.changedTouches[0].pageY;
			this.gestureParams.CurrentY = this.gestureParams.StartY;
			this.gestureParams.TouchingElement = true;
			this.gestureParams.Event = evt;
			if (this._startTriggerCallback !== undefined) {
				this._startTriggerCallback(this.gestureParams.StartX, this.gestureParams.StartY);
			}
		}

		// Method that removes the added event listeners
		private _removeEventListeners(): void {
			if (this._targetElement) {
				this._targetElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._targetElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._targetElement.removeEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		// Method that unsets all the callback defined
		private _unsetCallbacks(): void {
			this._endEvent = undefined;
			this._moveEvent = undefined;
			this._startEvent = undefined;

			this._startTriggerCallback = undefined;
			this._moveTriggerCallback = undefined;
			this._endTriggerCallback = undefined;
		}

		/**
		 * Method to set the callbacks
		 *
		 * @protected
		 * @param {Callbacks.Generic} [onStartCallback]
		 * @param {Callbacks.Generic} [onMoveCallback]
		 * @param {Callbacks.Generic} [onEndCallback]
		 * @memberof GestureEvent
		 */
		protected setCallbacks(
			onStartCallback?: Callbacks.Generic,
			onMoveCallback?: Callbacks.Generic,
			onEndCallback?: Callbacks.Generic
		): void {
			this._endEvent = this._eventTouchEnd.bind(this);
			this._moveEvent = this._eventTouchMove.bind(this);
			this._startEvent = this._eventTouchStart.bind(this);

			this._startTriggerCallback = onStartCallback;
			this._moveTriggerCallback = onMoveCallback;
			this._endTriggerCallback = onEndCallback;
		}

		/**
		 * Method to add the event listeners to the targetElement, with the expected callbacks
		 *
		 * @protected
		 * @memberof GestureEvent
		 */
		protected setEventListeners(): void {
			if (this._targetElement) {
				this._targetElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._targetElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._targetElement.addEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		/**
		 * Get the targetElement
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof GestureEvent
		 */
		public get targetElement(): HTMLElement {
			return this._targetElement;
		}

		/**
		 * Method to remove the event listeners added to the targetElement and unset the callback
		 *
		 * @memberof GestureEvent
		 */
		public unsetTouchEvents(): void {
			this._removeEventListeners();
			this._unsetCallbacks();
		}

		protected abstract setEvents(...args: Callbacks.Generic[]): void;
	}
}
