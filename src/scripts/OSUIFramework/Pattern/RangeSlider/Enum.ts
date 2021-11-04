// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.RangeSlider.Enum {
	/**
	 * RangeSlider Enum properties
	 */
	export enum Properties {
		ChangeEventDuringSlide = 'ChangeEventDuringSlide',
		InitialValueEnd = 'InitialValueEnd',
		InitialValueStart = 'InitialValueStart',
		IsDisabled = 'IsDisabled',
		IsVertical = 'IsVertical',
		MaxValue = 'MaxValue',
		MinValue = 'MinValue',
		PipsStep = 'PipsStep',
		ShowPips = 'ShowPips',
		ShowTooltip = 'ShowTooltip',
		Step = 'Step',
		VerticalHeight = 'VerticalHeight',
	}

	/**
	 * RangeSlider Enum for CSS Classes
	 */
	export enum CssClass {
		RangeSlider = 'osui-range-slider',
		RangeSliderProviderElem = 'osui-range-slider_provider',
	}

	/**
	 * RangeSlider Enum for CSS Properties
	 */
	export enum CssProperties {
		VerticalHeight = '--vertical-height',
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
