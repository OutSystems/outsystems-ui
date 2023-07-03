// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the Resize on the Window.
	 *
	 * @export
	 * @class WindowResize
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class WindowResize extends AbstractListener<string> {
		private _timeout: number;

		constructor() {
			super(window, GlobalEnum.HTMLEvent.Resize);
			this.eventCallback = this._windowTrigger.bind(this);
		}

		// Method to act as callback for the added event and trigger all handlers stored
		private _windowTrigger(evt: WindowResize): void {
			window.clearTimeout(this._timeout);
			this._timeout = window.setTimeout(() => {
				this.trigger(GlobalEnum.HTMLEvent.Resize, evt);
			}, 100);
		}
	}
}
