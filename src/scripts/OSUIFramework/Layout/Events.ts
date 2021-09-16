/*
    Possible events to be added to Layouts and fire callbacks to patters:
        - OnClick (To trigger patterns that needs to be close on a body click - Tooltip)
        - IsRTL (Add the logic of Observers applied on patterns to trigger this event when RTL class is added)
        - OnResize
        - OrientationChange
    
	export class OnRtlApplied extends OSUIFramework.Event.AbstractEvent<string> {}
	export class WindowOnResize extends OSUIFramework.Event.AbstractEvent<string> {}
	export class WindowOnOrientationChange extends OSUIFramework.Event.AbstractEvent<string> {}

    Maybe in future we can add also
        - OnLoad
        - OnScroll
        - OnOnline
        - OnOffline

*/
namespace OSUIFramework.Layout {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export class BodyOnClick extends OSUIFramework.Event.AbstractEvent<string> {
		constructor() {
			super();
			document.body.addEventListener(GlobalEnum.HTMLEvent.Click, this._bodyTrigger.bind(this));
		}
		private _bodyTrigger(): void {
			super.trigger();
		}
		// eslint-disable-next-line  @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
		public trigger(data?: string, ...args): void {
			return;
		}
	}
}
