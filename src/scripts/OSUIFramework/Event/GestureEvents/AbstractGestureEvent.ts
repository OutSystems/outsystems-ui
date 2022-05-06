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
		protected moveEvent: Callbacks.Generic;
		// Stores the touch event with bind(this)
		protected startEvent: Callbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _endTriggerCallback: Callbacks.Generic;
		private _moveTriggerCallback: Callbacks.Generic;
		private _startTriggerCallback: Callbacks.Generic;
		protected trackableElement;

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
			this.trackableElement = target;
		}

		private _removeEventListeners(): void {
			if (this.trackableElement) {
				this.trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this.startEvent);
				this.trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this.moveEvent);
				this.trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		private _unsetCallbacks(): void {
			this._endEvent = undefined;
			this.moveEvent = undefined;
			this.startEvent = undefined;

			this._startTriggerCallback = undefined;
			this._moveTriggerCallback = undefined;
			this._endTriggerCallback = undefined;
		}

		protected eventTouchEnd(): void {
			if (this._gestureParams.TouchingElement) {
				this._gestureParams.TouchingElement = false;
				this._gestureParams.OffsetX = this._gestureParams.CurrentX - this._gestureParams.StartX;
				this._gestureParams.OffsetY = this._gestureParams.CurrentY - this._gestureParams.StartY;
				this._gestureParams.TimeTaken = new Date().getTime() - this._gestureParams.StartTime;
				this._endTriggerCallback(
					this._gestureParams.OffsetX,
					this._gestureParams.OffsetY,
					this._gestureParams.TimeTaken
				);
			}
		}

		protected eventTouchMove(evt: TouchEvent): void {
			if (this._gestureParams.TouchingElement) {
				this._gestureParams.CurrentX = evt.changedTouches[0].pageX;
				this._gestureParams.CurrentY = evt.changedTouches[0].pageY;
				this._gestureParams.OffsetX = this._gestureParams.CurrentX - this._gestureParams.StartX;
				this._gestureParams.OffsetY = this._gestureParams.CurrentY - this._gestureParams.StartY;
				// Prevent scrolling the page while doing gesture
				evt.preventDefault();
				this._moveTriggerCallback(
					this._gestureParams.CurrentX,
					this._gestureParams.CurrentY,
					this._gestureParams.OffsetX,
					this._gestureParams.OffsetY,
					this._gestureParams.Event
				);
			}
		}

		protected eventTouchStart(evt: TouchEvent): void {
			this._gestureParams.StartTime = new Date().getTime();
			this._gestureParams.StartX = evt.changedTouches[0].pageX;
			this._gestureParams.CurrentX = this._gestureParams.StartX;
			this._gestureParams.StartY = evt.changedTouches[0].pageY;
			this._gestureParams.CurrentY = this._gestureParams.StartY;
			this._gestureParams.TouchingElement = true;
			this._gestureParams.Event = evt;
			this._startTriggerCallback(this._gestureParams.StartX, this._gestureParams.StartY);
		}

		protected setCallbacks(
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback?: Callbacks.Generic
		): void {
			this._endEvent = this.eventTouchEnd.bind(this);
			this.moveEvent = this.eventTouchMove.bind(this);
			this.startEvent = this.eventTouchStart.bind(this);

			this._startTriggerCallback = onStartCallback;
			this._moveTriggerCallback = onMoveCallback;
			this._endTriggerCallback = onEndCallback;
		}

		protected setEventListeners(): void {
			if (this.trackableElement) {
				this.trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this.startEvent);
				this.trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this.moveEvent);
				this.trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		public setTouchEvents(
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback?: Callbacks.Generic
		): void {
			this.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
			this.setEventListeners();
		}

		public unsetTouchEvents(): void {
			this._removeEventListeners();
			this._unsetCallbacks();
		}
	}
}
