/*
    Events to be added to Layouts / Body and fire callbacks to patterns:
        - OnClick (To trigger patterns that needs to be close on a body click - Tooltip, Search, MasterDetail, Menu, Submenu)
        - IsRTL (Add the logic of Observers applied on patterns to trigger this event when RTL class is added)
        - OnResize
        - OrientationChange (Responsive behavior)

    Maybe in future we can add also:
        - OnLoad
        - OnScroll
        - OnOnline
        - OnOffline

*/
namespace OSUIFramework.Event {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export class BodyOnClick extends OSUIFramework.Event.AbstractEvent<string> {
		constructor() {
			super();
			document.body.addEventListener(GlobalEnum.HTMLEvent.Click, this._bodyTrigger.bind(this));
		}
		private _bodyTrigger(evt: PointerEvent): void {
			super.trigger('click', evt);
		}
		// Override the default trigger method from AbstractEvent
		// eslint-disable-next-line  @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
		public trigger(data?: string, ...args): void {
			return;
		}
	}
}
