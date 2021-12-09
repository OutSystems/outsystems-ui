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

		protected validateBoolean(value: boolean | undefined, defaultVAlue: boolean): boolean {
			return value !== undefined ? value : defaultVAlue;
		}

		public validateDefault(key: string, value: unknown): unknown {
			return value;
		}
	}
}
