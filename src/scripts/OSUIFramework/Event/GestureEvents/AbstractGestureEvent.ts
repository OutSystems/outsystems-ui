// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class GestureEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export abstract class GestureEvent implements IGestureEvent {
		// Stores the touch event with bind(this)
		private _endEvent: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _moveEvent: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _startEvent: Callbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _endTriggerCallback: Callbacks.Generic;
		private _moveTriggerCallback: Callbacks.Generic;
		private _startTriggerCallback: Callbacks.Generic;
		private _trackableElement;

		// eslint-disable-next-line @typescript-eslint/member-ordering
		public readonly _gestureParams = {
			CurrentX: 0,
			CurrentY: 0,
			StartTime: 0,
			StartX: 0,
			StartY: 0,
			TimeTaken: 0,
			TouchingElement: false,
			OffsetX: 0,
			OffsetY: 0,
			Event: TouchEvent,
		};

		constructor(
			target: HTMLElement,
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback: Callbacks.Generic
		) {
			this.setTouchEvents(target, onStartCallback, onMoveCallback, onEndCallback);
		}

		private _eventTouchEnd(): void {
			if (this._gestureParams.TouchingElement) {
				this._gestureParams.TouchingElement = false;
				this._gestureParams.OffsetX = this._gestureParams.CurrentX - this._gestureParams.StartX;
				this._gestureParams.OffsetY = this._gestureParams.CurrentY - this._gestureParams.StartY;
				this._gestureParams.TimeTaken = new Date().getTime() - this._gestureParams.StartTime;
				this._endTriggerCallback();
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
				this._moveTriggerCallback();
			}
		}

		private _eventTouchStart(evt: TouchEvent): void {
			this._gestureParams.StartTime = new Date().getTime();
			this._gestureParams.StartX = evt.changedTouches[0].pageX;
			this._gestureParams.CurrentX = this._gestureParams.StartX;
			this._gestureParams.StartY = evt.changedTouches[0].pageY;
			this._gestureParams.CurrentY = this._gestureParams.StartY;
			this._gestureParams.TouchingElement = true;
			this._startTriggerCallback();
		}

		protected setCallbacks(
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback: Callbacks.Generic
		): void {
			this._endEvent = this._eventTouchEnd.bind(this);
			this._moveEvent = this._eventTouchMove.bind(this);
			this._startEvent = this._eventTouchStart.bind(this);

			this._startTriggerCallback = onStartCallback;
			this._moveTriggerCallback = onMoveCallback;
			this._endTriggerCallback = onEndCallback;

			this.setEventListeners();
		}

		public removeEventListeners(): void {
			if (this._trackableElement) {
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		public setEventListeners(): void {
			if (this._trackableElement) {
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		public setTouchEvents(
			targetElement: HTMLElement,
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback: Callbacks.Generic
		): void {
			this._trackableElement = targetElement;
			this.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
		}
	}
}
