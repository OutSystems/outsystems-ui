// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the scroll on the body event.
	 *
	 * @export
	 * @class BodyOnScroll
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class BodyOnScroll extends AbstractListener<string> {
		constructor() {
			super(document.body, GlobalEnum.HTMLEvent.Scroll);
			// Ensure capture is being set in order Event can be "listened" to the element where it has been set.
			this.useCapture = true;
			this.eventCallback = this._bodyTrigger.bind(this);
		}

		// Method to act as callback for the added event and trigger all handlers stored
		private _bodyTrigger(evt: Event): void {
			this.trigger(GlobalEnum.HTMLEvent.Scroll, evt);
		}
	}
}
