// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TimePicker.Enum {
	/**
	 * TimePicker Enum for CSS Classes
	 */
	export enum CssClass {
		Dropdown = 'osui-timepicker__dropdown',
		Pattern = 'osui-timepicker',
	}

	/**
	 * TimePicker Events
	 */
	export enum TimePickerEvents {
		OnChange = 'OnChange',
	}

	/**
	 * TimePicker Enum properties
	 */
	export enum Properties {
		InitialTime = 'InitialTime',
		Is24Hours = 'Is24Hours',
		MaxTime = 'MaxTime',
		MinTime = 'MinTime',
		TimeFormat = 'TimeFormat',
	}

	/**
	 * TimePicker Enum for Providers
	 */
	export enum Provider {
		FlatPicker = 'flatpickr',
	}

	/**
	 * TimePicker TimeFormatMode Enum
	 */
	export enum TimeFormatMode {
		Time12hFormat = '12',
		Time24hFormat = '24',
	}
}
