// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.ProgressEnum {
	/**
	 * Progress Enum AriaLabel
	 */
	export enum AriaLabel {
		Progress = 'progress',
	}
	/**
	 * Progress Enum Common classes
	 */
	export enum CssClass {
		AddInitialAnimation = 'animate-entrance',
		AnimateProgressChange = 'animate-progress-change',
		Container = 'osui-progress-bar__container',
		ProgressBarContent = 'osui-progress-bar__content',
		ProgressCircleContent = 'osui-progress-circle__content',
	}

	/**
	 * Progress Enum Inline Style Attributes
	 */
	export enum InlineStyleProp {
		ProgressColor = '--progress-color',
		ProgressValue = '--progress-value',
		ProgressGradient = '--progress-gradient',
		ProgressInitialSpeed = '--progress-initial-speed',
		ProgressSpeed = '--progress-speed',
		Shape = '--shape',
		Thickness = '--thickness',
		TrailColor = '--trail-color',
	}

	/**
	 * Progress Enum Gradient Types
	 */
	export enum Gradient {
		LinearHorizontal = 'LinearHorizontal',
		LinearVertical = 'LinearVertical',
		LinearDiagonally = 'LinearDiagonally',
		Radial = 'Radial',
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
		ProgressCircleSize = 'ProgressCircleSize',
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
