// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	/**
	 * Class that represents the scroll on the body event.
	 *
	 * @export
	 * @class BodyOnScroll
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class BodyOnScroll extends Event.AbstractEvent<string> {
		constructor() {
			super();
			document.body.addEventListener(GlobalEnum.HTMLEvent.Scroll, this._bodyTrigger.bind(this), true);
		}

		private _bodyTrigger(evt: Event): void {
			this.trigger(GlobalEnum.HTMLEvent.Scroll, evt);
		}
	}
}
