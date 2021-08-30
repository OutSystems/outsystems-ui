// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Circle.Enum {
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

	/**
	 * ProgressCircle Enum CssClasses
	 */
	export enum CssClass {
		Container = 'osui-progress-circle',
		Progress = 'osui-progress-circle--progress',
		TextContainer = 'osui-progress-circle-text',
		Trail = 'osui-progress-circle--trail',
	}

	/**
	 * ProgressCircle Enum Inline Style Attributes
	 */
	export enum InlineStyleProp {
		CircleThickness = '--circle-thickness',
		ProgressColor = '--progress-color',
		Shape = '--shape-style',
		TrailColor = '--trail-color',
	}
}
