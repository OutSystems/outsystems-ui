// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Progress/AbstractProgressConfiguration.ts
namespace OSFramework.Patterns.Progress {
========
namespace OSFramework.OSUI.Patterns.Progress {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Progress/AbstractProgressConfiguration.ts
	export abstract class ProgressConfiguration extends AbstractConfiguration {
		public AnimateInitialProgress: boolean;
		public InitialProgress: number;
		public Progress: number;
		public ProgressCircleSize: string;
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
