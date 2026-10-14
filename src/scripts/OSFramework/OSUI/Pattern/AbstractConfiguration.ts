// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns {
	/**
	 * Contains the configurations shared with all patterns.
	 *
	 * @abstract
	 */
	export abstract class AbstractConfiguration {
		/** CSS classes added to the pattern root. */
		public ExtendedClass: string;

		constructor(config: JSON) {
			const values = config as unknown as Record<string, unknown>;
			for (const key in values) {
				if (values[key] !== undefined) {
					(this as unknown as Record<string, unknown>)[key] = this.validateDefault(key, values[key]);
				}
			}
		}

		/**
		 * Method that helps to validate if a boolean is not undefined
		 *
		 * @protected
		 * @param value Value received in the configs
		 * @param defaultValue Value used when the given one is missing or invalid
		 */
		protected validateBoolean(value: boolean | undefined, defaultValue: boolean): boolean {
			return value !== undefined ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is a valid date
		 *
		 * @protected
		 * @param value Value received in the configs
		 * @param defaultValue Value used when the given one is missing or invalid
		 */
		protected validateDate(value: string | Date, defaultValue: string): string | Date {
			return Helper.Dates.IsNull(value) === false ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is within a range of values.
		 *
		 * @protected
		 * @param value Value received in the configs
		 * @param defaultValue Value used when the given one is missing or invalid
		 * @param args Allowed values
		 */
		protected validateInRange(value: unknown, defaultValue: unknown, ...args: unknown[]): unknown {
			if (value) {
				if (args.length > 0) {
					const allowedValues: unknown[] = args.length > 1 ? args : (args[0] as unknown[]);
					if (allowedValues.includes(value)) {
						return value;
					}
				}
			}

			return defaultValue;
		}

		/**
		 * Method that helps to validate if a number is not empty or undefined.
		 *
		 * @protected
		 * @param value Value received in the configs
		 * @param defaultValue Value used when the given one is missing or invalid
		 */
		protected validateNumber(value: number, defaultValue: number): number {
			return typeof value === 'number' ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a string is not empty or undefined.
		 *
		 * @protected
		 * @param value Value received in the configs
		 * @param defaultValue Value used when the given one is missing or invalid
		 */
		protected validateString(value: string | undefined, defaultValue: string): string {
			return value && value.trim() ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is a valid time
		 *
		 * @protected
		 * @param value Value received in the configs
		 * @param defaultValue Value used when the given one is missing or invalid
		 */
		protected validateTime(value: string, defaultValue: string): string {
			return Helper.Times.IsNull(value) === false ? value : defaultValue;
		}

		/**
		 * Method that validates if a given property can be changed.
		 *
		 * @param _isBuilt True when the pattern has already been built
		 * @param _key Name of the configuration property
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validateCanChange(_isBuilt: boolean, _key: string): boolean {
			return true;
		}

		/**
		 * Method that assures that the values being set as configurations respect the defaults.
		 *
		 * @param _key Name of the configuration property
		 * @param value Value received in the configs
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validateDefault(_key: string, value: unknown): unknown {
			return value;
		}
	}
}
