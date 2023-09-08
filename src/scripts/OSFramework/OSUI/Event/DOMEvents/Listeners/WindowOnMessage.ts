// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the Post Message on the Window.
	 *
	 * @export
	 * @class WindowMessage
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class WindowMessage extends AbstractListener<string> {
		constructor() {
			super(window, GlobalEnum.HTMLEvent.Message);
		}

		private _windowTrigger(evt: MessageEvent): void {
			this.trigger(GlobalEnum.HTMLEvent.Message, evt);
		}
	}
}
