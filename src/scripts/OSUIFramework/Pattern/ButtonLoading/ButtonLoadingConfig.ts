// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.ButtonLoading {
	export class ButtonLoadingConfig extends AbstractConfiguration {
		public IsLoading: boolean;
		public ShowLoadingAndLabel: boolean;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
