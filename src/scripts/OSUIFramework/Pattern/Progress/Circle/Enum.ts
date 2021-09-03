// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle.Enum {
	/**
	 * ProgressCircle Enum CssClasses
	 */
	export enum CssClass {
		Container = 'osui-progress-container',
		Content = 'osui-progress-content',
		Progress = 'osui-progress-progress-path',
		Trail = 'osui-progress-trail-path',
	}

	/**
	 * ProgressCircle Enum Inline Style Attributes
	 */
	export enum InlineStyleProp {
		CircleSize = '--circle-size',
		ProgressColor = '--progress-color',
		Shape = '--shape-style',
		StrokeDasharray = '--stroke-dasharray',
		StrokeDashoffset = '--stroke-dashoffset',
		Thickness = '--circle-thickness',
		TrailColor = '--trail-color',
	}

	/**
	 * ProgressCircle Enum properties
	 */
	export enum Properties {
		Thickness = 'CircleThickness',
		ExtendedClass = 'ExtendedClass',
		Progress = 'Progress',
		ProgressColor = 'ProgressColor',
		Shape = 'Shape',
		TrailColor = 'TrailColor',
	}
}
