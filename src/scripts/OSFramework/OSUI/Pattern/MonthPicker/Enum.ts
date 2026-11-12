// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.MonthPicker.Enum {
	/**
	 * MonthPicker Enum for CSS Classes
	 */
	export enum CssClass {
		Dropdown = 'osui-monthpicker__dropdown',
		InvalidInput = 'osui-monthpicker--invalid-input',
		Pattern = 'osui-monthpicker',
	}

	/**
	 * MonthPicker Events
	 */
	export enum Events {
		OnInvalidInput = 'OnInvalidInput',
		OnSelected = 'OnSelected',
	}

	/**
	 * MonthPicker Enum properties
	 */
	export enum Properties {
		DateFormat = 'DateFormat',
		InitialMonth = 'InitialMonth',
		MinMonth = 'MinMonth',
		MaxMonth = 'MaxMonth',
		StrictInputValidation = 'StrictInputValidation',
	}

	/**
	 * MonthPicker Enum for Providers
	 */
	export enum Provider {
		Flatpickr = 'flatpickr',
	}
}
