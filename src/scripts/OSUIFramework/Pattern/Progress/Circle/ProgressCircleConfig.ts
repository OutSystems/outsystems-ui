/// <reference path="../AbstractProgressConfiguration.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle {
	export class ProgressCircleConfig extends Progress.ProgressConfiguration {
		public CircleThickness: number;
		public Progress: number;
		public ProgressColor: string;
		public ProgressType: string;
		public TextColor: string;
		public TrailColor: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
