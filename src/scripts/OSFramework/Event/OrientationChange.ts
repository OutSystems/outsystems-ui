// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	/**
	 * Class that represents the device orientation change
	 *
	 * @export
	 * @class OrientationChange
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class OrientationChange extends Event.AbstractEvent<string> {
		constructor() {
			super();
			window.addEventListener(GlobalEnum.HTMLEvent.OrientationChange, this._orientationTrigger.bind(this), true);
		}

		private _orientationTrigger(evt: OrientationChange): void {
			super.trigger(GlobalEnum.HTMLEvent.OrientationChange, evt);
		}
	}
}
