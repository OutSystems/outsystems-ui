// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SwipeEvents {
	export class SwipeEventsConfig extends AbstractConfiguration {
		// Id of the element that receives the swipe gesture listeners.
		public WidgetId: string;
		constructor(config: JSON) {
			super(config);
		}
	}
}
