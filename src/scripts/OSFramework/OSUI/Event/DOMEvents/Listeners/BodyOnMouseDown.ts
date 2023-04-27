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
			super();
			this.addEvent();
		}

		private _bodyTrigger(evt: PointerEvent): void {
			this.trigger(GlobalEnum.HTMLEvent.MouseDown, evt);
		}

		protected addEvent(): void {
			document.body.addEventListener(GlobalEnum.HTMLEvent.MouseDown, this._bodyTrigger.bind(this));
		}

		protected removeEvent(): void {
			document.body.removeEventListener(GlobalEnum.HTMLEvent.MouseDown, this._bodyTrigger.bind(this));
		}
	}
}
