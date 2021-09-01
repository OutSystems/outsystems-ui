// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle.Enum {
	/**
	 * ProgressCircle Enum CssClasses
	 */
	export enum CssClass {
		Container = 'osui-progress-container',
		Progress = 'osui-progress--progress-path',
		TextContainer = 'osui-progress-text',
		Trail = 'osui-progress--trail-path',
	}

	/**
	 * ProgressCircle Enum Inline Style Attributes
	 */
	export enum InlineStyleProp {
		CircleRadius = '--circle-r',
		CircleThickness = '--circle-thickness',
		ProgressColor = '--progress-color',
		Shape = '--shape-style',
		TrailColor = '--trail-color',
	}

	/**
	 * ProgressCircle Enum properties
	 */
	export enum Properties {
		CircleThickness = 'CircleThickness',
		ExtendedClass = 'ExtendedClass',
		Progress = 'Progress',
		ProgressColor = 'ProgressColor',
		Shape = 'Shape',
		TrailColor = 'TrailColor',
	}
}
