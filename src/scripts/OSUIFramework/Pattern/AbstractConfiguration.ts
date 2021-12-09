// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
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
					//this[key] = config[key];
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					this[key] = this.validateDefault(key, config[key]) as any;
				}
			}
		}

		protected validateBoolean(value: boolean | undefined, defaultValue: boolean): boolean {
			return value !== undefined ? value : defaultValue;
		}

		protected validateInRange(value: unknown, defaultValue: unknown, ...args: unknown[]): unknown {
			if (value && args.includes(value)) {
				return value;
			}
			return defaultValue;
		}

		protected validateString(value: string | undefined, defaultValue: string): string {
			return value && value.trim() ? value : defaultValue;
		}

		public validateDefault(key: string, value: unknown): unknown {
			return value;
		}
	}
}
