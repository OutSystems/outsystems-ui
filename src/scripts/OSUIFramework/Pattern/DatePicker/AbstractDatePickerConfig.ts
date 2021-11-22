// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	export abstract class AbstractDatePickerConfig extends Patterns.AbstractProviderConfiguration {
		public DateFormat: string;
		public FirstWeekDay: number;
		public MaxDate: string;
		public MinDate: string;
		public ShowMonths: boolean;
		public ShowTodayButton: boolean;
		public ShowWeekNumbers: boolean;
		public TimeFormat: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
