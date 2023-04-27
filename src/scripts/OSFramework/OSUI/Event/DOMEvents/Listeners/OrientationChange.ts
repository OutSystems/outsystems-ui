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
			super(window, GlobalEnum.HTMLEvent.OrientationChange);
			this.eventCallback = this._orientationTrigger.bind(this);
		}

		private _orientationTrigger(evt: OrientationChange): void {
			this.trigger(GlobalEnum.HTMLEvent.OrientationChange, evt);
		}
	}
}
