// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TouchEvents {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TouchEvents extends AbstractPattern<TouchEventsConfig> implements ITouchEvents {
		//Stores the current position
		private _currentX: number;
		private _currentY: number;

		// Stores the touch event with bind(this)
		private _endEvent: Callbacks.Generic;
		//Stores the callback to be triggered
		private _endEventCallback: OSUIFramework.Callbacks.Generic;
		//Stores the callback to be triggered
		private _eventMoveCallback: OSUIFramework.Callbacks.Generic;
		//Stores the callback to be triggered
		private _eventStartCallback: OSUIFramework.Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _moveEvent: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _startEvent: Callbacks.Generic;
		// Stores the moment when the touch began
		private _startTime;
		// Stores the start position
		private _startX: number;
		private _startY: number;
		// Stores the moment when the touch finished.
		private _timeTaken;
		// Controls if we're "touching" the element
		private _touchingElement: boolean;
		// The element to which we have bound this pattern
		private _trackableElement;
		// Stores the touch movement position
		private _translateX;
		private _translateY;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TouchEventsConfig(configs));
			this._startX = 0;
			this._startY = 0;
			this._currentX = 0;
			this._currentY = 0;
			this._touchingElement = false;

			this._endEvent = this._eventTouchEnd.bind(this);
			this._moveEvent = this._eventTouchMove.bind(this);
			this._startEvent = this._eventTouchStart.bind(this);
		}

		//Detects if the "touch" has ended
		private _eventTouchEnd(): void {
			if (this._touchingElement) {
				this._touchingElement = false;
				this._translateX = this._currentX - this._startX;
				this._translateY = this._currentY - this._startY;

				this._timeTaken = new Date().getTime() - this._startTime;

				this._triggerTouchEnd(
					this._currentX,
					this._currentY,
					this._translateX,
					this._translateY,
					this._timeTaken
				);
			}
		}
		// Detects if the "touch" is moving
		private _eventTouchMove(evt: TouchEvent): void {
			if (this._touchingElement) {
				this._currentX = evt.changedTouches[0].pageX;
				this._currentY = evt.changedTouches[0].pageY;
				this._translateX = this._currentX - this._startX;
				this._translateY = this._currentY - this._startY;

				this._triggerTouchMove(this._currentX, this._currentY, this._translateX, this._translateY, evt);
			}
		}
		//Detects if the "touch" has started
		private _eventTouchStart(evt: TouchEvent): void {
			this._startTime = new Date().getTime();
			this._startX = evt.changedTouches[0].pageX;
			this._currentX = this._startX;

			this._startY = evt.changedTouches[0].pageY;
			this._currentY = this._startY;

			this._touchingElement = true;

			this._triggerTouchStart(this._startX, this._startY);
		}

		private _removeEventListeners(): void {
			if (this._trackableElement) {
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		private _setEventListeners(): void {
			this._trackableElement = document.getElementById(this.configs.WidgetId);
			if (this._trackableElement) {
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._startEvent);
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._moveEvent);
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._endEvent);
			}
		}

		// Method that triggers the TouchEnd event on the platform
		private _triggerTouchEnd(x: number, y: number, offsetX: number, offsetY: number, timeTaken: number): void {
			if (this._endEventCallback) {
				Helper.AsyncInvocation(this._endEventCallback, x, y, offsetX, offsetY, timeTaken);
			}
		}

		// Method that triggers the TouchMove event on the platform
		private _triggerTouchMove(x: number, y: number, offsetX: number, offsetY, event: TouchEvent): void {
			if (this._eventMoveCallback) {
				Helper.AsyncInvocation(this._eventMoveCallback, x, y, offsetX, offsetY, event);
			}
		}
		// Method that triggers the TouchStart event on the platform
		private _triggerTouchStart(x: number, y: number): void {
			if (this._eventStartCallback) {
				Helper.AsyncInvocation(this._eventStartCallback, x, y);
			}
		}

		public build(): void {
			super.build();
			this._setEventListeners();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
			this._removeEventListeners();
		}

		public registerCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.TouchEvents.Enum.Events.End:
					this._endEventCallback = callback;
					break;
				case OSUIFramework.Patterns.TouchEvents.Enum.Events.Move:
					this._eventMoveCallback = callback;
					break;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				case OSUIFramework.Patterns.TouchEvents.Enum.Events.Start:
					this._eventStartCallback = callback;
					break;
			}
		}
	}
}
