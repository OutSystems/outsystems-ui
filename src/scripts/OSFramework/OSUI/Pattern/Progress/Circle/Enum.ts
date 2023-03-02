// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.Circle.Enum {
	/**
	 * ProgressCircle Enum CssClasses
	 */
	export enum CssClass {
		Progress = 'osui-progress-circle__container__progress-path',
		SVG = 'svg-wrapper',
		Trail = 'osui-progress-circle__container__trail-path',
	}

	/**
	 * ProgressCircle Enum Inline Style Attributes
	 */
	export enum InlineStyleProp {
		CircleRadius = '--radius',
		CircleSize = '--circle-size',
		GradientURL = '--progress-circle-gradient-url',
		ProgressCircleSize = '--progress-circle-size',
		StrokeDasharray = '--stroke-dasharray',
		StrokeDashoffset = '--stroke-dashoffset',
	}

	/**
	 * ProgressCircle default values
	 */
	export enum DefaultValues {
		GradientId = 'progressGradient-',
		RadialFr = '15%',
		RadialRadius = '95%',
		Size = 'auto',
	}

	/**
	 * ProgressCircle Gradient name expected by the svg
	 */
	export enum GradientName {
		Linear = 'linearGradient',
		Radial = 'radialGradient',
	}
}
