// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns {
	/**
	 * Contains the configurations shared with all patterns.
	 *
	 * @export
	 * @abstract
	 * @class AbstractConfiguration
	 */
	export abstract class AbstractConfiguration {
		public ExtendedClass: string;

		constructor(config: JSON) {
			for (const key in config) {
				if (config[key] !== undefined) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					this[key] = this.validateDefault(key, config[key]) as any;
				}
			}
		}

		/**
		 * Method that helps to validate if a boolean is not undefined
		 *
		 * @protected
		 * @param {(boolean | undefined)} value
		 * @param {boolean} defaultValue
		 * @return {*}  {boolean}
		 * @memberof AbstractConfiguration
		 */
		protected validateBoolean(value: boolean | undefined, defaultValue: boolean): boolean {
			return value !== undefined ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is a valida date
		 *
		 * @protected
		 * @param {string} value
		 * @param {string} defaultValue
		 * @return {*}  {(string | Date)}
		 * @memberof AbstractConfiguration
		 */
		protected validateDate(value: string | Date, defaultValue: string): string | Date {
			return Helper.Dates.IsNull(value) === false ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a given value is within a range of values.
		 *
		 * @protected
		 * @param {unknown} value
		 * @param {unknown} defaultValue
		 * @param {...unknown[]} args
		 * @return {*}  {unknown}
		 * @memberof AbstractConfiguration
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
		 * @param {number} value
		 * @param {number} defaultValue
		 * @return {*}  {number}
		 * @memberof AbstractConfiguration
		 */
		protected validateNumber(value: number, defaultValue: number): number {
			return typeof value === 'number' ? value : defaultValue;
		}

		/**
		 * Method that helps to validate if a string is not empty or undefined.
		 *
		 * @protected
		 * @param {(string | undefined)} value
		 * @param {string} defaultValue
		 * @return {*}  {string}
		 * @memberof AbstractConfiguration
		 */
		protected validateString(value: string | undefined, defaultValue: string): string {
			return value && value.trim() ? value : defaultValue;
		}

		/**
		 * Method that validates if a given property can be changed.
		 *
		 * @param {boolean} _isBuilt
		 * @param {string} _key
		 * @return {*}  {boolean}
		 * @memberof AbstractConfiguration
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validateCanChange(_isBuilt: boolean, _key: string): boolean {
			return true;
		}

		/**
		 * Method that assures that the values being set as configurations respect the defaults.
		 *
		 * @param {string} _key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof AbstractConfiguration
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public validateDefault(_key: string, value: unknown): unknown {
			return value;
		}
	}
}
