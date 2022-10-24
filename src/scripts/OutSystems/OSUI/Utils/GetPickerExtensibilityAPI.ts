/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Method to get the correct SetProvider Extensibility actions, based on widgetId
 */
namespace OutSystems.OSUI.Utils {
	/**
	 * Types of Provider Extensibility methods
	 *
	 * @export
	 * @enum {number}
	 */
	export enum APIMethod {
		SetProviderConfigs = 'SetProviderConfigs',
		SetProviderEvent = 'SetProviderEvent',
		UnsetProviderEvent = 'UnsetProviderEvent',
	}

	/**
	 * Method to get the correct Provider API
	 *
	 * @export
	 * @param {string} widgetId
	 * @param {APIMethod} method
	 * @return {*}  {OSFramework.GlobalCallbacks.Generic}
	 */
	export function GetPickerExtensibilityAPI(
		widgetId: string,
		method: APIMethod
	): OSFramework.GlobalCallbacks.Generic {
		try {
			OutSystems.OSUI.Patterns.DatePickerAPI.GetDatePickerItemById(widgetId);
			return OutSystems.OSUI.Patterns.DatePickerAPI[method];
		} catch (error) {
			try {
				OutSystems.OSUI.Patterns.TimePickerAPI.GetTimePickerItemById(widgetId);
				return OutSystems.OSUI.Patterns.TimePickerAPI[method];
			} catch (error) {
				try {
					OutSystems.OSUI.Patterns.MonthPickerAPI.GetMonthPickerItemById(widgetId);
					return OutSystems.OSUI.Patterns.MonthPickerAPI[method];
				} catch (error) {
					console.warn(`WidgetId: ${widgetId} is not valid.`);
				}
			}
		}
	}
}
