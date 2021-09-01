// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.ProgressEnum {
	/**
	 * Progress Enum Common classes
	 */
	export enum CssClass {
		AddInitialAnimation = 'animate-entrance',
		Container = 'osui-progress-container',
		Content = 'osui-progress-content',
		Trail = 'osui-progress-trail',
	}

	/**
	 * Progress Enum Inline Style Attributes
	 */
	export enum InlineStyleProp {
		ProgressColor = '--progress-color',
		ProgressValue = '--progress-value',
		Shape = '--shape',
		Thickness = '--thickness',
		TrailColor = '--trail-color',
	}

	/**
	 * ProgressCircle Enum properties
	 */
	export enum Properties {
		ExtendedClass = 'ExtendedClass',
		Progress = 'Progress',
		ProgressColor = 'ProgressColor',
		Shape = 'Shape',
		Thickness = 'Thickness',
		TrailColor = 'TrailColor',
	}

	/**
	 * Progress Enum Shape Types
	 */
	export enum ShapeTypes {
		Round = 'round',
		Rounded = 'rounded',
		Soft = 'soft',
		Sharp = 'sharp',
	}
}
