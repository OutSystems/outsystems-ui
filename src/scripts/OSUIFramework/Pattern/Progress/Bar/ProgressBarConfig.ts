/// <reference path="../AbstractProgressConfiguration.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Bar {
	export class ProgressBarConfig extends Progress.ProgressConfiguration {
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
