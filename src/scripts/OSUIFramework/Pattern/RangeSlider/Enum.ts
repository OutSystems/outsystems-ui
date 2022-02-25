// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider.Enum {
	/**
	 * RangeSlider Enum for CSS Classes
	 */
	export enum CssClass {
		ClassModifier = 'osui-range-slider--is-',
		IsInterval = 'osui-range-slider--is-interval',
		RangeSlider = 'osui-range-slider',
		RangeSliderProviderElem = 'osui-range-slider__provider',
	}

	/**
	 * RangeSlider Enum for CSS Properties
	 */
	export enum CssProperties {
		Size = '--range-slider-size',
	}

	export enum DefaultValues {
		PercentualSize = '100%',
		PixelSize = '100px',
	}

	/**
	 * RangeSlider Enum properties
	 */
	export enum Properties {
		IsDisabled = 'IsDisabled',
		MaxValue = 'MaxValue',
		MinValue = 'MinValue',
		Orientation = 'Orientation',
		ShowTickMarks = 'ShowTickMarks',
		ShowFloatingLabel = 'ShowFloatingLabel',
		Size = 'Size',
		StartingValueTo = 'StartingValueTo',
		StartingValueFrom = 'StartingValueFrom',
		Step = 'Step',
		TickMarksInterval = 'TickMarksInterval',
	}

	/**
	 * RangeSlider Enum for Providers
	 */
	export enum Provider {
		NoUiSlider = 'noUiSlider',
	}

	/**
	 * RangeSlider Events
	 */
	export enum RangeSliderEvents {
		OnInitialize = 'OnInitialize',
		OnValueChange = 'OnValueChange',
	}

	/**
	 * RangeSlider Types
	 */
	export enum RangeSliderTypes {
		Slider = 'slider',
		Interval = 'interval',
	}
}
