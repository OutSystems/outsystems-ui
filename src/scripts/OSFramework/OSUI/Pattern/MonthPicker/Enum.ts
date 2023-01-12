// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.MonthPicker.Enum {
	/**
	 * MonthPicker Enum for CSS Classes
	 */
	export enum CssClass {
		Dropdown = 'osui-monthpicker__dropdown',
		Pattern = 'osui-monthpicker',
	}

	/**
	 * MonthPicker Events
	 */
	export enum Events {
		OnInitialized = 'OnInitialized',
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
	}

	/**
	 * MonthPicker Enum for Providers
	 */
	export enum Provider {
		Flatpickr = 'flatpickr',
	}
}
