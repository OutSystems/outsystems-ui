// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TouchEvents {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TouchEvents extends AbstractPattern<TouchEventsConfig> implements ITouchEvents {
		private _currentX: number;
		private _currentY: number;
		private _doPreventDefault: boolean;
		private _isBound: boolean;
		private _startTime;
		private _startX: number;
		private _startY: number;
		private _timeTaken;
		private _touchingElement: boolean;
		private _trackableElement;
		private _translateX;
		private _translateY;

		private _eventEndCallback: OSUIFramework.Callbacks.Generic;
		private _eventEnd: any;
		private _eventMoveCallback: OSUIFramework.Callbacks.Generic;
		private _eventMove: any;
		private _eventStartCallback: OSUIFramework.Callbacks.Generic;
		private _eventStart: any;

		constructor(uniqueId: string, configs: unknown) {
			super(uniqueId, new TouchEventsConfig(configs));
			this._startX = 0;
			this._startY = 0;
			this._currentX = 0;
			this._currentY = 0;
			this._touchingElement = false;
			this._doPreventDefault = false;

			this._eventEnd = this._eventTouchEnd.bind(this);
			this._eventMove = this._eventTouchMove.bind(this);
			this._eventStart = this._eventTouchStart.bind(this);
		}

		private _eventTouchStart(evt): void {
			this._startTime = new Date().getTime();
			this._startX = evt.changedTouches[0].pageX;
			this._currentX = this._startX;

			this._startY = evt.changedTouches[0].pageY;
			this._currentY = this._startY;

			this._touchingElement = true;

			this._triggerTouchStart(this._startX, this._startY);
		}

		private _eventTouchMove(evt): void {
			if (this._touchingElement) {
				this._currentX = evt.changedTouches[0].pageX;
				this._currentY = evt.changedTouches[0].pageY;
				this._translateX = this._currentX - this._startX;
				this._translateY = this._currentY - this._startY;

				this._triggerTouchMove(this._currentX, this._currentY, this._translateX, this._translateY, evt);
			}
		}

		private _eventTouchEnd(evt): void {
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

		private _setEventListeners(): void {
			this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._eventStart);
			this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._eventMove);
			this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._eventEnd);
		}

		private _removeEventListeners(): void {
			this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._eventStart);
			this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._eventMove);
			this._trackableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchEnd, this._eventEnd);
		}

		// Method that triggers the TouchEnd event on the platform
		private _triggerTouchEnd(x: number, y: number, offsetX: number, offsetY: number, timeTaken: number): void {
			if (this._eventEndCallback) {
				Helper.AsyncInvocation(this._eventEndCallback, x, y, offsetX, offsetY, timeTaken);
			}
		}

		// Method that triggers the TouchMove event on the platform
		private _triggerTouchMove(x: number, y: number, offsetX: number, offsetY, event: any): void {
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

		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.TouchEvents.Enum.Events.End:
					this._eventEndCallback = callback;
					break;
				case OSUIFramework.Patterns.TouchEvents.Enum.Events.Move:
					this._eventMoveCallback = callback;
					break;
				case OSUIFramework.Patterns.TouchEvents.Enum.Events.Start:
					this._eventStartCallback = callback;
					break;
			}
		}
	}
}
