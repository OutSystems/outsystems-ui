// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	export abstract class AbstractDatePickerConfig extends Patterns.AbstractProviderConfiguration {
		public DateFormat: string;
		public DefaultDate: string;
		public InputWidgetId: string;
		public Mode: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
