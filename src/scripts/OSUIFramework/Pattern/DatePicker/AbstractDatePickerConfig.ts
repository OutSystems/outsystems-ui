// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	export abstract class AbstractDatePickerConfig extends Patterns.AbstractProviderConfiguration {
		public DefaultDate: string;
		public InputDateFormat: string;
		public InputWidgetId: string;
		public ServerDateFormat: string;
		public Show24HourFormat: boolean;
		public ShowTime: boolean;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
