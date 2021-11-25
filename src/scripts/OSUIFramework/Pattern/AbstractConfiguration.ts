// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	export abstract class AbstractConfiguration {
		public ExtendedClass: string;

		constructor(config: JSON) {
			// eslint-disable-next-line prefer-const
			for (let key in config) {
				if (config[key] !== undefined) this[key] = config[key];
			}
		}
	}
}
