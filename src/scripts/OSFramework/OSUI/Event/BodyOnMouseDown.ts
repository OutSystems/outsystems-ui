// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event {
	/**
	 * Class that represents the mousedown on the body event.
	 *
	 * @export
	 * @class BodyOnMouseDown
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class BodyOnMouseDown extends Event.AbstractEvent<string> {
		constructor() {
			super();
			document.body.addEventListener(GlobalEnum.HTMLEvent.MouseDown, this._bodyTrigger.bind(this));
		}

		private _bodyTrigger(evt: PointerEvent): void {
			this.trigger(GlobalEnum.HTMLEvent.MouseDown, evt);
		}
	}
}
