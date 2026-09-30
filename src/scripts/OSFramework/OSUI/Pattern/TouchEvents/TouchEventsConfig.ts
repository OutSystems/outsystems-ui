// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TouchEvents {
	export class TouchEventsConfig extends AbstractConfiguration {
		/** Id of the element that receives the touch listeners. */
		public WidgetId: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
