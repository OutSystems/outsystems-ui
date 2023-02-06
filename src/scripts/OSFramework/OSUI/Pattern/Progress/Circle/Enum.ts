// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.Circle.Enum {
	/**
	 * ProgressCircle Enum CssClasses
	 */
	export enum CssClass {
		Progress = 'osui-progress-circle__container__progress-path',
		Trail = 'osui-progress-circle__container__trail-path',
	}

	/**
	 * ProgressCircle Enum Inline Style Attributes
	 */
	export enum InlineStyleProp {
		CircleRadius = '--radius',
		CircleSize = '--circle-size',
		ProgressCircleSize = '--progress-circle-size',
		StrokeDasharray = '--stroke-dasharray',
		StrokeDashoffset = '--stroke-dashoffset',
	}

	export enum DefaultValues {
		PercentualSize = '100%',
	}
}
