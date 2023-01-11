// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TimePicker {
	export abstract class AbstractTimePickerConfig extends Patterns.AbstractProviderConfiguration {
		public FirstWeekDay: number;
		public InitialTime: string;
		public Is24Hours: boolean;
		public MaxTime: string;
		public MinTime: string;
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
		 * @memberof  OSFramework.Patterns.TimePicker.AbstractTimePickerConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.Is24Hours:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					validatedValue = this.validateBoolean(value as boolean, true);
					break;
				case Enum.Properties.InitialTime:
				case Enum.Properties.MaxTime:
				case Enum.Properties.MinTime:
					validatedValue = this.validateTime(value as string, undefined);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
