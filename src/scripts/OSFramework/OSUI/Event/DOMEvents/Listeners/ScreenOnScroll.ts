// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the scroll on the active screen element.
	 *
	 * @export
	 * @class ScreenOnScroll
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class ScreenOnScroll extends AbstractListener<string> {
		constructor() {
			super( Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.ActiveScreen), GlobalEnum.HTMLEvent.Scroll);
			this.eventCallback = this._screenTrigger.bind(this);
		}

		// Method to act as callback for the added event and trigger all handlers stored
		private _screenTrigger(evt: Event): void {
			this.trigger(GlobalEnum.HTMLEvent.Scroll, evt);
		}
	}
}
