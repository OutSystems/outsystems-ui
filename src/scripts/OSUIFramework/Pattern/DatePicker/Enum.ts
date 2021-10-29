// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker.Enum {
	/**
	 * DatePicker Enum properties
	 */
	export enum Properties {
		DefaultDate = 'DefaultDate',
		InputDateFormat = 'InputDateFormat',
		InputWidgetId = 'InputWidgetId',
		ServerDateFormat = 'ServerDateFormat',
		Show24HourFormat = 'Show24HourFormat',
		ShowTime = 'ShowTime',
	}

	/**
	 * DatePicker Enum for Providers
	 */
	export enum Provider {
		FlatPicker = 'flatpickr',
	}

	/**
	 * DatePicker Events
	 */
	export enum DatePickerEvents {
		OnChange = 'OnChange',
		OnClose = 'OnClose',
		OnInitialize = 'OnInitialize',
		OnOpen = 'OnOpen',
	}

	/**
	 * DatePicker Enum for CSS Classes
	 */
	export enum CssClass {}
}
