// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the click on the body event.
	 *
	 * @export
	 * @class BodyOnClick
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class BodyOnClick extends AbstractListener<string> {
		private _enableBodyClick = true;

		constructor() {
			super(document.body, GlobalEnum.HTMLEvent.Click);
			this.eventCallback = this._bodyTrigger.bind(this);
		}

		private _bodyTrigger(evt: PointerEvent): void {
			// Trigger the body click event only if the getBodyClickStatus is True
			if (this.getBodyClickStatus) {
				this.trigger(GlobalEnum.HTMLEvent.Click, evt);
			}
		}

		/**
		 * This method is to disable the body click on detached patterns
		 *
		 * @memberof BodyOnClick
		 */
		public disableBodyClickEvent(): void {
			this._enableBodyClick = false;
		}

		/**
		 * This method is to enable the body click on detached patterns
		 *
		 * @memberof BodyOnClick
		 */
		public enableBodyClickEvent(): void {
			this._enableBodyClick = true;
		}

		/**
		 * Getter that returns the body click status
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof BodyOnClick
		 */
		public get getBodyClickStatus(): boolean {
			return this._enableBodyClick;
		}
	}
}
