// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress {
	export abstract class ProgressConfiguration extends AbstractConfiguration {
		public AnimateInitialProgress: boolean;
		public InitialProgress: number;
		public Progress: number;
		public ProgressColor: string;
		public Shape: string;
		public Thickness: number;
		public TrailColor: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
