// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DatePicker {
	export abstract class AbstractDatePickerConfig extends Patterns.AbstractProviderConfiguration {
		// Display format of the selected date (e.g. DD/MM/YYYY); empty uses the server date format.
		public DateFormat: string;
		// First day of the week in the calendar (0 = Sunday … 6 = Saturday).
		public FirstWeekDay: number;
		// Latest selectable date; empty for no upper limit.
		public MaxDate: string;
		// Earliest selectable date; empty for no lower limit.
		public MinDate: string;
		// Renders a Today button in the calendar footer.
		public ShowTodayButton: boolean;
		// Shows the week-number column in the calendar.
		public ShowWeekNumbers: boolean;
		// Time selection appended to the calendar: disabled (date only), 12 or 24 (hour format).
		public TimeFormat: string;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.DatePicker.AbstractDatePickerConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.DateFormat:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					validatedValue = this.validateString(value as string, Helper.Dates.ServerFormat);
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
