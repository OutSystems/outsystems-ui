// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActions {
	export class FloatingActionsConfig extends AbstractConfiguration {
		public ExtendedClass: string;
		public FloatingId: string;
		public IsExpanded: boolean;
		public IsHover: boolean;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
