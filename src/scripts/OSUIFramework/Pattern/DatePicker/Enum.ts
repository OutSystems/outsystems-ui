// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DatePicker.Enum {
	/**
	 * DatePicker Enum for CSS Classes
	 */
	export enum CssClass {}

	/**
	 * DatePicker Events
	 */
	export enum DatePickerEvents {
		OnChange = 'OnChange',
		OnInitialize = 'OnInitialize',
	}

	/**
	 * DatePicker Enum properties
	 */
	export enum Properties {
		FirstWeekDay = 'FirstWeekDay',
		InitialDate = 'InitialDate',
		DateFormat = 'DateFormat',
		MaxDate = 'MaxDate',
		MinDate = 'MinDate',
		ShowMonths = 'ShowMonths',
		ShowTodayButton = 'ShowTodayButton',
		ShowWeekNumbers = 'ShowWeekNumbers',
		TimeFormat = 'TimeFormat',
	}

	/**
	 * DatePicker Enum for Providers
	 */
	export enum Provider {
		FlatPicker = 'flatpickr',
	}

	/**
	 * DatePicker TimeFormat Enum
	 */
	export enum TimeFormat {
		Disable = '',
		Time12hFormat = '12',
		Time24hFormat = '24',
	}
}
