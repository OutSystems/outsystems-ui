// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress {
	export abstract class ProgressConfiguration extends AbstractConfiguration {
		/** Animates the fill from 0 to InitialProgress when the pattern is built. */
		public AnimateInitialProgress: boolean;
		/** Progress shown when the pattern is built, from 0 to 100. */
		public InitialProgress: number;
		/** Current progress, from 0 to 100; values outside the range are clamped. */
		public Progress: number;
		/** Diameter of the circle (CSS length); used by the circle type only. */
		public ProgressCircleSize: string;
		/** Color of the progress fill: a color name from the theme palette or a CSS color. */
		public ProgressColor: string;
		/** Shape of the progress ends: soft, rounded or none (sharp). */
		public Shape: string;
		/** Thickness of the bar or of the circle stroke, in pixels. */
		public Thickness: number;
		/** Color of the unfilled track: a color name from the theme palette or a CSS color. */
		public TrailColor: string;
	}
}
