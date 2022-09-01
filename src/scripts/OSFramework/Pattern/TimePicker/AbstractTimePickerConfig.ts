// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.TimePicker {
	export abstract class AbstractTimePickerConfig extends Patterns.AbstractProviderConfiguration {
		public FirstWeekDay: number;
		public InitialTime: string;
		public Is24Hours: boolean;
		public MaxTime: string;
		public MinTime: string;

		constructor(config: JSON) {
			super(config);
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.Is24Hours:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					validatedValue = this.validateBoolean(value as boolean, true);
					break;
				case Enum.Properties.MaxTime:
					validatedValue = this.validateDate(value as string, undefined);
					break;
				case Enum.Properties.MinTime:
					validatedValue = this.validateDate(value as string, undefined);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
