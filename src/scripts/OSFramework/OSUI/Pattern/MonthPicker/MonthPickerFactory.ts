/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.MonthPicker.Factory {
	/**
	 * Create the new MonthPicker instance object according given provider
	 *
	 * @param monthPickerId ID of the Pattern that a new instance will be created.
	 * @param provider Provider library that implements the month picker
	 * @param configs Configurations for the Pattern in JSON format.
	 */
	export function NewMonthPicker(
		monthPickerId: string,
		provider: string,
		configs: string | Record<string, unknown>
	): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker {
		let _monthPickerItem = null;

		if (provider === Enum.Provider.Flatpickr) {
			_monthPickerItem = new Providers.OSUI.MonthPicker.Flatpickr.OSUIFlatpickrMonth(
				monthPickerId,
				OSFramework.OSUI.Helper.ParseConfigs(configs)
			);
		} else {
			throw new Error(`There is no ${GlobalEnum.PatternName.MonthPicker} of the ${provider} provider`);
		}

		return _monthPickerItem;
	}
}
