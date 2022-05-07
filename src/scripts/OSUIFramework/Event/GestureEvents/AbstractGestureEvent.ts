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
		// Stores the touch event with bind(this)
		private _endEvent: Callbacks.Generic;
		private _endTriggerCallback: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _moveEvent: Callbacks.Generic;
		private _moveTriggerCallback: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _startEvent: Callbacks.Generic;
		private _startTriggerCallback: Callbacks.Generic;
		private _targetElement: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/member-ordering
		protected readonly _gestureParams = {
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

		private _eventTouchEnd(): void {
			if (this._gestureParams.TouchingElement) {
				this._gestureParams.TouchingElement = false;
				this._gestureParams.OffsetX = this._gestureParams.CurrentX - this._gestureParams.StartX;
				this._gestureParams.OffsetY = this._gestureParams.CurrentY - this._gestureParams.StartY;
				this._gestureParams.TimeTaken = new Date().getTime() - this._gestureParams.StartTime;

				if (this._endTriggerCallback) {
					this._endTriggerCallback(
						this._gestureParams.OffsetX,
						this._gestureParams.OffsetY,
						this._gestureParams.TimeTaken
					);
				}
			}
		}

		private _eventTouchMove(evt: TouchEvent): void {
			if (this._gestureParams.TouchingElement) {
				this._gestureParams.CurrentX = evt.changedTouches[0].pageX;
				this._gestureParams.CurrentY = evt.changedTouches[0].pageY;
				this._gestureParams.OffsetX = this._gestureParams.CurrentX - this._gestureParams.StartX;
				this._gestureParams.OffsetY = this._gestureParams.CurrentY - this._gestureParams.StartY;
				// Prevent scrolling the page while doing gesture
				evt.preventDefault();
				if (this._moveTriggerCallback !== undefined) {
					this._moveTriggerCallback(
						this._gestureParams.CurrentX,
						this._gestureParams.CurrentY,
						this._gestureParams.OffsetX,
						this._gestureParams.OffsetY,
						this._gestureParams.Event
					);
				}
			}
		}

		private _eventTouchStart(evt: TouchEvent): void {
			this._gestureParams.StartTime = new Date().getTime();
			this._gestureParams.StartX = evt.changedTouches[0].pageX;
			this._gestureParams.CurrentX = this._gestureParams.StartX;
			this._gestureParams.StartY = evt.changedTouches[0].pageY;
			this._gestureParams.CurrentY = this._gestureParams.StartY;
			this._gestureParams.TouchingElement = true;
			this._gestureParams.Event = evt;
			if (this._startTriggerCallback !== undefined) {
				this._startTriggerCallback(this._gestureParams.StartX, this._gestureParams.StartY);
			}
		}

		private _removeEventListeners(): void {
			if (this._targetElement) {
				this._targetElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._targetElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._targetElement.removeEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		private _unsetCallbacks(): void {
			this._endEvent = undefined;
			this._moveEvent = undefined;
			this._startEvent = undefined;

			this._startTriggerCallback = undefined;
			this._moveTriggerCallback = undefined;
			this._endTriggerCallback = undefined;
		}

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

		protected setEventListeners(): void {
			if (this._targetElement) {
				this._targetElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._targetElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._targetElement.addEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		public get targetElement(): HTMLElement {
			return this._targetElement;
		}

		public unsetTouchEvents(): void {
			this._removeEventListeners();
			this._unsetCallbacks();
		}

		protected abstract setEvents(...args: Callbacks.Generic[]): void;
	}
}
