// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns.Configuration {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export abstract class AbstractConfiguration {
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			// eslint-disable-next-line prefer-const
			for (let key in config) {
				if (config[key] !== undefined) this[key] = config[key];
			}
		}
	}
}
