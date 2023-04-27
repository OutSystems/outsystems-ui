// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the device orientation change
	 *
	 * @export
	 * @class OrientationChange
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class OrientationChange extends AbstractListener<string> {
		constructor() {
			super();
			this.addEvent();
		}

		private _orientationTrigger(evt: OrientationChange): void {
			this.trigger(GlobalEnum.HTMLEvent.OrientationChange, evt);
		}

		protected addEvent(): void {
			// ensure window has orientationchange event since it's only available for mobile
			if ('onorientationchange' in window) {
				window.addEventListener(
					GlobalEnum.HTMLEvent.OrientationChange,
					this._orientationTrigger.bind(this),
					true
				);
			}
		}

		protected removeEvent(): void {
			// ensure window has orientationchange event since it's only available for mobile
			if ('onorientationchange' in window) {
				window.removeEventListener(
					GlobalEnum.HTMLEvent.OrientationChange,
					this._orientationTrigger.bind(this),
					true
				);
			}
		}
	}
}
