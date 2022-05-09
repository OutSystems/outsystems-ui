// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker {
	export abstract class AbstractDatePickerConfig extends Patterns.AbstractProviderConfiguration {
		public DateFormat: string;
		public FirstWeekDay: number;
		public MaxDate: string;
		public MinDate: string;
		public ShowTodayButton: boolean;
		public ShowWeekNumbers: boolean;
		public TimeFormat: string;

		constructor(config: JSON) {
			super(config);
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.DateFormat:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					validatedValue = this.validateString(value as string, OSUIFramework.Helper.Dates.ServerFormat);
					break;
				case Enum.Properties.FirstWeekDay:
					validatedValue = this.validateNumber(value as number, 0);
					break;
				case Enum.Properties.MaxDate:
					validatedValue = this.validateDate(value as string, undefined);
					break;
				case Enum.Properties.MinDate:
					validatedValue = this.validateDate(value as string, undefined);
					break;
				case Enum.Properties.ShowTodayButton:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.TimeFormat:
					validatedValue = this.validateString(value as string, Enum.TimeFormatMode.Disable);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
