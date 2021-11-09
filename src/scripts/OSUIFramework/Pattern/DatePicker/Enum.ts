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
		OnClose = 'OnClose',
		OnInitialize = 'OnInitialize',
		OnOpen = 'OnOpen',
	}

	/**
	 * DatePicker Enum properties
	 */
	export enum Properties {
		AdvancedConfigs = 'AdvancedConfigs',
		FirstWeekDay = 'FirstWeekDay',
		InitialDate = 'InitialDate',
		InputDateFormat = 'InputDateFormat',
		MaxDate = 'MaxDate',
		MinDate = 'MinDate',
		ServerDateFormat = 'ServerDateFormat',
		ShowMonths = 'ShowMonths',
		ShowTodayButton = 'ShowTodayButton',
		ShowWeekNumbers = 'ShowWeekNumbers',
		TimeFormat = 'TimeFormat',
		Type = 'Type',
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

	/**
	 * DatePicker Types Enum
	 */
	export enum Type {
		Multiple = 'multiple',
		Range = 'range',
		Single = 'single',
	}
}
