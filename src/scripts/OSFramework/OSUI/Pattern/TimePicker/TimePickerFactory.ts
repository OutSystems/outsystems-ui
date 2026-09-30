/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.TimePicker.Factory {
	/**
	 * Create the new TimePicker instance object according given provider
	 *
	 * @param timePickerId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @param provider
	 */
	export function NewTimePicker(
		timePickerId: string,
		configs: string | Record<string, unknown>,
		provider: string
	): Patterns.TimePicker.ITimePicker {
		let _timePickerItem = null;

		if (provider === Enum.Provider.FlatPicker) {
			_timePickerItem = new Providers.OSUI.TimePicker.Flatpickr.OSUIFlatpickrTime(
				timePickerId,
				OSFramework.OSUI.Helper.ParseConfigs(configs)
			);
		} else {
			throw new Error(`There is no ${GlobalEnum.PatternName.Timepicker} of the ${provider} provider`);
		}

		return _timePickerItem;
	}
}
