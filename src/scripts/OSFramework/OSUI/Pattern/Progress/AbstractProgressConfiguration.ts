// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress {
	export abstract class ProgressConfiguration extends AbstractConfiguration {
		public AnimateInitialProgress: boolean;
		public InitialProgress: number;
		public Progress: number;
		public ProgressCircleSize: string;
		public ProgressColor: string;
		public Shape: string;
		public Thickness: number;
		public TrailColor: string;
	}
}
