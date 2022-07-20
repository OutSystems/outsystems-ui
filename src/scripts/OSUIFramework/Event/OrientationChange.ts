// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * Class that represents the device orientation change
	 *
	 * @export
	 * @class OrientationChange
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class OrientationChange extends Event.AbstractEvent<string> {
		constructor() {
			// ensure window has orientationchange event since it's only available for mobile
			if ('onorientationchange' in window) {
				super();
				window.addEventListener(
					GlobalEnum.HTMLEvent.OrientationChange,
					this._orientationTrigger.bind(this),
					true
				);
			}
		}

		private _orientationTrigger(evt: OrientationChange): void {
			super.trigger(GlobalEnum.HTMLEvent.OrientationChange, evt);
		}
	}
}
