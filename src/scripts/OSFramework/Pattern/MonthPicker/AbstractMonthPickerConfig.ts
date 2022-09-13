// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.MonthPicker {
	/**
	 * Class that represents the custom configurations received by the MonthPicker.
	 *
	 * @export
	 * @class MonthPickerConfig
	 * @extends {AbstractProviderConfiguration}
	 */
	export abstract class AbstractMonthPickerConfig extends Patterns.AbstractProviderConfiguration {
		public DateFormat: string;
		public InitialMonth: string;
		public MaxMonth: string;
		public MinMonth: string;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof AbstractMonthPickerConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.DateFormat:
					validatedValue = this.validateString(value as string, 'm.y');
					break;
				case Enum.Properties.InitialMonth:
				case Enum.Properties.MinMonth:
				case Enum.Properties.MaxMonth:
					validatedValue = this.validateInRange(value as MonthYear, undefined);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
