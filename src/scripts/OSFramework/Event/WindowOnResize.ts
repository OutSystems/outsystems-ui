// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event {
	/**
	 * Class that represents the Resize on the Window.
	 *
	 * @export
	 * @class WindowResize
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class WindowResize extends Event.AbstractEvent<string> {
		private _timeout: number;

		constructor() {
			super();
			window.addEventListener(GlobalEnum.HTMLEvent.Resize, this._windowTrigger.bind(this), true);
		}

		private _windowTrigger(evt: WindowResize): void {
			window.clearTimeout(this._timeout);
			this._timeout = window.setTimeout(() => {
				super.trigger(GlobalEnum.HTMLEvent.Resize, evt);
			}, 100);
		}
	}
}
