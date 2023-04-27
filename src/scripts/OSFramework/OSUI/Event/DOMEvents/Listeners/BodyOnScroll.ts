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
			super();
			this.addEvent();
		}

		private _bodyTrigger(evt: Event): void {
			this.trigger(GlobalEnum.HTMLEvent.Scroll, evt);
		}

		protected addEvent(): void {
			document.body.addEventListener(GlobalEnum.HTMLEvent.Scroll, this._bodyTrigger.bind(this), true);
		}

		protected removeEvent(): void {
			document.body.removeEventListener(GlobalEnum.HTMLEvent.Scroll, this._bodyTrigger.bind(this), true);
		}
	}
}
