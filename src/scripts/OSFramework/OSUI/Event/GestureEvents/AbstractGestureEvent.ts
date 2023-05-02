// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event {
	/**
	 * Class that represents the gesture events information between start, move and end.
	 *
	 * @class GestureParams
	 */
	class GestureParams {
		public currentX: number;
		public currentY: number;
		public event: TouchEvent;
		public offsetX: number;
		public offsetY: number;
		public startTime: number;
		public startX: number;
		public startY: number;
		public timeTaken: number;
		public touchingElement: boolean;
	}

	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class GestureEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export abstract class AbstractGestureEvent implements GestureEvent.IGestureEvent {
		// Stores the end touch event with bind(this)
		private _endEvent: GlobalCallbacks.Generic;
		private _endTriggerCallback: GlobalCallbacks.Generic;
		// Holds all the neccessary values on the start, move, end events lifecycle
		private _gestureParams: GestureParams;
		// Stores the move touch event with bind(this)
		private _moveEvent: GlobalCallbacks.Generic;
		private _moveTriggerCallback: GlobalCallbacks.Generic;
		// Stores the start touch event with bind(this)
		private _startEvent: GlobalCallbacks.Generic;
		private _startTriggerCallback: GlobalCallbacks.Generic;
		// Store the target element that receives the lsiteners
		private _targetElement: HTMLElement;

		constructor(target: HTMLElement) {
			this._targetElement = target;
			this._gestureParams = new GestureParams();
		}

		// Callback method for the ontouchend event, that triggers the passed callback to the target
		private _eventTouchEnd(): void {
			if (this._gestureParams.touchingElement) {
				this._gestureParams.touchingElement = false;
				this._gestureParams.offsetX = this._gestureParams.currentX - this._gestureParams.startX;
				this._gestureParams.offsetY = this._gestureParams.currentY - this._gestureParams.startY;
				this._gestureParams.timeTaken = new Date().getTime() - this._gestureParams.startTime;

				if (this._endTriggerCallback) {
					this._endTriggerCallback(
						this._gestureParams.offsetX,
						this._gestureParams.offsetY,
						this._gestureParams.timeTaken
					);
				}
			}
		}

		// Callback method for the ontouchmove event, that triggers the passed callback to the target
		private _eventTouchMove(evt: TouchEvent): void {
			if (this._gestureParams.touchingElement) {
				this._gestureParams.currentX = evt.changedTouches[0].pageX;
				this._gestureParams.currentY = evt.changedTouches[0].pageY;
				this._gestureParams.offsetX = this._gestureParams.currentX - this._gestureParams.startX;
				this._gestureParams.offsetY = this._gestureParams.currentY - this._gestureParams.startY;

				if (this._moveTriggerCallback !== undefined) {
					this._moveTriggerCallback(
						this._gestureParams.currentX,
						this._gestureParams.currentY,
						this._gestureParams.offsetX,
						this._gestureParams.offsetY,
						this._gestureParams.event
					);
				}
			}
		}

		// Callback method for the ontouchstart event, that triggers the passed callback to the target
		private _eventTouchStart(evt: TouchEvent): void {
			this._gestureParams.startTime = new Date().getTime();
			this._gestureParams.startX = evt.changedTouches[0].pageX;
			this._gestureParams.currentX = this._gestureParams.startX;
			this._gestureParams.startY = evt.changedTouches[0].pageY;
			this._gestureParams.currentY = this._gestureParams.startY;
			this._gestureParams.touchingElement = true;
			this._gestureParams.event = evt;
			if (this._startTriggerCallback !== undefined) {
				this._startTriggerCallback(this._gestureParams.startX, this._gestureParams.startY);
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
		 * @param {GlobalCallbacks.Generic} [onStartCallback]
		 * @param {GlobalCallbacks.Generic} [onMoveCallback]
		 * @param {GlobalCallbacks.Generic} [onEndCallback]
		 * @memberof OSFramework.Event.GestureEvent.AbstractGestureEvent
		 */
		protected setCallbacks(
			onStartCallback?: GlobalCallbacks.Generic,
			onMoveCallback?: GlobalCallbacks.Generic,
			onEndCallback?: GlobalCallbacks.Generic
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
		 * @memberof OSFramework.Event.GestureEvent.AbstractGestureEvent
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
		 * @memberof OSFramework.Event.GestureEvent.AbstractGestureEvent
		 */
		public get targetElement(): HTMLElement {
			return this._targetElement;
		}

		/**
		 * Method to remove the event listeners added to the targetElement and unset the callback
		 *
		 * @memberof OSFramework.Event.GestureEvent.AbstractGestureEvent
		 */
		public unsetTouchEvents(): void {
			this._removeEventListeners();
			this._unsetCallbacks();
		}

		protected abstract setSwipeEvents(...args: GlobalCallbacks.Generic[]): void;
	}
}
