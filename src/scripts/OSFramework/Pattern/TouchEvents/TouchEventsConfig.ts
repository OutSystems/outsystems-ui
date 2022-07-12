// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.TouchEvents {
	export class TouchEventsConfig extends AbstractConfiguration {
		public WidgetId: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
