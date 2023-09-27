// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Class that represents the BalloonOnToggle custom event
	 *
	 * @export
	 * @class BalloonOnToggle
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class BalloonOnToggle extends AbstractListener<string> {
		constructor() {
			super(document, GlobalEnum.CustomEvent.BalloonOnToggle, true);
			this.eventCallback = this._onToggleTrigger.bind(this);
		}

		// Method to act as callback for the added event and trigger all handlers stored
		private _onToggleTrigger(evt: CustomEvent): void {
			this.trigger(GlobalEnum.CustomEvent.BalloonOnToggle, evt);
		}
	}
}
