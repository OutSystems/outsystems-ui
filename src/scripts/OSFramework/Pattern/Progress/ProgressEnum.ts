// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Progress.ProgressEnum {
	/**
	 * Progress Enum Common classes
	 */
	export enum CssClass {
		AddInitialAnimation = 'animate-entrance',
		AnimateProgressChange = 'animate-progress-change',
		Container = 'osui-progress-bar__container',
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
		MaxProgressValue = 100,
		MinProgressValue = 0,
		Progress = 'Progress',
		ProgressColor = 'ProgressColor',
		Shape = 'Shape',
		Thickness = 'Thickness',
		TrailColor = 'TrailColor',
	}

	// Progress Types
	export enum ProgressTypes {
		Bar = 'Bar',
		Circle = 'Circle',
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
