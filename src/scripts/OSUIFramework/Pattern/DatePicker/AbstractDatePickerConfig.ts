// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	export abstract class AbstractDatePickerConfig extends Patterns.AbstractProviderConfiguration {
		public InitalDate: string;
		public InputDateFormat: string;
		public InputWidgetId: string;
		public ServerDateFormat: string;
		public ShowTodayButton: boolean;
		public TimeFormat: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
