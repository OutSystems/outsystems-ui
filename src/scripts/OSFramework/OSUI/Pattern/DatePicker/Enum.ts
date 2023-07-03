// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/DatePicker/Enum.ts
namespace OSFramework.Patterns.DatePicker.Enum {
========
namespace OSFramework.OSUI.Patterns.DatePicker.Enum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/DatePicker/Enum.ts
	/**
	 * DatePicker Enum for CSS Classes
	 */
	export enum CssClass {
		Calendar = 'osui-datepicker-calendar',
		Pattern = 'osui-datepicker',
	}

	/**
	 * DatePicker Events
	 */
	export enum DatePickerEvents {
		OnChange = 'OnChange',
		OnInitialize = 'OnInitialize',
	}

	// Datepicker Mode Types
	export enum Mode {
		Range = 'range',
		Single = 'single',
	}

	/**
	 * DatePicker Enum properties
	 */
	export enum Properties {
		DateFormat = 'DateFormat',
		FirstWeekDay = 'FirstWeekDay',
		MaxDate = 'MaxDate',
		MinDate = 'MinDate',
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
	 * DatePicker TimeFormatMode Enum
	 */
	export enum TimeFormatMode {
		Disable = 'disabled',
		Time12hFormat = '12',
		Time24hFormat = '24',
	}
}
