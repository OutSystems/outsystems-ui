// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the mousedown on the body event.
	 *
	 * @export
	 * @class BodyOnMouseDown
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class BodyOnMouseDown extends AbstractListener<string> {
		constructor() {
			super(document.body, GlobalEnum.HTMLEvent.MouseDown);
			this.eventCallback = this._bodyTrigger.bind(this);
		}

		private _bodyTrigger(evt: PointerEvent): void {
			this.trigger(GlobalEnum.HTMLEvent.MouseDown, evt);
		}
	}
}
