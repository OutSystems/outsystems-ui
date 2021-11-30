// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export abstract class AbstractConfiguration {
		public ExtendedClass: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: JSON) {
			// eslint-disable-next-line prefer-const
			for (let key in config) {
				if (config[key] !== undefined) this[key] = config[key];
			}
		}
	}
}
