// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress {
	export abstract class AbstractProgress<C> extends AbstractPattern<C> implements IProgress {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			console.log(`AbstractProgress Constructor - '${uniqueId}'`);
		}
	}
}
