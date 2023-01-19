// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	/**
	 * Class that represents the Post Message on the Window.
	 *
	 * @export
	 * @class WindowMessage
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class WindowMessage extends Event.AbstractEvent<string> {
		constructor() {
			super();
			if (window.self !== window.top) {
				window.addEventListener(GlobalEnum.HTMLEvent.Message, this._windowTrigger.bind(this), true);
			}
		}

		private _windowTrigger(evt: MessageEvent): void {
			this.trigger(Event.Type.WindowMessage, evt);
		}
	}
}
