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
			super.trigger(GlobalEnum.HTMLEvent.Click, evt);
		}
	}
}
