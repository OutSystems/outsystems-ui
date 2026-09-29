/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.MonthPicker.Factory {
	/**
	 * Create the new MonthPicker instance object according given provider
	 *
	 * @export
	 * @param {string} monthPickerId ID of the Pattern that a new instance will be created.
	 * @param {string} provider
	 * @param {(string | Record<string, unknown>)} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.Progress.IMonthPicker}
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
