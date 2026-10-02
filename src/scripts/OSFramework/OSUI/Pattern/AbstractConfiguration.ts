// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns {
	/**
	 * Contains the configurations shared with all patterns.
	 *
	 * @abstract
	 */
	export abstract class AbstractConfiguration {
		public ExtendedClass: string;

		constructor(config: JSON) {
			const source = config as unknown as Record<string, unknown>;
			for (const key in source) {
				if (source[key] !== undefined) {
					(this as unknown as Record<string, unknown>)[key] = this.validateDefault(key, source[key]);
				}
			}
		}

		/**
		 * Method that helps to validate if a boolean is not undefined
		 *
		 * @protected
		 * @param value
		 * @param defaultValue
		 */
		protected validateBoolean(value: boolean | undefined, defaultValue: boolean): boolean {
			return value !== undefined ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is a valid date
		 *
		 * @protected
		 * @param value
		 * @param defaultValue
		 */
		protected validateDate(value: string | Date, defaultValue: string): string | Date {
			return Helper.Dates.IsNull(value) === false ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is within a range of values.
		 *
		 * @protected
		 * @param value
		 * @param defaultValue
		 * @param args
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
		 * @param value
		 * @param defaultValue
		 */
		protected validateNumber(value: number, defaultValue: number): number {
			return typeof value === 'number' ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a string is not empty or undefined.
		 *
		 * @protected
		 * @param value
		 * @param defaultValue
		 */
		protected validateString(value: string | undefined, defaultValue: string): string {
			return value && value.trim() ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is a valid time
		 *
		 * @protected
		 * @param value
		 * @param defaultValue
		 */
		protected validateTime(value: string, defaultValue: string): string {
			return Helper.Times.IsNull(value) === false ? value : defaultValue;
		}

		/**
		 * Method that validates if a given property can be changed.
		 *
		 * @param _isBuilt
		 * @param _key
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validateCanChange(_isBuilt: boolean, _key: string): boolean {
			return true;
		}

		/**
		 * Method that assures that the values being set as configurations respect the defaults.
		 *
		 * @param _key
		 * @param value
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validateDefault(_key: string, value: unknown): unknown {
			return value;
		}
	}
}
