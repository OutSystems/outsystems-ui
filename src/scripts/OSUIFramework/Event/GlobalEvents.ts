/*
    Events to be added to Layouts / Body and fire callbacks to patterns:
        - OnClick (To trigger patterns that needs to be close on a body click - Tooltip, Search, MasterDetail, Menu, Submenu)
        - IsRTL (Add the logic of Observers applied on patterns to trigger this event when RTL class is added)
        - OrientationChange (Responsive behavior)

    Maybe in future we can add also:
        - OnLoad
        - OnOnline
        - OnOffline

*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * Class that represents the click on the body event.
	 *
	 * @export
	 * @class BodyOnClick
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class BodyOnClick extends Event.AbstractEvent<string> {
		constructor() {
			super();
			document.body.addEventListener(GlobalEnum.HTMLEvent.Click, this._bodyTrigger.bind(this));
		}
		private _bodyTrigger(evt: PointerEvent): void {
			super.trigger('click', evt);
		}

		/**
		 * Override the default trigger method from AbstractEvent
		 *
		 * @param {string} [data]
		 * @param {*} args
		 * @return {*}  {void}
		 * @memberof BodyOnClick
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public trigger(data?: string, ...args: unknown[]): void {
			return;
		}
	}

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
		private _bodyTrigger(evt: PointerEvent): void {
			super.trigger('scroll', evt);
		}

		/**
		 * Override the default trigger method from AbstractEvent
		 *
		 * @param {string} [data]
		 * @param {*} args
		 * @return {*}  {void}
		 * @memberof BodyOnClick
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public trigger(data?: string, ...args: unknown[]): void {
			return;
		}
	}

	/**
	 * Class that represents the Resize on the Window.
	 *
	 * @export
	 * @class WindowResize
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class WindowResize extends Event.AbstractEvent<string> {
		constructor() {
			super();
			window.addEventListener(GlobalEnum.HTMLEvent.Resize, this._windowTrigger.bind(this), true);
		}
		private _windowTrigger(evt: PointerEvent): void {
			super.trigger(GlobalEnum.HTMLEvent.Resize, evt);
		}

		/**
		 * Override the default trigger method from AbstractEvent
		 *
		 * @param {string} [data]
		 * @param {*} args
		 * @return {*}  {void}
		 * @memberof BodyOnClick
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public trigger(data?: string, ...args: unknown[]): void {
			return;
		}
	}
}
